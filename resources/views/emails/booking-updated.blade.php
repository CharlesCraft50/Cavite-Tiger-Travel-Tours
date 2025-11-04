@component('mail::message')
# Hello {{ $booking->first_name ?? 'Traveler' }},

Your booking **#{{ $booking->booking_number }}** has been updated.

**Status:** {{ ucfirst($booking->status) }}  
**Departure:** {{ \Carbon\Carbon::parse($booking->departure_date)->toFormattedDateString() }}  
**Return:** {{ \Carbon\Carbon::parse($booking->return_date)->toFormattedDateString() }}

@if($booking->preferredVan)
**Preferred Van:** {{ $booking->preferredVan->name }}
@endif

@if($booking->notes)
**Notes:** {{ $booking->notes }}
@endif

You can review your booking at:  
@component('mail::button', ['url' => 'https://cavitetigertours.servehttp.com/bookings/'.$booking->id])
View Booking
@endcomponent

Thank you for choosing **Cavite Tiger Travel & Tours**!

---

<p style="font-size: 14px; color: #555;">
  <strong>Cavite Tiger Travel & Tours</strong><br>
  2nd Floor WLM Bldg., Salawag, Dasmariñas, Cavite<br>
  📞 0956-375-9291<br>
  📧 <a href="mailto:cavitetigers2021@gmail.com">cavitetigers2021@gmail.com</a><br>
  👍 <a href="https://www.facebook.com/profile.php?id=100093876846720" target="_blank">
    Facebook Page
  </a>
</p>

<p style="font-size: 12px; color: #888;">
  This is an automated message. Please do not reply directly to this email.
</p>
@endcomponent
