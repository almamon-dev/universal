<?php

use App\Models\User;
use App\Models\Agency;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "DB CONNECTION: " . config('database.default') . "\n";
echo "DB DATABASE: " . config('database.connections.'.config('database.default').'.database') . "\n";

$users = User::all();
echo "TOTAL USERS: " . $users->count() . "\n";
foreach($users as $u) {
    echo "ID: {$u->id}, Name: {$u->name}, Email: {$u->email}, AgencyID: {$u->agency_id}\n";
}

$agencies = Agency::all();
echo "TOTAL AGENCIES: " . $agencies->count() . "\n";
foreach($agencies as $a) {
    echo "ID: {$a->id}, Name: {$a->name}\n";
}
