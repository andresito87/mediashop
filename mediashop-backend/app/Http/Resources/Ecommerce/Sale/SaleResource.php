<?php

namespace App\Http\Resources\Ecommerce\Sale;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
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
            "user" => [
                "avatar" => $this->resource->user->avatar
                    ? env("APP_URL") . "storage/" . $this->resource->user->avatar
                    : "https://cdn-icons-png.flaticon.com/512/5567/5567235.png",
                "fullname" => $this->resource->user->name . " " . $this->resource->user->surname
            ],
            "method_payment" => $this->resource->method_payment,
            "currency_total" => $this->resource->currency_total,
            "currency_payment" => $this->resource->currency_payment,
            "discount" => $this->resource->discount,
            "subtotal" => $this->resource->subtotal,
            "total" => $this->resource->total,
            "price_dolar" => $this->resource->price_dolar,
            "code_transaction" => $this->resource->code_transaction,
            "description" => $this->resource->description,
            "sale_details" => $this->resource->sale_details->map(function ($sale_detail) {
                return [
                    "id" => $sale_detail->id,
                    "product_id" => $sale_detail->product_id,
                    "product" => [
                        "id" => $sale_detail->product->id,
                        "title" => $sale_detail->product->title,
                        "slug" => $sale_detail->product->slug,
                        "price_eur" => $sale_detail->product->price_eur,
                        "price_usd" => $sale_detail->product->price_usd,
                        "image" => env("APP_URL") . "storage/" . $sale_detail->product->image,
                        "brand" => $sale_detail->product->brand ? [
                            "id" => $sale_detail->product->brand->id,
                            "name" => $sale_detail->product->brand->name,
                        ] : NULL,
                    ],
                    "discount" => $sale_detail->discount,
                    "type_discount" => $sale_detail->type_discount,
                    "type_campaign" => $sale_detail->type_campaign,
                    "code_coupon" => $sale_detail->code_coupon,
                    "code_discount" => $sale_detail->code_discount,
                    "product_variation_id" => $sale_detail->product_variation_id,
                    "product_variation" => $sale_detail->product_variation ? [
                        "id" => $sale_detail->product_variation->id,
                        "attribute_id" => $sale_detail->product_variation->attribute_id,
                        "attribute" => $sale_detail->product_variation->attribute ? [
                            "name" => $sale_detail->product_variation->attribute->name,
                            "type_attribute" => $sale_detail->product_variation->attribute->type_attribute
                        ] : NULL,
                        "property_id" => $sale_detail->product_variation->property_id,
                        "property" => $sale_detail->product_variation->property ? [
                            "name" => $sale_detail->product_variation->property->name,
                            "code" => $sale_detail->product_variation->property->code
                        ] : NULL,
                        "value_add" => $sale_detail->product_variation->value_add,
                        "variation_parent" => $sale_detail->product_variation->variation_parent ? [
                            "id" => $sale_detail->product_variation->variation_parent->id,
                            "attribute_id" => $sale_detail->product_variation->variation_parent->attribute_id,
                            "attribute" => $sale_detail->product_variation->variation_parent->attribute ? [
                                "name" => $sale_detail->product_variation->variation_parent->attribute->name,
                                "type_attribute" => $sale_detail->product_variation->variation_parent->attribute->type_attribute
                            ] : NULL,
                            "property_id" => $sale_detail->product_variation->variation_parent->property_id,
                            "property" => $sale_detail->product_variation->variation_parent->property ? [
                                "name" => $sale_detail->product_variation->variation_parent->property->name,
                                "code" => $sale_detail->product_variation->variation_parent->property->code
                            ] : NULL,
                            "value_add" => $sale_detail->product_variation->variation_parent->value_add,
                        ] : NULL
                    ] : NULL,
                    "quantity" => $sale_detail->quantity,
                    "price_unit" => $sale_detail->price_unit,
                    "subtotal" => $sale_detail->subtotal,
                    "total" => $sale_detail->total,
                    "currency" => $sale_detail->currency,
                    "created_at" => $sale_detail->created_at->format("Y-m-d h:i A"),
                    "review" => $sale_detail->review
                ];
            }),
            "sale_address" => $this->resource->sale_addres,
            "created_at" => $this->resource->created_at->format("Y-m-d h:i A")
        ];
    }
}
