<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Seed master data
        $this->call([
            CompanySeeder::class,
            RoleSeeder::class,
            QuestionDefaultSeeder::class,
        ]);

        // Ambil data company
        $tenantB = Company::where('name', 'TENANT_B')->firstOrFail();
        $internalCompany = Company::where('name', 'KELOMPOK_05')->firstOrFail();

        // Ambil data role
        $ownerRole = Role::where('slug', 'owner')->firstOrFail();
        $adminRole = Role::where('slug', 'admin')->firstOrFail();
        $participantRole = Role::where('slug', 'participant')->firstOrFail();

        // Akun Owner
        User::updateOrCreate(
            ['email' => 'bravomasun@gmail.com'],
            [
                'name' => 'IF701 KEL-05',
                'password' => 'password',
                'company_id' => null,
                'role_id' => $ownerRole->id,
            ]
        );

        // Akun Admin Internal
        User::updateOrCreate(
            ['email' => 'itsuntoro@gmail.com'],
            [
                'name' => 'Kelompok_05',
                'password' => 'password',
                'company_id' => $internalCompany->id,
                'role_id' => $adminRole->id,
            ]
        );

        // Akun Participant Internal
        User::updateOrCreate(
            ['email' => 'participant.internal@if701.local'],
            [
                'name' => 'Participant Internal',
                'password' => 'password',
                'company_id' => $internalCompany->id,
                'role_id' => $participantRole->id,
            ]
        );

        // Akun Participant Tenant B
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'company_id' => $tenantB->id,
                'role_id' => $participantRole->id,
            ]
        );
    }
}
