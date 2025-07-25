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
        Schema::create('other_service_tour_packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_package_id')->constrained()->onDelete('cascade');
            $table->foreignId('other_service_id')->constrained('other_services')->onDelete('cascade');
            $table->decimal('package_specific_price', 10, 2)->nullable();
            $table->boolean('is_recommended')->default(false);
            $table->integer('sort_order')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('other_service_tour_packages');
    }
};
