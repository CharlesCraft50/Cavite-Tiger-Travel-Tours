<h2>Hello {{ $trip->user->first_name ?? 'Traveler' }},</h2>

<p>Your <strong>Custom Trip Request (ID #{{ $trip->id }})</strong> has been submitted successfully.</p>

<p><strong>Date of Trip:</strong> {{ \Carbon\Carbon::parse($trip->date_of_trip)->toFormattedDateString() }}<br>
<strong>Pickup Time:</strong> {{ $trip->pickup_time ?? '—' }}<br>
<strong>Pickup Address:</strong> {{ $trip->pickup_address ?? '—' }}<br>
<strong>Destination:</strong> {{ $trip->destination ?? '—' }}</p>

@if($trip->preferredVan)
  <p><strong>Preferred Van:</strong> {{ $trip->preferredVan->name }}</p>
@endif

<p><strong>Status:</strong> {{ ucfirst($trip->status) }}</p>

@if($trip->notes)
  <p><strong>Notes:</strong> {{ $trip->notes }}</p>
@endif

<hr>

<p><strong>🕒 Next Step:</strong> Our staff will review your custom trip details and send the final quotation soon.</p>

<p>Once approved, you’ll receive another email with the final amount and payment instructions.</p>

<p>Thank you for choosing <strong>Cavite Tiger Travel & Tours</strong> for your custom travel experience!</p>

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
