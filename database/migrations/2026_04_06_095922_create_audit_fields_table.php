<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_fields', function (Blueprint $table) {
            $table->id();
            $table->string('field_key')->unique();
            $table->string('name');
            $table->string('field_label')->nullable();
            $table->string('type')->default('select'); // select, text, textarea, numeric
            $table->text('options')->nullable(); // CSV format or JSON
            $table->boolean('is_required')->default(false);
            $table->boolean('is_locked')->default(false);
            $table->string('help_text')->nullable();
            $table->boolean('is_conditional')->default(false);
            $table->string('required_if')->nullable();
            $table->string('special_banner')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_fields');
    }
};
