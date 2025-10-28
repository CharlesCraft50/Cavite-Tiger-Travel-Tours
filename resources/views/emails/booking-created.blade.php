<h2>Hello {{ $booking->first_name }},</h2>

<p>Your booking <strong>#{{ $booking->booking_number }}</strong> has been <strong>submitted</strong>.</p>

<p>
  <strong>Departure:</strong> {{ \Carbon\Carbon::parse($booking->departure_date)->toFormattedDateString() }}<br>
  <strong>Return:</strong> {{ \Carbon\Carbon::parse($booking->return_date)->toFormattedDateString() }}
</p>

@if($booking->preferredVan)
  <p><strong>Preferred Van:</strong> {{ $booking->preferredVan->name }}</p>
@endif

<p><strong>Status:</strong> {{ ucfirst($booking->status) }}</p>

@if($booking->notes)
  <p><strong>Notes:</strong> {{ $booking->notes }}</p>
@endif

<hr>

{{-- Dynamic message based on preferred preparation --}}
@if($preferredPreparation->name === 'all_in')
  <p><strong>🕒 Next Step:</strong> Please wait for our confirmation and the final amount of your all-in package.</p>

  <p>Our team will contact you shortly with the total cost and details for payment confirmation.</p>

@else
  <p><strong>✅ Next Step:</strong> To confirm your booking, please pay using GCash and submit your reference number and proof of payment.</p>

  <ul>
    <li>Gcash payment method only</li>
    <li>Upload a clear screenshot of your transaction</li>
    <li>Enter your 12-digit reference number</li>
  </ul>

  <p>You can complete your payment at the link below:</p>

  <p>
    <a href="{{ url('/book-now/payment/'.$booking->id) }}">
      {{ url('/book-now/payment/'.$booking->id) }}
    </a>
  </p>
@endif

<p>Thank you for choosing us!</p>

<hr>

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
