<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\TourPackage;

class Wishlist extends Model
{
    //
    protected $fillable = [
        'user_id',
        'tour_package_id',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function tourPackage() {
        return $this->belongsTo(TourPackage::class);
    }
}
