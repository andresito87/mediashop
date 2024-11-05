<?php

namespace App\Models\Discount;

use App\Models\Product\Product;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DiscountProduct extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        "discount_id",
        "product_id"
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

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
