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
        Schema::create('agencies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('timezone')->nullable();

            // Price Configuration
            $table->decimal('first_paywall_sexting', 10, 2)->default(0);
            $table->decimal('avg_completed_sexting_sequence', 10, 2)->default(0);
            $table->decimal('avg_recorded_ppn', 10, 2)->default(0);

            $table->string('status')->default('active'); // active, inactive
            $table->integer('total_audits')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agencies');
    }
};
