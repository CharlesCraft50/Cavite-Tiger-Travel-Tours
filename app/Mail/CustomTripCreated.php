<?php

namespace App\Mail;

use App\Models\CustomTrip;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CustomTripCreated extends Mailable
{
    use Queueable, SerializesModels;

    public $trip;

    /**
     * Create a new message instance.
     */
    public function __construct(CustomTrip $trip)
    {
        $this->trip = $trip;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $subject = "Custom Trip Request #{$this->trip->id} Submitted – Await Confirmation";

        return $this->subject($subject)
            ->markdown('emails.custom-trip-created')
            ->with([
                'customTrip' => $this->trip,
            ]);
    }
}
