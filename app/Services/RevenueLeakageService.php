<?php

namespace App\Services;

use Illuminate\Support\Collection;
use App\Models\SeoAudit;

class RevenueLeakageService
{
    /**
     * Helper to find values in audit responses
     */
    private function findValue(SeoAudit $audit, string $keyword): string
    {
        $cleanKeyword = str_replace(['-', '_', ' '], '', strtolower($keyword));
        
        // Find the best matching response using a priority system
        $response = $audit->responses->sortByDesc(function($r) use ($cleanKeyword) {
            $key = str_replace(['-', '_', ' '], '', strtolower($r->field_key));
            
            // Exact match gets highest priority
            if ($key === $cleanKeyword) return 100;
            
            // Keyword specific mapping priorities
            if ($cleanKeyword === 'pitched' && (str_contains($key, 'offertiming') || str_contains($key, 'firstoffertiming'))) return 90;
            if ($cleanKeyword === 'classification' && (str_contains($key, 'convclassification') || str_contains($key, 'classification'))) return 90;
            if ($cleanKeyword === 'type' && (str_contains($key, 'pitchedcontenttype') || str_contains($key, 'contenttype'))) return 90;
            if ($cleanKeyword === 'sale' && (str_contains($key, 'makesale') || str_contains($key, 'didachattermakesale'))) return 90;
            if ($cleanKeyword === 'negotiate' && (str_contains($key, 'negotiate') || str_contains($key, 'discipline'))) return 90;
            if ($cleanKeyword === 'aftercare' && str_contains($key, 'aftercare')) return 90;
            if ($cleanKeyword === 'upsell' && str_contains($key, 'upsell')) return 90;
            if ($cleanKeyword === 'buy' && (str_contains($key, 'purchase') || str_contains($key, 'buy'))) return 90;
            if ($cleanKeyword === 'sexting' && str_contains($key, 'continue')) return 90;
            
            return str_contains($key, $cleanKeyword) ? 10 : 0;
        })->first();

        return trim(strtoupper($response?->value ?? ''));
    }

    /**
     * 1. Sexting - No sale (paywall)
     */
    public function getSextingNoSaleCount(Collection $sextingPitched): int
    {
        return $sextingPitched->filter(fn ($a) => 
            str_contains($this->findValue($a, 'sale'), 'NO') || 
            str_contains($this->findValue($a, 'negotiate'), 'NO')
        )->count();
    }

    /**
     * 2. Sexting - Subscriber didn't continue
     */
    public function getSextingAbandonedCount(Collection $sextingPitched): int
    {
        return $sextingPitched->filter(fn ($a) => 
            $this->findValue($a, 'sale') === 'YES' && 
            $this->findValue($a, 'sexting') === 'NO'
        )->count();
    }

    /**
     * 3. Pre-recorded PPV - No sale
     */
    public function getPpvNoSaleCount(Collection $preRecordedPitched): int
    {
        return $preRecordedPitched->filter(fn ($a) => str_contains($this->findValue($a, 'sale'), 'NO'))->count();
    }

    /**
     * 4. Upsell opportunity lost
     */
    public function getUpsellLostCount(Collection $preRecordedPitched): int
    {
        return $preRecordedPitched->filter(fn ($a) => 
            $this->findValue($a, 'sale') === 'YES' && 
            $this->findValue($a, 'upsell') === 'NO'
        )->count();
    }

    /**
     * 5. Upsell attempted but failed
     */
    public function getUpsellFailedCount(Collection $preRecordedPitched): int
    {
        return $preRecordedPitched->filter(fn ($a) => 
            $this->findValue($a, 'upsell') === 'YES' && 
            ($this->findValue($a, 'buy') === 'NO' || $this->findValue($a, 'purchase') === 'NO')
        )->count();
    }

    /**
     * 6. Aftercare not provided
     */
    public function getAftercareMissedCount(Collection $sellableAudits): int
    {
        return $sellableAudits->filter(fn ($a) => str_contains($this->findValue($a, 'aftercare'), 'NO'))->count();
    }

    /**
     * 7. Total Aggregated Stats with Formulas
     */
    public function calculateAll(Collection $audits, ?\App\Models\Agency $agency = null): array
    {
        // Preparation logic
        $sellable = $audits->filter(fn ($a) => str_contains($this->findValue($a, 'classification'), 'SELLABLE'));
        $pitched = $sellable->filter(fn ($a) => str_contains($this->findValue($a, 'pitched'), 'YES'));
        
        $sextingPitched = $pitched->filter(fn ($a) => str_contains($this->findValue($a, 'type'), 'SEXTING'));
        $preRecorded = $pitched->filter(fn ($a) => 
            str_contains(str_replace('-', '', $this->findValue($a, 'type')), 'PRERECORDED') ||
            str_contains($this->findValue($a, 'type'), 'PPV')
        );

        $totalSalesCount = $audits->filter(fn ($a) => $this->findValue($a, 'sale') === 'YES')->count();

        // Metrics from Agency
        $firstSextingPaywall = $agency->first_paywall_sexting ?? 0;
        $avgSextingSequence = $agency->avg_completed_sexting_sequence ?? 0;
        $avgPpv = $agency->avg_recorded_ppv ?? 0;
        $avgSaleValue = $avgPpv; // Fallback for aftercare calculation

        // Counts
        $sextingNoSaleCount = $this->getSextingNoSaleCount($sextingPitched);
        $sextingAbandonedCount = $this->getSextingAbandonedCount($sextingPitched);
        $ppvNoSaleCount = $this->getPpvNoSaleCount($preRecorded);
        $upsellLostCount = $this->getUpsellLostCount($preRecorded);
        $upsellFailedCount = $this->getUpsellFailedCount($preRecorded);
        $aftercareMissedCount = $this->getAftercareMissedCount($sellable);

        // Phase I - Revenue Leakage Calculations
        $leakageSextingNoSale = $sextingNoSaleCount * $firstSextingPaywall;
        $leakageSextingAbandoned = $sextingAbandonedCount * ($avgSextingSequence * 0.5);
        $leakagePpvNoSale = $ppvNoSaleCount * $avgPpv;
        $leakageUpsellLost = $upsellLostCount * $avgPpv;
        $leakageUpsellFailed = $upsellFailedCount * $avgPpv;
        $leakageAftercareMissed = $aftercareMissedCount * ($avgSaleValue * 0.20);

        $totalLeakage = $leakageSextingNoSale + $leakageSextingAbandoned + $leakagePpvNoSale + 
                        $leakageUpsellLost + $leakageUpsellFailed + $leakageAftercareMissed;

        // Phase II - Performance Rates
        $totalAuditsCount = $audits->count();
        $sellableCount = $sellable->count();
        $pitchedCount = $pitched->count();
        
        $sextingSold = $sextingPitched->filter(fn ($a) => $this->findValue($a, 'sale') === 'YES')->count();
        $sextingPitchedCount = $sextingPitched->count();
        
        $ppvSold = $preRecorded->filter(fn ($a) => $this->findValue($a, 'sale') === 'YES')->count();
        $ppvPitchedCount = $preRecorded->count();

        $sextingContinued = $sextingPitched->filter(fn ($a) => $this->findValue($a, 'sale') === 'YES' && $this->findValue($a, 'sexting') === 'YES')->count();
        
        $upsellAttempted = $preRecorded->filter(fn ($a) => $this->findValue($a, 'upsell') === 'YES')->count();
        $upsellPurchased = $preRecorded->filter(fn ($a) => $this->findValue($a, 'buy') === 'YES')->count();
        
        $aftercareYes = $audits->filter(fn ($a) => $this->findValue($a, 'sale') === 'YES' && $this->findValue($a, 'aftercare') === 'YES')->count();
        $totalSales = $totalSalesCount;
        
        $casualYes = $sellable->filter(fn ($a) => $this->findValue($a, 'casual') === 'YES')->count();

        return [
            // Counts
            'sexting_no_sale_count'   => $sextingNoSaleCount,
            'sexting_abandoned_count' => $sextingAbandonedCount,
            'ppv_no_sale_count'       => $ppvNoSaleCount,
            'upsell_lost_count'       => $upsellLostCount,
            'upsell_failed_count'     => $upsellFailedCount,
            'aftercare_missed_count'  => $aftercareMissedCount,

            // Leakage Amounts (Phase I)
            'leakage_sexting_no_sale'   => $leakageSextingNoSale,
            'leakage_sexting_abandoned' => $leakageSextingAbandoned,
            'leakage_ppv_no_sale'       => $leakagePpvNoSale,
            'leakage_upsell_lost'       => $leakageUpsellLost,
            'leakage_upsell_failed'     => $leakageUpsellFailed,
            'leakage_aftercare_missed'  => $leakageAftercareMissed,
            'total_revenue_lost'        => $totalLeakage,

            // Rates (Phase II)
            'conversion_rate'          => $totalAuditsCount > 0 ? ($sellableCount / $totalAuditsCount) * 100 : 0,
            'pitch_rate'               => $sellableCount > 0 ? ($pitchedCount / $sellableCount) * 100 : 0,
            'sexting_sales_rate'       => $sextingPitchedCount > 0 ? ($sextingSold / $sextingPitchedCount) * 100 : 0,
            'ppv_sales_rate'           => $ppvPitchedCount > 0 ? ($ppvSold / $ppvPitchedCount) * 100 : 0,
            'sexting_continuation_rate'=> $sextingSold > 0 ? ($sextingContinued / $sextingSold) * 100 : 0,
            'upsell_attempt_rate'      => $ppvSold > 0 ? ($upsellAttempted / $ppvSold) * 100 : 0,
            'upsell_conversion_rate'   => $upsellAttempted > 0 ? ($upsellPurchased / $upsellAttempted) * 100 : 0,
            'aftercare_provided_rate'  => $totalSales > 0 ? ($aftercareYes / $totalSales) * 100 : 0,
            'casual_before_sexual_rate'=> $sellableCount > 0 ? ($casualYes / $sellableCount) * 100 : 0,
        ];
    }
}
