<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreferredPreparation extends Model
{
    protected $fillable = [
        'name',
        'label',
        'requires_valid_id',
    ];
}
