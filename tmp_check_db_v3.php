<?php

use App\Models\User;
use App\Models\Agency;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- ALL USERS WITH AGENCY_ID 1 ---\n";
$users = User::where('agency_id', 1)->get();
foreach ($users as $user) {
    echo "ID: {$user->id}, Name: {$user->name}, Username: {$user->username}, Role: {$user->role}\n";
}

echo "\n--- ALL USERS IN DB ---\n";
$all = User::all();
foreach ($all as $u) {
    echo "ID: {$u->id}, Name: {$u->name}, Role: {$u->role}\n";
}
