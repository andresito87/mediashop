<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\Attribute;
use App\Models\Product\ProductVariation;
use Illuminate\Http\Request;

class ProductVariationsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $product_id = $request->product_id;

        $product_variations = ProductVariation::where("product_id", $product_id)
            ->orderBy("id", "desc")->get();

        return response()->json([
            "variations" => $product_variations->map(function ($variation) {
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
                    "stock" => $variation->stock
                ];
            })
        ]);
    }

    public function config()
    {
        $attributes_specifications = Attribute::where("state", 1)
            ->orderBy("id", "desc")->get();

        $attributes_variations = Attribute::where("state", 1)
            ->whereIn("type_attribute", [1, 3]) // only text or selectable inputs
            ->orderBy("id", "desc")->get();

        return response()->json([
            "attributes_specifications" => $attributes_specifications->map(function ($specification) {
                return [
                    "id" => $specification->id,
                    "name" => $specification->name,
                    "type_specification" => $specification->type_attribute,
                    "state" => $specification->state,
                    "created_at" => $specification->created_at->format("Y-m-d h:i:s"),
                    "properties" => optional($specification->properties)->map(function ($property) {
                        return [
                            "id" => $property->id,
                            "name" => $property->name,
                            "code" => $property->code,
                        ];
                    }) ?? []
                ];
            }),
            "attributes_variations" => $attributes_variations->map(function ($variation) {
                return [
                    "id" => $variation->id,
                    "name" => $variation->name,
                    "type_variation" => $variation->type_attribute,
                    "state" => $variation->state,
                    "created_at" => $variation->created_at->format("Y-m-d h:i:s"),
                    "properties" => optional($variation->properties)->map(function ($property) {
                        return [
                            "id" => $property->id,
                            "name" => $property->name,
                            "code" => $property->code,
                        ];
                    }) ?? []
                ];
            })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate that a attribute variation only exist a time for a product
        // And if exist doen't allow add it again, only to edit it is allowed(for example: to edit its stock)
        $variations_exist = ProductVariation::where("product_id", $request->product_id)
            ->count();
        if ($variations_exist > 0) {
            $variations_attributes_exist = ProductVariation::where("product_id", $request->product_id)
                ->where("attribute_id", $request->attribute_id)
                ->count();
            if ($variations_attributes_exist == 0) {
                return response()->json(["message_text" => "No se puede agregar una variación de un atributo que no tiene este producto."], 403);
            }
        }

        $is_valid_variation = null;
        if ($request->property_id) {
            $is_valid_variation = ProductVariation::where("product_id", $request->product_id)
                ->where("attribute_id", $request->attribute_id)
                ->where("property_id", $request->property_id)
                ->first();

        } else {
            $is_valid_variation = ProductVariation::where("product_id", $request->product_id)
                ->where("attribute_id", $request->attribute_id)
                ->where("value_add", $request->value_add)
                ->first();

        }
        if ($is_valid_variation) {
            return response()->json(["message_text" => "La variación ya existe."], 403);
        }

        $product_variation = ProductVariation::create($request->all());

        return response()->json([
            "message" => 200,
            "message_text" => "Variación creada correctamente.",
            "variation" => [
                "id" => $product_variation->id,
                "product_id" => $product_variation->product_id,
                "attribute_id" => $product_variation->attribute_id,
                "attribute" => $product_variation->attribute ? [
                    "name" => $product_variation->attribute->name,
                    "type_attribute" => $product_variation->attribute->type_attribute
                ] : NULL,
                "property_id" => $product_variation->property_id,
                "property" => $product_variation->property ? [
                    "name" => $product_variation->property->name,
                    "code" => $product_variation->property->code
                ] : NULL,
                "value_add" => $product_variation->value_add,
                "add_price" => $product_variation->add_price,
                "stock" => $product_variation->stock
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate that a attribute variation only exist a time for a product
        // And if exist doen't allow add it again, only to edit it is allowed(for example: to edit its stock)
        $variations_exist = ProductVariation::where("product_id", $request->product_id)
            ->count();
        if ($variations_exist > 0) {
            $variations_attributes_exist = ProductVariation::where("product_id", $request->product_id)
                ->where("attribute_id", $request->attribute_id)
                ->count();
            if ($variations_attributes_exist == 0) {
                return response()->json(["message_text" => "No se puede agregar una variación de un atributo que no tiene este producto."], 403);
            }
        }

        $is_valid_variation = null;
        if ($request->property_id) {
            $is_valid_variation = ProductVariation::where("product_id", $request->product_id)
                ->where("id", "<>", $id)
                ->where("attribute_id", $request->attribute_id)
                ->where("property_id", $request->property_id)
                ->first();

        } else {
            $is_valid_variation = ProductVariation::where("product_id", $request->product_id)
                ->where("id", "<>", $id)
                ->where("attribute_id", $request->attribute_id)
                ->where("value_add", $request->value_add)
                ->first();

        }
        if ($is_valid_variation) {
            return response()->json(["message_text" => "La variación ya existe."], 403);
        }

        $product_variation = ProductVariation::findOrFail($id);
        $product_variation->update($request->all());

        return response()->json([
            "message" => 200,
            "message_text" => "Variación actualizada correctamente.",
            "variation" => [
                "id" => $product_variation->id,
                "product_id" => $product_variation->product_id,
                "attribute_id" => $product_variation->attribute_id,
                "attribute" => $product_variation->attribute ? [
                    "name" => $product_variation->attribute->name,
                    "type_attribute" => $product_variation->attribute->type_attribute
                ] : NULL,
                "property_id" => $product_variation->property_id,
                "property" => $product_variation->property ? [
                    "name" => $product_variation->property->name,
                    "code" => $product_variation->property->code
                ] : NULL,
                "value_add" => $product_variation->value_add,
                "add_price" => $product_variation->add_price,
                "stock" => $product_variation->stock
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product_variation = ProductVariation::findOrFail($id);
        $product_variation->delete();

        // TODO: Validation needed to avoid delete a variation in use

        // TODO: improve api responses
        // if ($product_variation->delete()) {
        //     return response()->json(["status" => 200, "message_text" => "Variación eliminada correctamente."]);
        // } else {
        //     return response()->json(["status" => 500, "message_text" => "Error al eliminar la variación."], 500);
        // }

        return response()->json(["message" => 200, "message_text" => "Variación eliminada correctamente."]);
    }
}
