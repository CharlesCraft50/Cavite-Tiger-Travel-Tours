<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\OtherService;

class OtherServiceTourPackage extends Model
{
    protected $fillable = [
        'tour_package_id',
        'other_service_id',
        'package_specific_price',
        'is_recommended',
        'sort_order',
    ];

    public function otherService() {
        return $this->belongsTo(OtherService::class);
    }
}
