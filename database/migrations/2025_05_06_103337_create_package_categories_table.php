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
        Schema::create('package_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_package_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->longText('content')->nullable();
            $table->boolean('has_button')->default(true);
            $table->string('button_text')->default('Book Now');
            $table->string('slug', 100)->unique();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_categories');
    }
};
