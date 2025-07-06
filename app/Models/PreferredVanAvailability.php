<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PreferredVan;

class PreferredVanAvailability extends Model
{
    protected $fillable = [
        'preferred_van_id',
        'available_from',
        'available_until',
        'count',
    ];

    public function preferredVan() {
        return $this->belongsTo(PreferredVan::class);
    }
}
