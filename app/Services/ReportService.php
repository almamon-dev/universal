<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\SeoAudit;
use App\Models\User;

class ReportService
{
    protected $leakageService;

    public function __construct(RevenueLeakageService $leakageService)
    {
        $this->leakageService = $leakageService;
    }

    public function getWeeklyStats(Agency $agency)
    {
        $audits = SeoAudit::join('users', 'users.id', '=', 'seo_audits.user_id')
            ->where('users.agency_id', $agency->id)
            ->select('seo_audits.*')
            ->with(['responses', 'chatter', 'user'])
            ->get();

        $findValue = function ($audit, $keyword) {
            $cleanKeyword = str_replace(['-', '_', ' '], '', strtolower($keyword));

            $response = $audit->responses->filter(function ($r) use ($cleanKeyword) {
                $key = str_replace(['-', '_', ' '], '', strtolower($r->field_key));

                // Hyper-accurate relational field matching
                if ($cleanKeyword === 'classification' && (str_contains($key, 'classification') || str_contains($key, 'state'))) {
                    return true;
                }
                if ($cleanKeyword === 'pitched' && (str_contains($key, 'offertiming') || str_contains($key, 'pitched') || str_contains($key, 'firstoffertiming'))) {
                    return true;
                }

                // Specific CATEGORY vs DETAIL matching
                if ($cleanKeyword === 'reason' || $cleanKeyword === 'reasoncategory') {
                    if (str_contains($key, 'reasoncategory') || str_contains($key, 'nopitchreasoncategory')) {
                        return true;
                    }
                }
                if ($cleanKeyword === 'reasondetail' || $cleanKeyword === 'nosellablereason') {
                    if ($key === 'templatenosellablereason') {
                        return true;
                    }
                }

                if ($cleanKeyword === 'type' && (str_contains($key, 'contenttype') || str_contains($key, 'pitchedcontenttype'))) {
                    return true;
                }
                if ($cleanKeyword === 'sale' && (str_contains($key, 'makesale') || str_contains($key, 'didachattermakesale'))) {
                    return true;
                }
                if ($cleanKeyword === 'negotiate' && (str_contains($key, 'negotiate') || str_contains($key, 'discipline'))) {
                    return true;
                }
                if ($cleanKeyword === 'transition' && (str_contains($key, 'casual') || str_contains($key, 'transition'))) {
                    return true;
                }
                if ($cleanKeyword === 'aftercare' && (str_contains($key, 'aftercare') || str_contains($key, 'pillow'))) {
                    return true;
                }
                if ($cleanKeyword === 'upsell' && str_contains($key, 'upsell')) {
                    return true;
                }

                return str_contains($key, $cleanKeyword);
            })->first();

            return trim($response?->value ?? '');
        };

        // Aggregation Logic
        $sellableAudits = $audits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'classification')), 'SELLABLE'));

        // Multi-field check for "No Pitch" reasons (Prioritize the reason if it contradicts the 'Yes' pitch)
        $pitchNotPossible = $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'reason')), 'NOT POSSIBLE')
        );

        $pitchPossibleNotExecuted = $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'reason')), 'NOT EXECUTED')
        );

        // Final Pitched list: If the auditor said "Yes" it was pitched, we count it.
        $pitchedContent = $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'pitched')), 'YES'));

        // Content Type Detection
        $sextingPitched = $pitchedContent->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'type')), 'SEXTING'));
        $preRecorded = $pitchedContent->filter(fn ($a) => str_contains(strtoupper(str_replace('-', '', $findValue($a, 'type'))), 'PRERECORDED') ||
            str_contains(strtoupper($findValue($a, 'type')), 'PPV')
        );

        $stats = [
            'total_audits' => $audits->count(),
            'sellable' => $sellableAudits->count(),
            'non_sellable' => $audits->count() - $sellableAudits->count(),

            'pitch_not_possible' => $pitchNotPossible->count(),
            'pitch_possible_not_executed' => $pitchPossibleNotExecuted->count(),

            // Detailed audits for drill-downs
            'pitch_not_possible_audits' => $pitchNotPossible->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => $findValue($a, 'reason'),
                'reasonDetail' => $findValue($a, 'reasonDetail') ?: $findValue($a, 'violation'),
            ]),
            'pitch_possible_not_executed_audits' => $pitchPossibleNotExecuted->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => $findValue($a, 'reason'),
                'reasonDetail' => $findValue($a, 'reasonDetail') ?: $findValue($a, 'violation'),
            ]),

            'sexting_pitched' => $sextingPitched->count(),
            'sexting_sale_yes' => $sextingPitched->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'YES'))->count(),
            'prerecorded_pitched' => $preRecorded->count(),
            'prerecorded_sale_yes' => $preRecorded->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'YES'))->count(),
            'sexting_sub_continued' => $sextingPitched->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sexting')), 'YES'))->count(),
            'upsell_attempted' => $preRecorded->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'upsell')), 'YES'))->count(),
            'upsell_purchased' => $preRecorded->filter(fn ($a) => (str_contains(strtoupper($findValue($a, 'buy')), 'YES') || str_contains(strtoupper($findValue($a, 'purchase')), 'YES')))->count(),

            'transition_yes' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'transition')), 'YES'))->count(),
            'total_interventions' => $audits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'intervene')), 'YES'))->count(),

            // Core Red Card Metrics (Calculated via separate RevenueLeakageService)
            ...$this->leakageService->calculateAll($audits),

            'auditor_stats' => User::where('agency_id', $agency->id)->get()->map(fn ($u) => [
                'name' => $u->name,
                'count' => $audits->where('user_id', $u->id)->count(),
            ]),
        ];

        return $stats;
    }

    public function getAgencyAuditStats(Agency $agency)
    {
        return $this->getWeeklyStats($agency);
    }
}
