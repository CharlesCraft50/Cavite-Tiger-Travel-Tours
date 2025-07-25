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
        Schema::create('preferred_van_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('preferred_van_id')->constrained('preferred_vans')->onDelete('cascade');
            $table->date('available_from');
            $table->date('available_until');
            $table->integer('count')->default(1);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preferred_van_availabilities');
    }
};
