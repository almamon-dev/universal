<?php

use App\Models\User;
use App\Models\Agency;
use Illuminate\Support\Arr;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$agency = Agency::find(1);
echo "Agency: " . $agency->name . "\n";

$data = [
    'name' => 'Demo Agency UPDATED',
    'status' => 'active',
    'qcs' => [
        [
            'id' => 2,
            'name' => 'QC User Updated',
            'username' => 'qc_1',
        ],
        [
            'id' => 'new-999999',
            'name' => 'New QC Member',
            'username' => 'new_qc_test',
            'password' => 'password123'
        ]
    ]
];

try {
    $agency->update(Arr::except($data, ['qcs']));
    echo "Agency updated.\n";

    foreach ($data['qcs'] as $qcData) {
        $qcId = (string)$qcData['id'];
        if (str_starts_with($qcId, 'new-')) {
            echo "Attempting to create user: " . $qcData['username'] . "\n";
            $u = User::create([
                'name' => $qcData['name'],
                'username' => $qcData['username'],
                'password' => $qcData['password'],
                'email' => $qcData['username'].'_at'.$agency->id.'@qc.com',
                'role' => 'qc',
                'agency_id' => $agency->id,
            ]);
            echo "Successfully created user ID: " . $u->id . "\n";
        } else {
            echo "Attempting to update user: " . $qcId . "\n";
            $u = User::find($qcId);
            if ($u) {
                $u->update([
                    'name' => $qcData['name'],
                    'username' => $qcData['username'],
                    'email' => $qcData['username'].'_at'.$agency->id.'@qc.com',
                ]);
                echo "Successfully updated user ID: " . $u->id . "\n";
            }
        }
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
