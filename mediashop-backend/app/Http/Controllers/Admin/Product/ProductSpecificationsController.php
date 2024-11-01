<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\ProductSpecification;
use Illuminate\Http\Request;

class ProductSpecificationsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $product_id = $request->product_id;

        $product_specifications = ProductSpecification::where("product_id", $product_id)
            ->orderBy("id", "desc")->get();

        return response()->json([
            "specifications" => $product_specifications->map(function ($specification) {
                return [
                    "product_id" => $specification->product_id,
                    "attribute_id" => $specification->attribute_id,
                    "attribute" => $specification->attribute ? [
                        "name" => $specification->attribute->name,
                        "type_attribute" => $specification->attribute->type_attribute
                    ] : NULL,
                    "property_id" => $specification->property_id,
                    "property" => $specification->property ? [
                        "name" => $specification->property->name,
                        "code" => $specification->property->code
                    ] : NULL,
                    "value_add" => $specification->value_add
                ];
            })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_valid_specification = null;
        if ($request->property_id) {
            $is_valid_specification = ProductSpecification::where("product_id", $request->product_id)
                ->where("attribute_id", $request->attribute_id)
                ->where("property_id", $request->property_id)
                ->first();

        } else {
            $is_valid_specification = ProductSpecification::where("product_id", $request->product_id)
                ->where("attribute_id", $request->attribute_id)
                ->where("value_add", $request->value_add)
                ->first();

        }
        if ($is_valid_specification) {
            return response()->json(["message" => 403, "message_text" => "La especificación ya existe."]);
        }

        $product_specification = ProductSpecification::create($request->all());

        return response()->json([
            "message" => 200,
            "message_text" => "Especificación creada correctamente.",
            "variation" => [
                "product_id" => $product_specification->product_id,
                "attribute_id" => $product_specification->attribute_id,
                "attribute" => $product_specification->attribute ? [
                    "name" => $product_specification->attribute->name,
                    "type_attribute" => $product_specification->attribute->type_attribute
                ] : NULL,
                "property_id" => $product_specification->property_id,
                "property" => $product_specification->property ? [
                    "name" => $product_specification->property->name,
                    "code" => $product_specification->property->code
                ] : NULL,
                "value_add" => $product_specification->value_add
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
        $is_valid_specification = null;
        if ($request->property_id) {
            $is_valid_specification = ProductSpecification::where("product_id", $request->product_id)
                ->where("id", "<>", $id)
                ->where("attribute_id", $request->attribute_id)
                ->where("property_id", $request->property_id)
                ->first();

        } else {
            $is_valid_specification = ProductSpecification::where("product_id", $request->product_id)
                ->where("id", "<>", $id)
                ->where("attribute_id", $request->attribute_id)
                ->where("value_add", $request->value_add)
                ->first();

        }
        if ($is_valid_specification) {
            return response()->json(["message" => 403, "message_text" => "La especificación ya existe."]);
        }

        $product_specification = ProductSpecification::findOrFail($id);
        $product_specification->update($request->all());

        return response()->json([
            "message" => 200,
            "message_text" => "Especificación creada correctamente.",
            "variation" => [
                "product_id" => $product_specification->product_id,
                "attribute_id" => $product_specification->attribute_id,
                "attribute" => $product_specification->attribute ? [
                    "name" => $product_specification->attribute->name,
                    "type_attribute" => $product_specification->attribute->type_attribute
                ] : NULL,
                "property_id" => $product_specification->property_id,
                "property" => $product_specification->property ? [
                    "name" => $product_specification->property->name,
                    "code" => $product_specification->property->code
                ] : NULL,
                "value_add" => $product_specification->value_add
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product_specification = ProductSpecification::findOrFail($id);
        $product_specification->delete();

        // TODO: Validation needed to avoid delete a specification in use

        // TODO: improve api responses
        // if ($product_specification->delete()) {
        //     return response()->json(["status" => 200, "message_text" => "Especificación eliminada correctamente."]);
        // } else {
        //     return response()->json(["status" => 500, "message_text" => "Error al eliminar la especificación."], 500);
        // }

        return response()->json(["message" => 200, "message_text" => "Especificación eliminada correctamente."]);
    }
}
