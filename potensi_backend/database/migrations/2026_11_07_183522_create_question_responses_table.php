<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('question_responses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('assessment_id')
                ->constrained('assessments')
                ->restrictOnDelete();

            $table->foreignId('question_default_id')
                ->constrained('questions_default')
                ->restrictOnDelete();

            $table->unsignedTinyInteger('answer');

            $table->timestamps();

            $table->unique([
                'assessment_id',
                'question_default_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('question_responses');
    }
};