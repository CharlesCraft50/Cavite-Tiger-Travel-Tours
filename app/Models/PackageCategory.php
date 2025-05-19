<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\TourPackage;

class PackageCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_package_id',
        'name',
        'content',
        'has_button'
    ];

    public function tourPackage()
    {
        return $this->belongsTo(TourPackage::class);
    }
}
