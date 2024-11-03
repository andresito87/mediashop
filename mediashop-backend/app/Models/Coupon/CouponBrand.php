<?php

namespace App\Models\Coupon;

use App\Models\Product\Brand;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CouponBrand extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        "coupon_id",
        "brand_id"
    ];

    public function setCreatedAtAttribute($value)
    {
        date_default_timezone_set("Europe/Madrid");
        $this->attributes["created_at"] = Carbon::now();
    }

    public function setUpdatedAtAttribute($value)
    {
        date_default_timezone_set("Europe/Madrid");
        $this->attributes["updated_at"] = Carbon::now();
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
}
