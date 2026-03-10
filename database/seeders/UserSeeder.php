<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // admin dashboard
        \App\Models\User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin User',
                'username' => 'admin',
                'password' => 'password',
                'profile_setup' => true,
                'role' => 'admin',
                'is_admin' => true,
            ]
        );

        // Demo Agency
        $agency = \App\Models\Agency::firstOrCreate(
            ['name' => 'Demo Agency'],
            [
                'timezone' => 'UTC',
                'status' => 'active',
            ]
        );

        // QC User for the agency
        \App\Models\User::firstOrCreate(
            ['email' => 'qc@demo.com'],
            [
                'name' => 'QC User',
                'username' => 'qc_1',
                'password' => 'password',
                'role' => 'qc',
                'agency_id' => $agency->id,
            ]
        );
    }
}
