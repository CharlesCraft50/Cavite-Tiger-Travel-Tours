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
            $table->string('pickup_address');
            $table->string('destination');

            // Trip Type & Costing Type
            $table->enum('trip_type', ['single_trip', 'round_trip'])->default('single_trip');
            $table->enum('costing_type', ['all_in', 'all_out'])->default('all_in');
            $table->string('duration')->nullable();

            // Van & Driver
            $table->foreignId('preferred_van_id')->nullable()->constrained('preferred_vans')->onDelete('set null');
            $table->foreignId('driver_id')->nullable()->constrained('users')->onDelete('set null');

            // Booking
            $table->boolean('is_confirmed')->default(false);
            $table->string('booking_number')->unique()->nullable();
            $table->decimal('total_amount', 10, 2)->nullable();
            $table->boolean('is_final_total')->default(false);
            $table->boolean('is_completed')->default(false);

            // Admin Status
            $table->enum('status', ['pending', 'on_process', 'accepted', 'declined', 'past_due', 'cancelled', 'completed'])
                ->default('pending');

            $table->integer('pax_kids')->nullable();
            $table->integer('pax_adult')->nullable();

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
