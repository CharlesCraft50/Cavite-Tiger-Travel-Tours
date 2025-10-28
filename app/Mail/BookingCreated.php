<?php

namespace App\Mail;

use App\Models\Booking;
use App\Models\PreferredPreparation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingCreated extends Mailable
{
    use Queueable, SerializesModels;

    public Booking $booking;

    public PreferredPreparation $preferredPreparation;

    /**
     * Create a new message instance.
     */
    public function __construct(Booking $booking, PreferredPreparation $preferredPreparation)
    {
        $this->booking = $booking;
        $this->preferredPreparation = $preferredPreparation;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $subject = match ($this->preferredPreparation->name) {
            'all_in' => "Booking #{$this->booking->booking_number} Submitted – Await for final amount",
            default => "Booking #{$this->booking->booking_number} Submitted – Payment Required",
        };

        return $this->subject($subject)
            ->markdown('emails.booking-created')
            ->with([
                'booking' => $this->booking,
                'preferredPreparation' => $this->preferredPreparation,
            ]);
    }
}
