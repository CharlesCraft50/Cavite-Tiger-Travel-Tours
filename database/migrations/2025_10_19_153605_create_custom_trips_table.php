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
        Schema::create('custom_trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');

            // Customer Details
            $table->string('first_name');
            $table->string('last_name');
            $table->string('contact_number');
            $table->string('email');

            // Trip Details
            $table->date('date_of_trip');
            $table->time('pickup_time')->nullable();
            $table->time('dropoff_time')->nullable();
            $table->string('pickup_address');
            $table->string('destination');

            // Van & Driver
            $table->foreignId('preferred_van_id')->nullable()->constrained('preferred_vans')->onDelete('set null');
            $table->foreignId('driver_id')->nullable()->constrained('users')->onDelete('set null');

            // Booking
            $table->boolean('is_confirmed')->default(false);
            $table->string('booking_number')->unique()->nullable();
            $table->decimal('total_amount', 10, 2)->nullable();

            // Admin Status
            $table->enum('status', ['pending', 'on_process', 'accepted', 'declined', 'past_due', 'cancelled', 'completed'])
                ->default('pending');

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_trips');
    }
};
