<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('tour_package_id')->constrained()->onDelete('cascade');
            $table->foreignId('package_category_id')->nullable()->constrained()->onDelete('set null');

            // Customer Details
            $table->string('first_name');
            $table->string('last_name');
            $table->string('contact_number');
            $table->string('email');

            // Booking Details
            $table->date('departure_date');
            $table->date('return_date');
            $table->integer('pax_adult');
            $table->integer('pax_kids');
            $table->boolean('travel_insurance')->default(true);
            $table->text('notes')->nullable();
            $table->enum('payment_method', ['gcash', 'paypal', 'bank_deposit']);
            $table->boolean('is_confirmed')->default(false);

            // Admin Status
            $table->enum('status', ['pending', 'accepted', 'declined'])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
