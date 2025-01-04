<?php

namespace App\Models\Product;

use App\Models\Discount\DiscountBrand;
use Carbon\Carbon;
use Database\Factories\BrandFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        "name",
        "state",
        "image"
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

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function discount_brands()
    {
        return $this->hasMany(DiscountBrand::class, "brand_id");
    }

    protected static function newFactory()
    {
        return new BrandFactory();
    }
}
