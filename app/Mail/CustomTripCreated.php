<?php

namespace App\Mail;

use App\Models\CustomTrip;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CustomTripCreated extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public CustomTrip $trip;

    /**
     * Create a new message instance.
     */
    public function __construct(CustomTrip $trip)
    {
        $this->trip = $trip;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Custom Trip Request Submitted – Await Confirmation',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.custom-trip-created',
            with: [
                'trip' => $this->trip,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
