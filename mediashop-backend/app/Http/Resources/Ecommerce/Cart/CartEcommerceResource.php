<?php

namespace App\Http\Resources\Ecommerce\Cart;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartEcommerceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->resource->id,
            "user_id" => $this->resource->user_id,
            "product_id" => $this->resource->product_id,
            "product" => [
                "id" => $this->resource->product->id,
                "title" => $this->resource->product->title,
                "slug" => $this->resource->product->slug,
                "price_eur" => $this->resource->product->price_eur,
                "price_usd" => $this->resource->product->price_usd,
                "image" => env("APP_URL") . "storage/" . $this->resource->product->image,
                "brand" => $this->resource->product->brand ? [
                    "id" => $this->resource->product->brand->id,
                    "name" => $this->resource->product->brand->name,
                ] : NULL,
            ],
            "discount" => $this->resource->discount,
            "type_discount" => $this->resource->type_discount,
            "type_campign" => $this->resource->type_campign,
            "code_coupon" => $this->resource->code_coupon,
            "code_discount" => $this->resource->code_discount,
            "product_variation_id" => $this->resource->product_variation_id,
            "product_variation" => $this->resource->product_variation ? [
                "id" => $this->resource->product_variation->id,
                "attribute_id" => $this->resource->product_variation->attribute_id,
                "attribute" => $this->resource->product_variation->attribute ? [
                    "name" => $this->resource->product_variation->attribute->name,
                    "type_attribute" => $this->resource->product_variation->attribute->type_attribute
                ] : NULL,
                "property_id" => $this->resource->product_variation->property_id,
                "property" => $this->resource->product_variation->property ? [
                    "name" => $this->resource->product_variation->property->name,
                    "code" => $this->resource->product_variation->property->code
                ] : NULL,
                "value_add" => $this->resource->product_variation->value_add,
                "variation_parent" => $this->resource->product_variation->variation_parent ? [
                    "id" => $this->resource->product_variation->variation_parent->id,
                    "attribute_id" => $this->resource->product_variation->variation_parent->attribute_id,
                    "attribute" => $this->resource->product_variation->variation_parent->attribute ? [
                        "name" => $this->resource->product_variation->variation_parent->attribute->name,
                        "type_attribute" => $this->resource->product_variation->variation_parent->attribute->type_attribute
                    ] : NULL,
                    "property_id" => $this->resource->product_variation->variation_parent->property_id,
                    "property" => $this->resource->product_variation->variation_parent->property ? [
                        "name" => $this->resource->product_variation->variation_parent->property->name,
                        "code" => $this->resource->product_variation->variation_parent->property->code
                    ] : NULL,
                    "value_add" => $this->resource->product_variation->variation_parent->value_add,
                ] : NULL
            ] : NULL,
            "quantity" => $this->resource->quantity,
            "price_unit" => $this->resource->price_unit,
            "subtotal" => $this->resource->subtotal,
            "total" => $this->resource->total,
            "currency" => $this->resource->currency,
            "created_at" => $this->resource->created_at->format("Y-m-d h:i A"),
        ];
    }
}
