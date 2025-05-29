<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\City;
use App\Models\PackageCategory;
use App\Models\Comment;

class TourPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'city_id',
        'subtitle',
        'location',
        'content',
        'overview',
        'duration',
        'price_per_head',
        'pax_kids',
        'pax_adult',
        'available_from',
        'available_until',
        'image_overview',
        'image_banner',
        'slug',
    ];

    protected $casts = [
        'available_from' => 'date',
        'available_until' => 'date',
        'price_per_head' => 'float',
    ];

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function categories()
    {
        return $this->hasMany(PackageCategory::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
