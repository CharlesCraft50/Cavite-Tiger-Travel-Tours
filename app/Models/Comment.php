<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TourPackage;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_package_id',
        'name',
        'email',
        'message'
    ];

    public function tourPackage() {
        return $this->belongsTo(TourPackage::class);
    }
}
