<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$audit = \App\Models\SeoAudit::find(10);
$service = app(\App\Services\ReportService::class);
$agency = \App\Models\Agency::find(1);

$stats = $service->getWeeklyStats($agency);

echo "Total Audits in Stats: " . $stats['total_audits'] . "\n";
echo "Transition Yes Count: " . $stats['transition_yes'] . "\n";
echo "QC Interventions Count: " . $stats['total_interventions'] . "\n";

// Manual check logic locally
$findValue = function ($audit, $keyword) {
    $cleanKeyword = str_replace(['-', '_', ' '], '', strtolower($keyword));
    $response = $audit->responses->sortByDesc(function ($r) use ($cleanKeyword) {
        $key = str_replace(['-', '_', ' '], '', strtolower($r->field_key));
        if ($key === $cleanKeyword) return 100;
        if ($cleanKeyword === 'transition' && (str_contains($key, 'casual') || str_contains($key, 'transition'))) return 90;
        return 0;
    })->first();
    return trim($response?->value ?? '');
};

echo "ID 10 Transition Value: '" . $findValue($audit, 'transition') . "'\n";
