<?php

namespace App\Mail;

use App\Models\CustomTrip;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CustomTripUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $customTrip;

    /**
     * Create a new message instance.
     */
    public function __construct(CustomTrip $customTrip)
    {
        $this->customTrip = $customTrip;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $subject = "Custom Trip #{$this->customTrip->id} Updated";

        return $this->subject($subject)
            ->markdown('emails.custom-trip-updated')
            ->with([
                'customTrip' => $this->customTrip,
            ]);
    }
}
