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
        Schema::create('seo_audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('agency_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('chatter_id')->constrained()->onDelete('cascade');
            $table->foreignId('creator_id')->constrained()->onDelete('cascade');
            $table->string('subscriber_uid');
            $table->string('status')->default('completed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seo_audits');
    }
};
