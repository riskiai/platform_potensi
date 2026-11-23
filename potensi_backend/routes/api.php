<?php

use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuestionnaireController;
use App\Http\Controllers\TenantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health Check
Route::get('/ping', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Backend API potensi_backend is ready!',
        'php_version' => PHP_VERSION,
    ]);
});

// Authentication
Route::post('/login', [AuthController::class, 'login']);

// Questionnaire
Route::get('/questions', [QuestionnaireController::class, 'index']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // User
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Assessment
    Route::post('/assessments', [AssessmentController::class, 'store']);
    Route::get('/assessments/{assessment}', [AssessmentController::class, 'show']);

    // Tenant Management
    Route::get('/tenants', [TenantController::class, 'index']);
    Route::post('/tenants', [TenantController::class, 'store']);
    Route::put('/tenants/{tenant}', [TenantController::class, 'update']);
    Route::post('/tenants/{tenant}/admins', [TenantController::class, 'storeAdmin']);

});

