<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Country;
use App\Models\TourPackage;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'country_id',
        'name',
        'overview',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function tourPackages()
    {
        return $this->hasMany(TourPackage::class);
    }
}
