<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            [
                'name' => 'TENANT_B',
                'phone' => null,
                'type' => 'external',
                'status' => 'active',
            ],
            [
                'name' => 'KELOMPOK_05',
                'phone' => null,
                'type' => 'internal',
                'status' => 'active',
            ],
            [
                'name' => 'TENANT_A',
                'phone' => '081234567890',
                'type' => 'external',
                'status' => 'active',
            ],
            [
                'name' => 'UGM',
                'phone' => '081234567890',
                'type' => 'external',
                'status' => 'active',
            ],
        ];

        foreach ($companies as $company) {
            Company::updateOrCreate(
                ['name' => $company['name']],
                [
                    'phone' => $company['phone'],
                    'type' => $company['type'],
                    'status' => $company['status'],
                ]
            );
        }
    }
}
