<?php

use App\Models\User;
use App\Models\Agency;
use Illuminate\Support\Arr;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- START TEST ---\n";
$agency = Agency::where('name', 'Demo Agency')->first();
if (!$agency) {
    echo "Creating Demo Agency...\n";
    $agency = Agency::create(['name' => 'Demo Agency', 'status' => 'active']);
}

echo "Agency ID: " . $agency->id . "\n";

$data = [
    'name' => 'Demo Agency UPDATED',
    'status' => 'active',
    'qcs' => [
        [
            'id' => 'new-test-' . time(),
            'name' => 'Test QC Member',
            'username' => 'testqc_' . time(),
            'password' => 'password123'
        ]
    ]
];

echo "Attempting to save QC member via manual logic...\n";
try {
    foreach ($data['qcs'] as $qcData) {
        $qcId = (string)($qcData['id'] ?? '');
        if (str_starts_with($qcId, 'new-')) {
            echo "Creating new user: {$qcData['username']}\n";
            $u = User::create([
                'name' => $qcData['name'],
                'username' => $qcData['username'],
                'password' => $qcData['password'],
                'email' => $qcData['username'].'_at'.$agency->id.'@qc.com',
                'role' => 'qc',
                'agency_id' => $agency->id,
            ]);
            echo "SUCCESS! User ID: " . $u->id . "\n";
        }
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

$count = User::where('role', 'qc')->count();
echo "Total QC members in DB now: " . $count . "\n";
