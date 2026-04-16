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
                'first_paywall_sexting' => 30.00,
                'avg_completed_sexting_sequence' => 150.00,
                'avg_recorded_ppv' => 70.00,
            ]
        );

        // Professional Synchronization: Link all 23 master questions to the Demo Agency via the pivot table
        $allFields = \App\Models\AuditField::all();
        $agency->auditFields()->sync($allFields->pluck('id'));

        // PROFESSIONAL ONBOARDING SEED: Generate 5 Chatters and 5 Creators for the Demo Agency
        for ($i = 1; $i <= 5; $i++) {
            $agency->chatters()->create(['name' => "Chatter {$i}"]);
            $agency->creators()->create(['name' => "Creator {$i}"]);
        }

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
