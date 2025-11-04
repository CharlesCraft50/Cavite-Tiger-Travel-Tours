<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('package_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Make both nullable, but require at least one in validation
            $table->foreignId('tour_package_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('custom_trip_id')->nullable()->constrained()->onDelete('cascade');

            $table->unsignedTinyInteger('rating')->comment('1-5 star rating');
            $table->text('comment')->nullable();
            $table->timestamps();

            // Unique review per user per package or trip
            $table->unique(['user_id', 'tour_package_id']);
            $table->unique(['user_id', 'custom_trip_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('package_reviews');
    }
};
