<?php

namespace App\Models\Product;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariation extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        "product_id",
        "attribute_id",
        "property_id",
        "value_add",
        "add_price",
        "stock",
        "product_variation_id"
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

    public function attribute()
    {
        return $this->belongsTo(Attribute::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function variation_parent()
    {
        return $this->belongsTo(ProductVariation::class, "product_variation_id");
    }

    public function variation_children()
    {
        return $this->hasMany(ProductVariation::class, "product_variation_id");
    }
}
