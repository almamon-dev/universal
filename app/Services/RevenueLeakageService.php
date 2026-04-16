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
     * 7. Total Aggregated Stats
     */
    public function calculateAll(Collection $audits): array
    {
        // Preparation logic
        $sellable = $audits->filter(fn ($a) => str_contains($this->findValue($a, 'classification'), 'SELLABLE'));
        
        $pitched = $sellable->filter(fn ($a) => str_contains($this->findValue($a, 'pitched'), 'YES'));
        
        $sextingPitched = $pitched->filter(fn ($a) => str_contains($this->findValue($a, 'type'), 'SEXTING'));
        
        $preRecorded = $pitched->filter(fn ($a) => 
            str_contains(str_replace('-', '', $this->findValue($a, 'type')), 'PRERECORDED') ||
            str_contains($this->findValue($a, 'type'), 'PPV')
        );

        return [
            'sexting_no_sale'   => $this->getSextingNoSaleCount($sextingPitched),
            'sexting_abandoned' => $this->getSextingAbandonedCount($sextingPitched),
            'ppv_no_sale'       => $this->getPpvNoSaleCount($preRecorded),
            'upsell_lost'       => $this->getUpsellLostCount($preRecorded),
            'upsell_failed'     => $this->getUpsellFailedCount($preRecorded),
            'aftercare_missed'  => $this->getAftercareMissedCount($sellable),
        ];
    }
}
