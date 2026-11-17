<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TenantController extends Controller
{
    /**
     * Menampilkan daftar tenant sesuai hak akses pengguna.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing('role', 'company');
        $role = $user->role?->slug;

        $query = Company::query();

        // Owner dan Admin Internal dapat melihat seluruh tenant.
        if (in_array($role, ['owner', 'admin'], true)) {
            // Tidak perlu filter company_id.
        }
        // Admin External hanya dapat melihat tenant miliknya.
        elseif ($role === 'admin_external') {
            if (! $user->company_id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Akun Admin External belum terhubung dengan tenant.',
                ], 422);
            }

            $query->where('id', $user->company_id);
        }
        // Role lain tidak memiliki akses.
        else {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki akses untuk melihat daftar tenant.',
            ], 403);
        }

        $tenants = $query
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'phone',
                'type',
                'status',
                'created_at',
            ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar tenant berhasil diambil.',
            'data' => [
                'total' => $tenants->count(),
                'tenants' => $tenants,
            ],
        ]);
    }

    /**
     * Mendaftarkan tenant baru.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing('role');

        // Hanya Owner dan Admin Internal yang dapat membuat tenant.
        if (! in_array($user->role?->slug, ['owner', 'admin'], true)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya Owner dan Admin Internal yang dapat mendaftarkan tenant.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tenant tidak valid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $tenant = Company::create([
            'name' => $request->input('name'),
            'phone' => $request->input('phone'),
            'type' => 'external',
            'status' => 'active',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Tenant berhasil didaftarkan.',
            'data' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'phone' => $tenant->phone,
                'type' => $tenant->type,
                'status' => $tenant->status,
                'created_at' => $tenant->created_at,
            ],
        ], 201);
    }

    /**
     * Mengubah informasi tenant.
     */
    public function update(Request $request, Company $tenant): JsonResponse
    {
        $user = $request->user()->loadMissing('role');

        // Hanya Owner dan Admin Internal yang dapat mengubah tenant.
        if (! in_array($user->role?->slug, ['owner', 'admin'], true)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki akses untuk mengubah tenant.',
            ], 403);
        }

        // Hanya tenant eksternal yang dapat diubah.
        if ($tenant->type !== 'external') {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya tenant eksternal yang dapat diubah.',
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tenant tidak valid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $tenant->update($validator->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Data tenant berhasil diperbarui.',
            'data' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'phone' => $tenant->phone,
                'type' => $tenant->type,
                'status' => $tenant->status,
            ],
        ]);
    }

    /**
     * Membuat akun Admin External untuk tenant tertentu.
     */
    public function storeAdmin(Request $request, Company $tenant): JsonResponse
    {
        $user = $request->user()->loadMissing('role');

        // Hanya Owner dan Admin Internal yang dapat membuat Admin External.
        if (! in_array($user->role?->slug, ['owner', 'admin'], true)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki akses untuk membuat Admin External.',
            ], 403);
        }

        // Admin External hanya dapat dibuat untuk tenant eksternal yang aktif.
        if ($tenant->type !== 'external' || $tenant->status !== 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Admin External hanya dapat dibuat untuk tenant eksternal yang aktif.',
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Admin External tidak valid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $role = Role::where('slug', 'admin_external')->first();

        if (! $role) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role Admin External belum tersedia.',
            ], 500);
        }

        $admin = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => $request->input('password'),
            'company_id' => $tenant->id,
            'role_id' => $role->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Admin External berhasil dibuat.',
            'data' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $role->slug,
                'company_id' => $admin->company_id,
                'tenant' => $tenant->name,
            ],
        ], 201);
    }
}
