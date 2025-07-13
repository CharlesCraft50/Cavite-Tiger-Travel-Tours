<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use App\Models\City;
use App\Models\PackageCategory;
use App\Models\Comment;
use App\Models\PreferredVan;
use App\Models\OtherService;

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
        'pax_kids',
        'pax_adult',
        'available_from',
        'available_until',
        'image_overview',
        'image_banner',
        'slug',
        'base_price',
    ];

    protected $casts = [
        'available_from' => 'date',
        'available_until' => 'date',
        'base_price' => 'float',
    ];

    protected static function booted() 
    {
        static::creating(function ($package) {
            $slug = Str::slug($package->title);
            $count = static::where('slug', 'like', "{$slug}%")->count();
            $package->slug = $count ? "{$slug}-{$count}" : $slug;
        });
    }

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

    public function preferredVans() {
        return $this->belongsToMany(PreferredVan::class, 'package_preferred_van');
    }

    public function otherServices()
    {
        return $this->belongsToMany(OtherService::class, 'other_service_tour_packages')
            ->withPivot('package_specific_price', 'is_recommended', 'sort_order')
            ->withTimestamps();
    }
}
