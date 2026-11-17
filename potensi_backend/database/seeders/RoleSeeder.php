<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Owner', 'slug' => 'owner'],
            ['name' => 'Administrator', 'slug' => 'admin'],
            ['name' => 'External Administrator', 'slug' => 'admin_external'],
            ['name' => 'Participant', 'slug' => 'participant'],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['slug' => $role['slug']],
                ['name' => $role['name']]
            );
        }
    }
}
