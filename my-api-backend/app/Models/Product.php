<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'title', 'name', 'team_name', 'year', 'jersey_type', 'league', 'description', 'price', 'prev_price', 'image',
        'discount_percent', 'discount_fixed', 'in_stock', 'size_chart', 'sizes', 'shipping_time_days', 'brand',
        'country_of_origin', 'fabric', 'details', 'product_id'
    ];

    protected $casts = [
        'price' => 'float',
        'prev_price' => 'float',
        'discount_percent' => 'float',
        'discount_fixed' => 'float',
        'in_stock' => 'boolean',
        'sizes' => 'array',
        'details' => 'array',
    ];

    // Generate a product_id if not set
    protected static function booted()
    {
        static::creating(function ($product) {
            if (empty($product->product_id)) {
                // simple unique id: JERSEY- + timestamp + random
                $product->product_id = 'JERSEY-' . time() . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
            }
        });
    }
}
