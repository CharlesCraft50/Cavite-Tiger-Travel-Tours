@component('mail::message')
# Hello {{ $booking->first_name ?? 'Traveler' }},

Your booking **#{{ $booking->booking_number }}** has been **submitted**.

**Status:** {{ ucfirst($booking->status) }}  
**Departure:** {{ \Carbon\Carbon::parse($booking->departure_date)->toFormattedDateString() }}  
**Return:** {{ \Carbon\Carbon::parse($booking->return_date)->toFormattedDateString() }}

@if($booking->preferredVan)
**Preferred Van:** {{ $booking->preferredVan->name }}
@endif

@if($booking->notes)
**Notes:** {{ $booking->notes }}
@endif

@if($preferredPreparation->name === 'all_in')
**🕒 Next Step:** Please wait for our confirmation and the final amount of your all-in package.

Our team will contact you shortly with the total cost and details for payment confirmation.

@else
**Next Step:** To confirm your booking, please pay using GCash and submit your reference number and proof of payment.

@component('mail::panel')
- Gcash payment method only  
- Upload a clear screenshot of your transaction  
- Enter your 12-digit reference number
@endcomponent

@component('mail::button', ['url' => 'https://cavitetigertours.servehttp.com/book-now/payment/'.$booking->id])
Complete Payment
@endcomponent

@endif

Thank you for choosing us!

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
