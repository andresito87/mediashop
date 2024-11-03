<?php

namespace App\Http\Resources\Coupon;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
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
            "code" => $this->resource->code,
            "type_discount" => $this->resource->type_discount,
            "discount" => $this->resource->discount,
            "type_count" => $this->resource->type_count,
            "num_uses" => $this->resource->num_uses,
            "type_coupon" => $this->resource->type_coupon,
            "created_at" => $this->resource->created_at->format("Y-m-d h:i A"), // 6 AM 6 PM
            "state" => $this->resource->state,
            "products" => $this->resource->products->map(function ($product_aux) {
                return [
                    "id" => $product_aux->id,
                    "title" => $product_aux->product->title,
                    "image" => env("APP_URL") . "storage/" . $product_aux->product->image,
                    "product_id" => $product_aux->product_id
                ];
            }),
            "categories" => $this->resource->categories->map(function ($categorie_aux) {
                return [
                    "id" => $categorie_aux->id,
                    "name" => $categorie_aux->categorie->name,
                    "image" => env("APP_URL") . "storage/" . $categorie_aux->categorie->image,
                    "categorie_id" => $categorie_aux->categorie_id
                ];
            }),
            "brands" => $this->resource->brands->map(function ($brand_aux) {
                return [
                    "id" => $brand_aux->id,
                    "name" => $brand_aux->brand->name,
                    "brand_id" => $brand_aux->product_id
                ];
            }),
        ];
    }
}
