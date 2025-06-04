<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use App\Models\TourPackage;

class PackageCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_package_id',
        'name',
        'content',
        'button_text',
        'has_button',
        'slug',
    ];

    protected static function booted()
    {
        static::creating(function ($category) {
            $slug = Str::slug($category->name);
            $count = static::where('slug', 'like', "{$slug}%")->count();
            $category->slug = $count ? "{$slug}-{$count}" : $slug;
        });
    }

    public function tourPackage()
    {
        return $this->belongsTo(TourPackage::class);
    }
}
