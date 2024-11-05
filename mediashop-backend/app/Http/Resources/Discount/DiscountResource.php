<?php

namespace App\Http\Resources\Discount;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiscountResource extends JsonResource
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
            "start_date" => Carbon::parse($this->resource->start_date)->format("Y-m-d"),
            "end_date" => Carbon::parse($this->resource->end_date)->format("Y-m-d"),
            "target_discount" => $this->resource->type_coupon,
            "created_at" => $this->resource->created_at->format("Y-m-d h:i A"), // 6 AM 6 PM
            "type_campaign" => $this->resource->type_campaign,
            "state" => $this->resource->state,
            "products" => $this->resource->products->map(function ($product_aux) {
                return [
                    "id" => $product_aux->product->id,
                    "title" => $product_aux->product->title,
                    "image" => env("APP_URL") . "storage/" . $product_aux->product->image,
                    "product_aux_id" => $product_aux->id
                ];
            }),
            "categories" => $this->resource->categories->map(function ($categorie_aux) {
                return [
                    "id" => $categorie_aux->categorie->id,
                    "name" => $categorie_aux->categorie->name,
                    "image" => env("APP_URL") . "storage/" . $categorie_aux->categorie->image,
                    "categorie_aux_id" => $categorie_aux->id
                ];
            }),
            "brands" => $this->resource->brands->map(function ($brand_aux) {
                return [
                    "id" => $brand_aux->brand->id,
                    "name" => $brand_aux->brand->name,
                    "brand_aux_id" => $brand_aux->id
                ];
            }),
        ];
    }
}
