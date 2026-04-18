<?php

namespace App\Services;

use App\Models\Agency;

class CreatorReportService
{
    public function getPerformanceStats(Agency $agency, $audits, $findValue)
    {
        $totalAudits = $audits->count();
        
        return $agency->creators->map(function ($creator) use ($audits, $findValue, $totalAudits) {
            $creatorAudits = $audits->where('creator_id', $creator->id);
            $sellable = $creatorAudits->filter(function ($a) use ($findValue) {
                $val = strtoupper($findValue($a, 'classification'));
                return str_contains($val, 'SELLABLE') || $val === 'YES';
            });

            $pitched = $sellable->filter(function ($a) use ($findValue) {
                $val = strtoupper($findValue($a, 'pitched'));
                return $val !== '' && !str_contains($val, 'NO') && !str_contains($val, 'NONE');
            });

            $saleYes = $pitched->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'sale')), 'YES'))->count();

            return [
                'name' => $creator->name,
                'count' => $creatorAudits->count(),
                'rank' => 0, // Will be calculated
                'share' => $totalAudits > 0 ? round(($creatorAudits->count() / $totalAudits) * 100) . '%' : '0%',
                'conv' => $sellable->count() > 0 ? round(($saleYes / $sellable->count()) * 100) . '%' : '0%',
                'sales' => $creatorAudits->count() > 0 ? round(($saleYes / $creatorAudits->count()) * 100) . '%' : '0%',
                'pitch' => $sellable->count() > 0 ? round(($pitched->count() / $sellable->count()) * 100) . '%' : '0%',
                'sellable' => [
                    'y' => $sellable->count(),
                    'n' => $creatorAudits->count() - $sellable->count()
                ],
                'fresh' => [
                    'y' => $sellable->filter(fn($a) => str_contains(strtoupper($findValue($a, 'subscriberType')), 'NEW') || str_contains(strtoupper($findValue($a, 'subscriberType')), 'FRESH'))->count(),
                    'n' => $sellable->filter(fn($a) => str_contains(strtoupper($findValue($a, 'subscriberType')), 'OLD') || str_contains(strtoupper($findValue($a, 'subscriberType')), 'CONTINUING'))->count()
                ],
                'qc' => $creatorAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'intervene')), 'YES'))->count(),
                'rules' => $creatorAudits->filter(fn ($a) => str_contains(strtoupper($findValue($a, 'violation')), 'YES'))->count(),
                'history' => $creatorAudits->sortByDesc('created_at')->take(20)->map(function ($a) use ($findValue) {
                    return [
                        'date' => $a->created_at->format('M d, h:i A'),
                        'chatter' => $a->chatter?->name ?? 'System',
                        'state' => str_contains(strtoupper($findValue($a, 'classification')), 'SELLABLE') ? 'Sellable' : 'Non-Sellable',
                        'type' => $findValue($a, 'subscriberType') ?: 'N/A',
                        'subUid' => $a->subscriber_uid,
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
}
