<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$audit = \App\Models\SeoAudit::where('agency_id', 1)->latest()->first();
if ($audit) {
    echo "LATEST AUDIT KEYS:\n";
    $responses = json_decode($audit->responses, true);
    print_r(array_keys($responses));
    echo "\nVALUES:\n";
    print_r($responses);
} else {
    echo "No audits found for agency 1.";
}
