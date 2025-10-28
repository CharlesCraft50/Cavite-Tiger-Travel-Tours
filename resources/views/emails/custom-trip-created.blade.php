@component('mail::message')
# Hello {{ $trip->user->first_name ?? 'Traveler' }},

Your custom trip request **#{{ $trip->id }}** has been submitted successfully.

**Status:** {{ ucfirst($trip->status) }}  
**Date of Trip:** {{ \Carbon\Carbon::parse($trip->date_of_trip)->toFormattedDateString() }}  
**Pickup Time:** {{ $trip->pickup_time ?? '—' }}  
**Pickup Address:** {{ $trip->pickup_address ?? '—' }}  
**Destination:** {{ $trip->destination ?? '—' }}

@if($trip->preferredVan)
**Preferred Van:** {{ $trip->preferredVan->name }}
@endif

@if($trip->notes)
**Notes:** {{ $trip->notes }}
@endif

---

**🕒 Next Step:** Our staff will review your custom trip details and send the final quotation soon.

Once approved, you’ll receive another email with the final amount and payment instructions.

@component('mail::button', ['url' => url('/custom-trips/'.$trip->id)])
View Trip
@endcomponent

Thank you for choosing **Cavite Tiger Travel & Tours** for your custom travel experience!

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
