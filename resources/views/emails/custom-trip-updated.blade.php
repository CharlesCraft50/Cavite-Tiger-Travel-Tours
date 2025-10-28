@component('mail::message')
# Hello {{ $customTrip->user->first_name ?? 'Traveler' }},

Your custom trip **#{{ $customTrip->id }}** has been updated.

**Status:** {{ ucfirst($customTrip->status) }}  
**Date of Trip:** {{ \Carbon\Carbon::parse($customTrip->date_of_trip)->toFormattedDateString() }}  
**Pickup Time:** {{ $customTrip->pickup_time }}  
**Dropoff Time:** {{ $customTrip->dropoff_time }}

@if($customTrip->preferredVan)
**Preferred Van:** {{ $customTrip->preferredVan->name }}
@endif

@if($customTrip->notes)
**Notes:** {{ $customTrip->notes }}
@endif

@component('mail::button', ['url' => url('/custom-trips/'.$customTrip->id)])
View Custom Trip
@endcomponent

<p>Thank you for choosing <strong>Cavite Tiger Travel & Tours</strong> for your custom travel experience!</p>

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
