<?php

namespace App\Models\Sale;

use App\Models\Product\Product;
use App\Models\Product\ProductVariation;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SaleDetail extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        "sale_id",
        "product_id",
        "discount",
        "type_discount",
        "type_campaign",
        "code_coupon",
        "code_discount",
        "product_variation_id",
        "quantity",
        "price_unit",
        "subtotal",
        "total",
        "currency",
        "updated_at"
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

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function product_variation()
    {
        return $this->belongsTo(ProductVariation::class);
    }
}
