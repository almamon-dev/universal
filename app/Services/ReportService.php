<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\SeoAudit;
use App\Models\User;

class ReportService
{
    protected $leakageService;

    protected $chatterService;
    protected $creatorService;

    public function __construct(RevenueLeakageService $leakageService, ChatterReportService $chatterService, CreatorReportService $creatorService)
    {
        $this->leakageService = $leakageService;
        $this->chatterService = $chatterService;
        $this->creatorService = $creatorService;
    }

    public function getWeeklyStats(Agency $agency)
    {
        $audits = SeoAudit::join('users', 'users.id', '=', 'seo_audits.user_id')
            ->where('users.agency_id', $agency->id)
            ->select('seo_audits.*')
            ->with(['responses', 'chatter', 'user'])
            ->get();

        // Temporary Debug: Log the count to see if ID 10 is included
        \Illuminate\Support\Facades\Log::info("Agency {$agency->id} - Total Audits: " . $audits->count());
        \Illuminate\Support\Facades\Log::info("Audit IDs: " . $audits->pluck('id')->implode(','));

        $findValue = function ($audit, $keyword) {
            $cleanKeyword = str_replace(['-', '_', ' '], '', strtolower($keyword));

            // Use a priority-based matching system to avoid wrong field capture
            $response = $audit->responses->sortByDesc(function ($r) use ($cleanKeyword) {
                $key = str_replace(['-', '_', ' '], '', strtolower($r->field_key));

                // Exact match gets top priority
                if ($key === $cleanKeyword) {
                    return 100;
                }

                // Specific keyword mappings
                if ($cleanKeyword === 'pitched' && (str_contains($key, 'offertiming') || str_contains($key, 'firstoffertiming') || str_contains($key, 'pitched'))) {
                    return 90;
                }
                if ($cleanKeyword === 'classification' && (str_contains($key, 'classification') || str_contains($key, 'convclassification'))) {
                    return 90;
                }
                if ($cleanKeyword === 'type' && (str_contains($key, 'contenttype') || str_contains($key, 'pitchedcontenttype'))) {
                    return 90;
                }
                if ($cleanKeyword === 'sale' && (str_contains($key, 'makesale') || str_contains($key, 'didachattermakesale'))) {
                    return 90;
                }
                if ($cleanKeyword === 'aftercare' && (str_contains($key, 'aftercare') || str_contains($key, 'pillow'))) {
                    return 90;
                }
                if ($cleanKeyword === 'upsell' && str_contains($key, 'upsell')) {
                    return 90;
                }
                if ($cleanKeyword === 'transition' && (str_contains($key, 'casual') || str_contains($key, 'transition'))) {
                    return 90;
                }
                if ($cleanKeyword === 'sexting' && str_contains($key, 'continue')) {
                    return 90;
                }
                if ($cleanKeyword === 'intervene' && (str_contains($key, 'intervene') || str_contains($key, 'intervention'))) {
                    return 90;
                }
                if ($cleanKeyword === 'help' && (str_contains($key, 'help') || str_contains($key, 'requested'))) {
                    return 90;
                }
                if ($cleanKeyword === 'violation' && (str_contains($key, 'violation') || str_contains($key, 'rule'))) {
                    return 90;
                }
                if ($cleanKeyword === 'discipline' && (str_contains($key, 'discipline') || str_contains($key, 'negotiate'))) {
                    return 90;
                }
                if ($cleanKeyword === 'subscribertype' && (str_contains($key, 'subscribertype') || str_contains($key, 'subtype'))) {
                    return 90;
                }
                if (($cleanKeyword === 'buy' || $cleanKeyword === 'purchase') && (str_contains($key, 'purchase') || str_contains($key, 'buy'))) {
                    return 90;
                }
                if ($cleanKeyword === 'reason' && (str_contains($key, 'reasoncategory') || str_contains($key, 'pitchreasoncategory') || str_contains($key, 'nopitchreason'))) {
                    return 95;
                }
                if ($cleanKeyword === 'reasondetail' && (str_contains($key, 'reason') && !str_contains($key, 'category'))) {
                    return 90;
                }

                return str_contains($key, $cleanKeyword) ? 10 : 0;
            })->first();

            return trim($response?->value ?? '');
        };

        // Aggregation Logic (Broaden to catch YES or SELLABLE)
        $sellableAudits = $audits->filter(function ($a) use ($findValue) {
            $val = strtoupper($findValue($a, 'classification'));

            return str_contains($val, 'SELLABLE') || $val === 'YES';
        });

        // Multi-field check for "No Pitch" reasons (checking both reason categories and status)
        $pitchNotPossible = $sellableAudits->filter(function($a) use ($findValue) {
            $val = strtoupper($findValue($a, 'reason'));
            return str_contains($val, 'PITCH NOT POSSIBLE') || (str_contains($val, 'NOT') && str_contains($val, 'POSSIBLE') && !str_contains($val, 'EXECUTED'));
        });

        // Final Pitched list: Look for positive responses
        $pitchedContent = $sellableAudits->filter(function ($a) use ($findValue) {
            $val = strtoupper($findValue($a, 'pitched'));

            return $val !== '' && ! str_contains($val, 'NO') && ! str_contains($val, 'NONE');
        });

        // "Possible but not executed" are those that are SELLABLE but NEITHER pitched NOR "not possible"
        $pitchPossibleNotExecuted = $sellableAudits->reject(function ($a) use ($pitchedContent, $pitchNotPossible) {
            return $pitchedContent->contains('id', $a->id) || $pitchNotPossible->contains('id', $a->id);
        });

        // Content Type Detection
        $sextingPitched = $pitchedContent->filter(fn ($a) => 
            str_contains(strtoupper($findValue($a, 'type')), 'SEXTING') || 
            $findValue($a, 'sexting') !== ''
        );
        $preRecorded = $pitchedContent->filter(function ($a) use ($findValue) {
            $val = str_replace(['-', '_', ' '], '', strtoupper($findValue($a, 'type')));

            return str_contains($val, 'PRERECORDED') || str_contains($val, 'PPV') || str_contains($val, 'VIDEO') || str_contains($val, 'RECORDED');
        });

        // Detailed breakdown for drill-downs (strictly scoped to their parent types)
        $sextingSaleNoAudits = $sextingPitched->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'NO'));
        $sextingSubAbandonedAudits = $sextingPitched->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sexting')), 'NO'));
        
        $prerecordedSaleNoAudits = $preRecorded->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'NO'));
        $upsellNoAudits = $preRecorded->filter(fn ($a) => 
            str_contains(strtoupper($findValue($a, 'upsell')), 'YES') && 
            (str_contains(strtoupper($findValue($a, 'buy')), 'NO') || str_contains(strtoupper($findValue($a, 'purchase')), 'NO'))
        );

        $stats = [
            'period' => [
                'full_range' => $audits->count() > 0 
                    ? $audits->min('created_at')->format('M d, Y') . ' – ' . $audits->max('created_at')->format('M d, Y')
                    : 'No data available',
            ],
            'total_audits' => $audits->count(),
            'sellable' => $sellableAudits->count(),
            'non_sellable' => $audits->count() - $sellableAudits->count(),
            'pitched' => $pitchedContent->count(),

            'pitch_not_possible' => $pitchNotPossible->count(),
            'pitch_possible_not_executed' => $pitchPossibleNotExecuted->count(),

            'sexting_pitched' => $sextingPitched->count(),
            'sexting_sale_yes' => $sextingPitched->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'YES'))->count(),
            'sexting_sub_continued' => $sextingPitched->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sexting')), 'YES'))->count(),
            'sexting_sub_abandoned' => $sextingSubAbandonedAudits->count(),

            'prerecorded_pitched' => $preRecorded->count(),
            'prerecorded_sale_yes' => $preRecorded->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'YES'))->count(),
            'upsell_attempted' => $preRecorded->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'upsell')), 'YES'))->count(),
            'upsell_purchased' => $preRecorded->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'buy')), 'YES'))->count(),
            'upsell_no' => $upsellNoAudits->count(),

            // Detailed audits for drill-downs
            'pitch_not_possible_audits' => $pitchNotPossible->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => $findValue($a, 'reason') ?: 'Pitch not possible',
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
                'reason' => $findValue($a, 'reason') ?: 'Pitch possible not executed',
                'reasonDetail' => $findValue($a, 'reasonDetail') ?: $findValue($a, 'violation'),
            ]),

            'sexting_sale_no_audits' => $sextingSaleNoAudits->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => $findValue($a, 'template-no-sale-reason') ?: $findValue($a, 'reason'),
                'reasonDetail' => $findValue($a, 'reasonDetail'),
            ]),

            'sexting_pitched_audits' => $sextingPitched->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => 'Sexting Pitch',
                'reasonDetail' => $findValue($a, 'type'),
            ]),

            'prerecorded_pitched_audits' => $preRecorded->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => 'Pre-recorded Pitch',
                'reasonDetail' => $findValue($a, 'type'),
            ]),

            'sexting_sub_abandoned_audits' => $sextingSubAbandonedAudits->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => $findValue($a, 'template-no-sexting-continue-reason') ?: 'Not Specified',
                'reasonDetail' => $findValue($a, 'reasonDetail'),
            ]),

            'prerecorded_sale_no_audits' => $prerecordedSaleNoAudits->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => $findValue($a, 'template-no-sale-reason') ?: $findValue($a, 'reason'),
                'reasonDetail' => $findValue($a, 'reasonDetail'),
            ]),

            'upsell_no_audits' => $upsellNoAudits->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => $findValue($a, 'template-no-upsell-reason') ?: 'Not Specified',
                'reasonDetail' => $findValue($a, 'reasonDetail'),
            ]),

            'transition_yes' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'transition')), 'YES'))->count(),
            'transition_no' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'transition')), 'NO'))->count(),
            'transition_no_audits' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'transition')), 'NO'))->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => 'Failed transition',
            ]),
            
            'total_interventions' => $audits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'intervene')), 'YES'))->count(),

            // Real-time Dashboard Metrics (Synchronized with UnitVolume.jsx)
            'help_requested_yes' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'help')), 'YES'))->count(),
            'help_requested_no' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'help')), 'NO'))->count(),
            'help_requested_no_audits' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'help')), 'NO'))->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => 'No help requested',
            ]),

            'rule_violations_yes' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'violation')), 'YES'))->count(),
            'rule_violations_no' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'violation')), 'NO'))->count(),
            'rule_violations_yes_audits' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'violation')), 'YES'))->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => $findValue($a, 'violation_detail') ?: 'Rule violation detected',
            ]),

            'negotiation_yes' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'discipline')), 'YES'))->count(),
            'negotiation_no' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'discipline')), 'NO'))->count(),
            'negotiation_no_audits' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'discipline')), 'NO'))->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => 'Poor negotiation discipline',
            ]),

            'aftercare_yes' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'aftercare')), 'YES'))->count(),
            'aftercare_no' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'aftercare')), 'NO'))->count(),
            'aftercare_no_audits' => $sellableAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'aftercare')), 'NO'))->values()->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->created_at->format('M d, Y, h:i A'),
                'chatter' => $a->chatter?->name ?? '-',
                'creator' => $a->creator?->name ?? '-',
                'subUid' => $a->subscriber_uid,
                'qc' => $a->user?->name ?? '-',
                'subType' => $findValue($a, 'subscriberType'),
                'reason' => 'No aftercare provided',
            ]),

            'fresh_subs' => $sellableAudits->filter(function ($a) use ($findValue) {
                $v = strtoupper($findValue($a, 'subscribertype'));

                return str_contains($v, 'NEW') || str_contains($v, '1 DAY') || str_contains($v, 'FRESH');
            })->count(),
            'old_subs' => $sellableAudits->filter(function ($a) use ($findValue) {
                $v = strtoupper($findValue($a, 'subscribertype'));

                return str_contains($v, 'OLD') || str_contains($v, '2 DAY') || str_contains($v, 'CONTINUING');
            })->count(),

            // Core Red Card Metrics (Calculated via separate RevenueLeakageService)
            ...$this->leakageService->calculateAll($audits),

            'daily_stats' => $audits->groupBy(fn ($a) => $a->created_at->format('M d'))
                ->map(fn ($group, $day) => [
                    'name' => $day,
                    'audits' => $group->count()
                ])->values(),

            'auditor_stats' => User::where('agency_id', $agency->id)->get()->map(function ($u) use ($audits, $findValue) {
                $userAudits = $audits->where('user_id', $u->id);

                return [
                    'name' => $u->name,
                    'count' => $userAudits->count(),
                    'interventions' => $userAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'intervene')), 'YES'))->count(),
                ];
            }),

            'chatter_performance' => $this->chatterService->getPerformanceStats($agency, $audits, $findValue),
            'chatter_stats' => $this->chatterService->getDetailedStats($agency, $audits, $findValue),
            'chatter_list' => $agency->chatters->pluck('name'),
            'creator_performance' => $this->creatorService->getPerformanceStats($agency, $audits, $findValue),
        ];

        return $stats;
    }

    public function getAgencyAuditStats(Agency $agency)
    {
        return $this->getWeeklyStats($agency);
    }
}
