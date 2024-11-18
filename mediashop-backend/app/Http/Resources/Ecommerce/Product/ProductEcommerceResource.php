<?php

namespace App\Http\Resources\Ecommerce\Product;

use App\Models\Product\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductEcommerceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $greater_discount = null;

        $discount_collect = collect([]);

        // call to mutators of Product(
        // getDiscountProductAttribute(),
        // getDiscountCategorieAttribute(),
        // getDiscountBrandAttribute()
        // )
        $discount_product = $this->resource->discount_product;
        if ($discount_product) {
            $discount_collect->push($discount_product);
        }

        $discount_categorie = $this->resource->discount_categorie;
        if ($discount_categorie) {
            $discount_collect->push($discount_categorie);
        }
        $discount_brand = $this->resource->discount_brand;
        if ($discount_brand) {
            $discount_collect->push($discount_brand);
        }

        // save the greater discount
        if ($discount_collect->count() > 0) {
            $greater_discount = $discount_collect->sortByDesc("discount")->first();
        }

        // save variations and nested variations
        $variation_collect = collect([]);
        foreach ($this->resource->variations->groupBy("attribute_id") as $key => $variation_aux) {
            $variation_collect->push([
                "attribute_id" => $variation_aux[0]->attribute_id,
                "attribute" => $variation_aux[0]->attribute ? [
                    "name" => $variation_aux[0]->attribute->name,
                    "type_attribute" => $variation_aux[0]->attribute->type_attribute
                ] : NULL,
                "variations" => $variation_aux->map(function ($variation) {
                    // Get the total stock of the variation by summing the stock of nested variations
                    $nestedVariationsStock = $variation->variation_children()->sum("stock");
                    return [
                        "id" => $variation->id,
                        "product_id" => $variation->product_id,
                        "attribute_id" => $variation->attribute_id,
                        "attribute" => $variation->attribute ? [
                            "name" => $variation->attribute->name,
                            "type_attribute" => $variation->attribute->type_attribute
                        ] : NULL,
                        "property_id" => $variation->property_id,
                        "property" => $variation->property ? [
                            "name" => $variation->property->name,
                            "code" => $variation->property->code
                        ] : NULL,
                        "value_add" => $variation->value_add,
                        "add_price" => $variation->add_price,
                        "stock" => $nestedVariationsStock,
                        "subvariation" => $variation->variation_children->count() > 0 ? [
                            "attribute_id" => $variation->variation_children->first()->attribute_id,
                            "attribute" => $variation->variation_children->first()->attribute ? [
                                "name" => $variation->variation_children->first()->attribute->name,
                                "type_attribute" => $variation->variation_children->first()->attribute->type_attribute
                            ] : NULL,
                        ] : NULL,
                        "subvariations" => $variation->variation_children->map(function ($subvariation) {
                            return [
                                "id" => $subvariation->id,
                                "product_id" => $subvariation->product_id,
                                "attribute_id" => $subvariation->attribute_id,
                                "attribute" => $subvariation->attribute ? [
                                    "name" => $subvariation->attribute->name,
                                    "type_attribute" => $subvariation->attribute->type_attribute
                                ] : NULL,
                                "property_id" => $subvariation->property_id,
                                "property" => $subvariation->property ? [
                                    "name" => $subvariation->property->name,
                                    "code" => $subvariation->property->code
                                ] : NULL,
                                "value_add" => $subvariation->value_add,
                                "add_price" => $subvariation->add_price,
                                "stock" => $subvariation->stock,
                            ];
                        }),
                    ];
                })
            ]);
        }

        $tags_parse = [];
        foreach (($this->resource->tags ? json_decode($this->resource->tags, true) : []) as $key => $tag) {
            array_push($tags_parse, $tag["item_text"]);
        }

        return [
            "id" => $this->resource->id,
            "title" => $this->resource->title,
            "slug" => $this->resource->slug,
            "sku" => $this->resource->sku,
            "price_eur" => $this->resource->price_eur,
            "price_usd" => $this->resource->price_usd,
            "resume" => $this->resource->resume,
            "image" => env("APP_URL") . "storage/" . $this->resource->image,
            "state" => $this->resource->state,
            "description" => $this->resource->description,
            "tags" => $this->resource->tags ? json_decode($this->resource->tags) : [],
            "tags_parse" => $tags_parse,
            "brand_id" => $this->resource->brand_id,
            "brand" => $this->resource->brand ? [
                "id" => $this->resource->brand->id,
                "name" => $this->resource->brand->name,
            ] : NULL,
            "categorie_first_id" => $this->resource->categorie_first_id,
            "categorie_first" => $this->resource->categorie_first ? [
                "id" => $this->resource->categorie_first->id,
                "name" => $this->resource->categorie_first->name,
            ] : NULL,
            "categorie_second_id" => $this->resource->categorie_second_id,
            "categorie_second" => $this->resource->categorie_second ? [
                "id" => $this->resource->categorie_second->id,
                "name" => $this->resource->categorie_second->name,
            ] : NULL,
            "categorie_third_id" => $this->resource->categorie_third_id,
            "categorie_third" => $this->resource->categorie_third ? [
                "id" => $this->resource->categorie_third->id,
                "name" => $this->resource->categorie_third->name,
            ] : NULL,
            "stock" => $this->resource->stock,
            "created_at" => $this->resource->created_at->format("Y-m-d h:i:s"),
            "images" => $this->resource->images->map(function ($image) {
                return [
                    "id" => $image->id,
                    "image" => env("APP_URL") . "storage/" . $image->image
                ];
            }),
            "greater_discount" => $greater_discount,
            "variations" => $variation_collect
        ];
    }
}
