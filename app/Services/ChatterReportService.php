<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\User;

class ChatterReportService
{
    public function getPerformanceStats(Agency $agency, $audits, $findValue)
    {
        return $agency->chatters->map(function ($chatter) use ($audits, $findValue) {
            $chatterAudits = $audits->where('chatter_id', $chatter->id);
            $sellable = $chatterAudits->filter(function ($a) use ($findValue) {
                $val = strtoupper($findValue($a, 'classification'));
                return str_contains($val, 'SELLABLE') || $val === 'YES';
            });

            $pitched = $sellable->filter(function ($a) use ($findValue) {
                $val = strtoupper($findValue($a, 'pitched'));
                return $val !== '' && !str_contains($val, 'NO') && !str_contains($val, 'NONE');
            });

            $sextingPitched = $pitched->filter(fn ($a) => 
                str_contains(strtoupper($findValue($a, 'type')), 'SEXTING') || 
                $findValue($a, 'sexting') !== ''
            );

            $preRecorded = $pitched->filter(function ($a) use ($findValue) {
                $val = str_replace(['-', '_', ' '], '', strtoupper($findValue($a, 'type')));
                return str_contains($val, 'PRERECORDED') || str_contains($val, 'PPV') || str_contains($val, 'VIDEO') || str_contains($val, 'RECORDED');
            });

            $saleYes = $pitched->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'YES'))->count();

            return [
                'name' => $chatter->name,
                'count' => $chatterAudits->count(),
                'rank' => 0, // Will be calculated after sorting
                'conv' => $sellable->count() > 0 ? round(($saleYes / $sellable->count()) * 100) . '%' : '0%',
                'pitch' => $sellable->count() > 0 ? round(($pitched->count() / $sellable->count()) * 100) . '%' : '0%',
                'sellable' => [
                    'y' => $sellable->count(),
                    'n' => $chatterAudits->count() - $sellable->count()
                ],
                'fresh' => [
                    'y' => $sellable->filter(fn($a) => str_contains(strtoupper($findValue($a, 'subscriberType')), 'NEW') || str_contains(strtoupper($findValue($a, 'subscriberType')), 'FRESH'))->count(),
                    'n' => $sellable->filter(fn($a) => str_contains(strtoupper($findValue($a, 'subscriberType')), 'OLD') || str_contains(strtoupper($findValue($a, 'subscriberType')), 'CONTINUING'))->count()
                ],
                'pitched' => [
                    'y' => $pitched->count(),
                    'n' => $sellable->count() - $pitched->count()
                ],
                'sexting' => [
                    'p' => $sextingPitched->count(),
                    'b' => $sextingPitched->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'YES'))->count(),
                    'nb' => $sextingPitched->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'NO'))->count(),
                    'c' => $sextingPitched->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sexting')), 'YES'))->count(),
                    'r' => $sextingPitched->count() > 0 ? round(($sextingPitched->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'YES'))->count() / $sextingPitched->count()) * 100) . '%' : '0%'
                ],
                'pre' => [
                    'p' => $preRecorded->count(),
                    'b' => $preRecorded->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'YES'))->count(),
                    'nb' => $preRecorded->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'NO'))->count(),
                    'u' => $preRecorded->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'upsell')), 'YES'))->count(),
                    'uy' => $preRecorded->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'buy')), 'YES'))->count(),
                    'r' => $preRecorded->count() > 0 ? round(($preRecorded->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'YES'))->count() / $preRecorded->count()) * 100) . '%' : '0%'
                ],
                'qc' => $chatterAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'intervene')), 'YES'))->count(),
                'rules' => $chatterAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'violation')), 'YES'))->count(),
                'history' => $chatterAudits->sortByDesc('created_at')->take(20)->map(function ($a) use ($findValue) {
                    return [
                        'date' => $a->created_at->format('M d, h:i A'),
                        'qc' => $a->user?->name ?? 'System',
                        'state' => str_contains(strtoupper($findValue($a, 'classification')), 'SELLABLE') ? 'Sellable' : 'Non-Sellable',
                        'type' => $findValue($a, 'subscriberType') ?: 'N/A',
                        'subUid' => $a->subscriber_uid,
                        'creator' => $a->creator?->name ?? 'Admin',
                        'flags' => [
                            'pitch' => $findValue($a, 'pitched'),
                            'aftercare' => $findValue($a, 'aftercare'),
                            'casualSexual' => $findValue($a, 'transition'),
                            'firstPpv' => $findValue($a, 'firstoffertiming'),
                            'requestHelp' => $findValue($a, 'help'),
                            'negotiation' => $findValue($a, 'discipline'),
                            'upsellAtt' => $findValue($a, 'upsell'),
                            'qcInter' => $findValue($a, 'intervene'),
                            'upsellPur' => $findValue($a, 'buy'),
                            'ruleViol' => $findValue($a, 'violation'),
                        ]
                    ];
                })->values()->toArray()
            ];
        })->sortByDesc('count')->values()->map(function($item, $index) {
            $item['rank'] = $index + 1;
            return $item;
        });
    }

    public function getDetailedStats(Agency $agency, $audits, $findValue)
    {
        return $agency->chatters->map(function ($chatter) use ($audits, $findValue) {
            $chatterAudits = $audits->where('chatter_id', $chatter->id);
            $sellable = $chatterAudits->filter(function ($a) use ($findValue) {
                $val = strtoupper($findValue($a, 'classification'));
                return str_contains($val, 'SELLABLE') || $val === 'YES';
            });

            return [
                'name' => $chatter->name,
                'audits' => $chatterAudits->count(),
                'sellable' => $sellable->count(),
                'non_sellable' => $chatterAudits->count() - $sellable->count(),
                'ppv_sold' => $chatterAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'YES'))->count(),
                'upsell_sold' => $chatterAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'buy')), 'YES'))->count(),
                'rank' => 0, // Will be assigned
                'history' => $chatterAudits->sortByDesc('created_at')->take(20)->map(function ($a) use ($findValue) {
                    return [
                        'date' => $a->created_at->format('M d, h:i A'),
                        'qc' => $a->user?->name ?? 'System',
                        'state' => str_contains(strtoupper($findValue($a, 'classification')), 'SELLABLE') ? 'Sellable' : 'Non-Sellable',
                        'type' => $findValue($a, 'subscriberType') ?: 'N/A',
                        'subUid' => $a->subscriber_uid,
                        'creator' => $a->creator?->name ?? 'Admin',
                        'flags' => [
                            'pitch' => $findValue($a, 'pitched'),
                            'aftercare' => $findValue($a, 'aftercare'),
                            'casualSexual' => $findValue($a, 'transition'),
                            'firstPpv' => $findValue($a, 'firstoffertiming'),
                            'requestHelp' => $findValue($a, 'help'),
                            'negotiation' => $findValue($a, 'discipline'),
                            'upsellAtt' => $findValue($a, 'upsell'),
                            'qcInter' => $findValue($a, 'intervene'),
                            'upsellPur' => $findValue($a, 'buy'),
                            'ruleViol' => $findValue($a, 'violation'),
                        ]
                    ];
                })->values()->toArray()
            ];
        })->sortByDesc('audits')->values()->map(function($item, $index) {
            $item['rank'] = $index + 1;
            return $item;
        });
    }
}
