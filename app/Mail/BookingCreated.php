<?php

namespace App\Mail;

use App\Models\Booking;
use App\Models\PreferredPreparation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
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
        //
        $this->booking = $booking;
        $this->preferredPreparation = $preferredPreparation;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = match ($this->preferredPreparation->name) {
            'all_in' => 'Booking Submitted – Await for final amount',
            default => 'Booking Submitted – Payment Required',
        };

        return new Envelope(subject: $subject);
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.booking-created',
            with: [
                'booking' => $this->booking,
                'preferredPreparation' => $this->preferredPreparation,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
