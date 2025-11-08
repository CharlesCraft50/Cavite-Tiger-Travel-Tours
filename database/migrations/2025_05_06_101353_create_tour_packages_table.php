<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tour_packages', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->foreignId('city_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('subtitle')->nullable();
            $table->string('location')->nullable();
            $table->string('duration')->nullable(); // e.g. 3D2N
            $table->integer('preferred_days')->nullable();
            $table->string('overview')->nullable();
            $table->longText('content')->nullable();
            $table->integer('pax_kids')->nullable();
            $table->integer('pax_adult')->nullable();
            $table->date('available_from')->nullable();
            $table->date('available_until')->nullable();
            $table->string('image_overview')->nullable(); // path to image_overview in /storage
            $table->json('image_banner')->nullable(); // path to image_banner in /storage
            $table->string('slug', 100)->unique();
            $table->decimal('base_price', 10, 2)->default(0);

            $table->enum('package_type', ['normal', 'event'])->default('normal');
            $table->enum('event_type', [
                'limited_time',
                'popular',
                'seasonal',
                'festival',
                'exclusive',
                'new_arrival',
                'flash_sale',
            ])->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tour_packages');
    }
};
