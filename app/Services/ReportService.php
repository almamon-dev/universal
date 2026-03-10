<?php

namespace App\Services;

use App\Models\Agency;

class ReportService
{
    public function getWeeklyStats(Agency $agency)
    {
        $audits = $agency->audits()->with(['chatter', 'user'])->get();

        // Basic classification
        $sellableAudits = $audits->filter(fn ($a) => ($a->response_data['conv_classification'] ?? '') === 'SELLABLE');
        $nonSellableAudits = $audits->filter(fn ($a) => ($a->response_data['conv_classification'] ?? '') !== 'SELLABLE');

        // Pitch status groups - Mapping keys to actual response_data
        $pitchedContent = $sellableAudits->filter(fn ($a) => ($a->response_data['pitched_content'] ?? '') === 'Yes');
        $notPitched = $sellableAudits->filter(fn ($a) => ($a->response_data['pitched_content'] ?? '') === 'No');

        $sextingPitched = $pitchedContent->filter(fn ($a) => ($a->response_data['content_pitched_type'] ?? '') === 'Sexting');
        $preRecorded = $pitchedContent->filter(fn ($a) => ($a->response_data['content_pitched_type'] ?? '') === 'Pre-recorded');

        // All QCs assigned to this agency
        $agencyQcs = $agency->qcs;

        // Auditor (QC) Stats - Include all assigned QCs even if 0
        $auditorStats = $agencyQcs->map(fn ($qc) => [
            'name' => $qc->name,
            'count' => $audits->where('user_id', $qc->id)->count(),
        ])->values();

        // QC Intervention Stats per Auditor
        $qcInterventionStats = $agencyQcs->map(fn ($qc) => [
            'name' => $qc->name,
            'count' => $audits->where('user_id', $qc->id)
                ->filter(fn ($a) => ($a->response_data['qc_intervene'] ?? '') === 'Yes')
                ->count(),
        ])->values();

        // Chatter Stats - Include all chatters from agency
        $chatterStats = $agency->chatters->map(fn ($chatter) => [
            'name' => $chatter->name,
            'count' => $audits->where('chatter_id', $chatter->id)->count(),
        ])->sortByDesc('count')->values();

        // Date Ranges
        $endDate = now();
        $startDate = now()->subDays(7);

        // Daily Audit Coverage
        $dailyCoverage = $audits->groupBy(fn ($a) => $a->created_at->format('M d'))
            ->map(fn ($group, $day) => [
                'name' => $day,
                'value' => $group->count(),
            ])
            ->values();

        // Interventions
        $interventions = $audits->filter(fn ($a) => ($a->response_data['qc_intervene'] ?? '') === 'Yes')->count();

        // Leakage Detailed Calculation
        $leakageItems = [
            [
                'label' => 'Sexting - No Sale (Paywall)',
                'count' => $sextingPitched->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'No')->count(),
                'countLabel' => 'missed',
                'amount' => '-$'.($sextingPitched->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'No')->count() * 15),
            ],
            [
                'label' => 'Sexting - Sub Abandoned',
                'count' => $sextingPitched->filter(fn ($a) => ($a->response_data['sexting_continued'] ?? '') === 'No')->count(),
                'countLabel' => 'abandoned',
                'amount' => '-$'.($sextingPitched->filter(fn ($a) => ($a->response_data['sexting_continued'] ?? '') === 'No')->count() * 25),
            ],
            [
                'label' => 'Pre-recorded PPV - No Sale',
                'count' => $preRecorded->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'No')->count(),
                'countLabel' => 'missed',
                'amount' => '-$'.($preRecorded->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'No')->count() * 50),
            ],
            [
                'label' => 'Sellable Not Pitched',
                'count' => $notPitched->count(),
                'countLabel' => 'Units',
                'amount' => '-$'.($notPitched->count() * 40),
            ],
        ];

        $totalLost = collect($leakageItems)->sum(fn ($i) => (int) str_replace(['-$', '$'], '', $i['amount']));

        return [
            'total_audits' => $audits->count(),
            'sellable' => $sellableAudits->count(),
            'non_sellable' => $nonSellableAudits->count(),
            'revenue' => '$'.number_format($pitchedContent->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'Yes')->count() * 120), // Avg revenue factor
            'interventions' => $interventions,
            'auditor_stats' => $auditorStats,
            'qc_intervention_stats' => $qcInterventionStats,
            'chatter_stats' => $chatterStats,
            'daily_coverage' => $dailyCoverage,
            'leakage' => [
                'items' => $leakageItems,
                'total_lost' => '-$'.number_format($totalLost),
            ],
            'executive' => [
                'aftercare' => [
                    'yes' => $sellableAudits->filter(fn ($a) => ($a->response_data['aftercare'] ?? '') === 'Yes')->count(),
                    'no' => $sellableAudits->filter(fn ($a) => ($a->response_data['aftercare'] ?? '') === 'No')->count(),
                ],
                'qc_help' => [
                    'yes' => $sellableAudits->filter(fn ($a) => ($a->response_data['qc_help_request'] ?? '') === 'Yes')->count(),
                    'no' => $sellableAudits->filter(fn ($a) => ($a->response_data['qc_help_request'] ?? '') === 'No')->count(),
                ],
                'violations' => [
                    'yes' => $sellableAudits->filter(fn ($a) => ($a->response_data['rule_violation'] ?? '') === 'Yes')->count(),
                    'no' => $sellableAudits->filter(fn ($a) => ($a->response_data['rule_violation'] ?? '') === 'No')->count(),
                ],
                'subscriber_type' => [
                    'new' => $audits->filter(fn ($a) => str_contains(strtolower($a->response_data['subscriber_type'] ?? ''), 'new'))->count(),
                    'old' => $audits->filter(fn ($a) => str_contains(strtolower($a->response_data['subscriber_type'] ?? ''), 'old'))->count(),
                ],
                'casual_to_sexual' => [
                    'yes' => $sellableAudits->filter(fn ($a) => ($a->response_data['casual_conv'] ?? '') === 'Yes')->count(),
                    'no' => $sellableAudits->filter(fn ($a) => ($a->response_data['casual_conv'] ?? '') === 'No')->count(),
                ],
                'negotiation' => [
                    'yes' => $sellableAudits->filter(fn ($a) => ($a->response_data['negotiated'] ?? '') === 'Yes')->count(),
                    'no' => $sellableAudits->filter(fn ($a) => ($a->response_data['negotiated'] ?? '') === 'No')->count(),
                ],
            ],
            'grids' => [
                'interventions' => [
                    'total' => $interventions,
                    'high_risk' => $audits->filter(fn ($a) => ($a->response_data['risk_level'] ?? '') === 'High')->count(),
                    'standard' => $audits->filter(fn ($a) => ($a->response_data['risk_level'] ?? 'Standard') === 'Standard')->count(),
                    'resolved' => $audits->filter(fn ($a) => ($a->status ?? '') === 'Resolved')->count(),
                ],
                'segments' => [
                    'new_discovery' => $audits->filter(fn ($a) => str_contains($a->response_data['subscriber_type'] ?? '', 'New'))->count(),
                    'retention_spent' => $audits->filter(fn ($a) => str_contains($a->response_data['subscriber_type'] ?? '', 'Old'))->count(),
                ],
                'binary' => [
                    [
                        'title' => 'Manual Transition Protocol',
                        'category' => 'Sellable Operations',
                        'yes' => $sellableAudits->filter(fn ($a) => ($a->response_data['casual_conv'] ?? '') === 'Yes')->count(),
                        'no' => $sellableAudits->filter(fn ($a) => ($a->response_data['casual_conv'] ?? '') === 'No')->count(),
                    ],
                    [
                        'title' => 'Rule Violation Incidence',
                        'category' => 'Agency Integrity',
                        'yes' => $audits->filter(fn ($a) => ($a->response_data['rule_violation'] ?? '') === 'Yes')->count(),
                        'no' => $audits->filter(fn ($a) => ($a->response_data['rule_violation'] ?? '') === 'No')->count(),
                    ],
                ],
            ],
            'period' => [
                'start' => $startDate->format('M d'),
                'end' => $endDate->format('M d, Y'),
                'full_range' => $startDate->format('M d').' – '.$endDate->format('M d, Y'),
            ],
            'flow' => [
                'sellable_total' => $sellableAudits->count(),
                'not_pitched' => [
                    'total' => $notPitched->count(),
                    'not_possible' => $notPitched->filter(fn ($a) => ($a->response_data['no_pitch_reason'] ?? '') === 'PITCH NOT POSSIBLE')->count(),
                    'not_executed' => $notPitched->filter(fn ($a) => ($a->response_data['no_pitch_reason'] ?? '') === 'PITCH POSSIBLE BUT NOT EXECUTED')->count(),
                ],
                'pitched' => [
                    'total' => $sextingPitched->count(),
                    'sexting' => $sextingPitched->count(),
                    'sale_no' => $sextingPitched->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'No')->count(),
                    'sale_yes' => $sextingPitched->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'Yes')->count(),
                    'sub_continued_yes' => $sextingPitched->filter(fn ($a) => ($a->response_data['sexting_continued'] ?? '') === 'Yes')->count(),
                    'sub_continued_no' => $sextingPitched->filter(fn ($a) => ($a->response_data['sexting_continued'] ?? '') === 'No')->count(),
                ],
                'pre_recorded' => [
                    'total' => $preRecorded->count(),
                    'sale_no' => $preRecorded->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'No')->count(),
                    'sale_yes' => $preRecorded->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'Yes')->count(),
                    'upsell_yes' => $preRecorded->filter(fn ($a) => ($a->response_data['upselling_attempt'] ?? '') === 'Yes')->count(),
                    'purchased_yes' => $preRecorded->filter(fn ($a) => ($a->response_data['upsell_bought'] ?? '') === 'Yes')->count(),
                    'purchased_no' => $preRecorded->filter(fn ($a) => ($a->response_data['upsell_bought'] ?? '') === 'No')->count(),
                ],
            ],
            'fault_mapping' => [
                'conversion_rate' => $audits->count() > 0 ? round(($sellableAudits->count() / $audits->count()) * 100, 1) : 0,
                'pitch_rate' => $sellableAudits->count() > 0 ? round(($pitchedContent->count() / $sellableAudits->count()) * 100, 1) : 0,
                'sexting_sales' => $sextingPitched->count() > 0 ? round(($sextingPitched->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'Yes')->count() / $sextingPitched->count()) * 100, 1) : 0,
                'ppv_sales' => $preRecorded->count() > 0 ? round(($preRecorded->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'Yes')->count() / $preRecorded->count()) * 100, 1) : 0,
                'sexting_continuation' => $sextingPitched->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'Yes')->count() > 0 ? round(($sextingPitched->filter(fn ($a) => ($a->response_data['sexting_continued'] ?? '') === 'Yes')->count() / $sextingPitched->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'Yes')->count()) * 100, 1) : 0,
                'upsell_attempt' => $preRecorded->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'Yes')->count() > 0 ? round(($preRecorded->filter(fn ($a) => ($a->response_data['upselling_attempt'] ?? '') === 'Yes')->count() / $preRecorded->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'Yes')->count()) * 100, 1) : 0,
                'upsell_conversion' => $preRecorded->filter(fn ($a) => ($a->response_data['upselling_attempt'] ?? '') === 'Yes')->count() > 0 ? round(($preRecorded->filter(fn ($a) => ($a->response_data['upsell_bought'] ?? '') === 'Yes')->count() / $preRecorded->filter(fn ($a) => ($a->response_data['upselling_attempt'] ?? '') === 'Yes')->count()) * 100, 1) : 0,
                'casual_transition' => $sellableAudits->count() > 0 ? round(($sellableAudits->filter(fn ($a) => ($a->response_data['casual_conv'] ?? '') === 'Yes')->count() / $sellableAudits->count()) * 100, 1) : 0,
            ],
        ];
    }

    public function getAgencyAuditStats(Agency $agency)
    {
        $audits = $agency->audits()->get();
        $total = $audits->count();

        if ($total === 0) {
            return [
                'total_audits' => 0,
                'chatter_protocols' => '0%',
                'qc_oversight' => '0%',
                'growth_strategy' => '0%',
                'integrity_score' => '0%',
                'health' => '0%'
            ];
        }

        // Chatter Protocols: High when Rule Violations are low
        $violations = $audits->filter(fn ($a) => ($a->response_data['rule_violation'] ?? '') === 'Yes')->count();
        $chatterProtocols = round((($total - $violations) / $total) * 100, 1);

        // QC Oversight: Ratio of Intervention (aiming for healthy intervention levels)
        $interventions = $audits->filter(fn ($a) => ($a->response_data['qc_intervene'] ?? '') === 'Yes')->count();
        $qcOversight = round(($interventions > 0 ? 98.5 : 0), 1); // For now, if audits happen, oversight is active

        // Growth Strategy: Based on Sales success in sellable conversations
        $sellable = $audits->filter(fn ($a) => ($a->response_data['conv_classification'] ?? '') === 'SELLABLE');
        $sales = $sellable->filter(fn ($a) => ($a->response_data['made_sale'] ?? '') === 'Yes')->count();
        $growthStrategy = $sellable->count() > 0 ? round(($sales / $sellable->count()) * 100, 1) : 0;

        $integrityScore = round((($total - ($violations * 2)) / $total) * 100, 1);
        $integrityScore = max(0, min(100, $integrityScore));

        return [
            'total_audits' => $total,
            'chatter_protocols' => $chatterProtocols . '%',
            'qc_oversight' => $qcOversight . '%',
            'growth_strategy' => $growthStrategy . '%',
            'integrity_score' => $integrityScore . '%',
            'health' => round(($chatterProtocols + $growthStrategy) / 2, 1) . '%'
        ];
    }
}
