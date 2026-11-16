<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('assessment_id')
                ->unique()
                ->constrained('assessments')
                ->restrictOnDelete();

            $table->string('recommended_specialization', 50)->nullable();

            $table->decimal('network_specialist_score', 8, 5)->nullable();

            $table->decimal('data_science_score', 8, 5)->nullable();

            $table->string('model_version', 30)->nullable();

            $table->string('status', 30)->default('pending');

            $table->text('error_message')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recommendations');
    }
};