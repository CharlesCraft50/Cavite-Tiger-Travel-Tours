<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TourPackage;
use App\Models\PackageCategory;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_package_id',
        'package_category_id',
        'first_name',
        'last_name',
        'contact_number',
        'email',
        'departure_date',
        'return_date',
        'pax_adult',
        'pax_kids',
        'travel_insurance',
        'notes',
        'payment_method',
        'status',
    ];

    // Define the relationship to the TourPackage model
    public function tourPackage()
    {
        return $this->belongsTo(TourPackage::class);
    }

    public function packageCategory()
    {
        return $this->belongsTo(PackageCategory::class);
    }
}
