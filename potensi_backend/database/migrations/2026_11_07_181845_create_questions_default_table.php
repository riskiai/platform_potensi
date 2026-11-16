<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions_default', function (Blueprint $table) {
            $table->id();

            $table->string('code', 10)->unique();

            $table->string('specialization', 30);

            $table->string('category', 50);

            $table->string('question');

            $table->text('description')->nullable();

            $table->unsignedSmallInteger('sort_order');

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions_default');
    }
};