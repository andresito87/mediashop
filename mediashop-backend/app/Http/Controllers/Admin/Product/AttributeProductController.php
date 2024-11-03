<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\Attribute;
use Illuminate\Http\Request;

class AttributeProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        $attributes = Attribute::where("name", "like", "%" . $search . "%")->orderBy("id", "desc")->paginate(25);

        return response()->json([
            "total" => $attributes->total(),
            "attributes" => $attributes->map(function ($attribute) {
                return [
                    "id" => $attribute->id,
                    "name" => $attribute->name,
                    "type_attribute" => $attribute->type_attribute,
                    "state" => $attribute->state,
                    "created_at" => $attribute->created_at->format("Y-m-d h:i:s"),
                    "properties" => optional($attribute->properties)->map(function ($property) {
                        return [
                            "id" => $property->id,
                            "name" => $property->name,
                            "code" => $property->code,
                        ];
                    }) ?? []
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $exist = Attribute::where("name", $request->name)->first();
        if ($exist) {
            return response()->json([
                "message" => 403
            ]);
        }
        $attribute = Attribute::create($request->all());
        return response()->json([
            "message" => 200,
            "attribute" => [
                "id" => $attribute->id,
                "name" => $attribute->name,
                "type_attribute" => $attribute->type_attribute,
                "state" => $attribute->state,
                "created_at" => $attribute->created_at->format("Y-m-d h:i:s"),
                "properties" => optional($attribute->properties)->map(function ($property) {
                    return [
                        "id" => $property->id,
                        "name" => $property->name,
                        "code" => $property->code,
                    ];
                }) ?? []
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
        $exist = Attribute::where("id", "<>", $id)
            ->where("name", $request->name)->first();
        if ($exist) {
            return response()->json([
                "message" => 403
            ]);
        }
        $attribute = Attribute::findOrFail($id);
        $attribute->update($request->all());
        return response()->json([
            "message" => 200,
            "attribute" => [
                "id" => $attribute->id,
                "name" => $attribute->name,
                "type_attribute" => $attribute->type_attribute,
                "state" => $attribute->state,
                "created_at" => $attribute->created_at->format("Y-m-d h:i:s"),
                "properties" => optional($attribute->properties)->map(function ($property) {
                    return [
                        "id" => $property->id,
                        "name" => $property->name,
                        "code" => $property->code,
                    ];
                }) ?? []
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $attribute = Attribute::findOrFail($id);

        // Validate when we delete attribute which is used in others products
        if (
            $attribute->specifications()->count() > 0
            || $attribute->variations()->count() > 0
        ) {
            return response()->json(["message" => 403, "message_text" => "El atributo ya está en uso."]);
        }

        $attribute->delete();

        return response()->json([
            "message" => 200
        ]);
    }
}
