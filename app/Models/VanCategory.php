<?php

namespace App\Models;

use App\Models\PreferredVan;

use Illuminate\Database\Eloquent\Model;

class VanCategory extends Model
{

    protected static function booted()
    {
        static::creating(function ($category) {
            if (empty($category->sort_order)) {
                $maxOrder = self::max('sort_order') ?? 0;
                $category->sort_order = $maxOrder + 1;
            }
        });
    }

    protected $fillable = [
        'name',
        'sort_order'
    ];

    public function preferredVans() {
        return $this->hasMany(PreferredVan::class);
    }
}
