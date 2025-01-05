<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\Property;
use Illuminate\Http\Request;

class PropertyAttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $properties = Property::all();
        return response()->json([
            "properties" => $properties
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $exist = Property::where("name", $request->name)
            ->where("attribute_id", $request->attribute_id)->first();
        if ($exist) {
            return response()->json([
                "message" => 403
            ]);
        }
        $property = Property::create($request->all());
        return response()->json([
            "message" => 201,
            "property" => [
                "id" => $property->id,
                "name" => $property->name,
                "code" => $property->code,
                "created_at" => $property->created_at->format("Y-m-d h:i:s"),
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

        $property = Property::find($id);

        if (!$property) {
            return response()->json([
                "message" => 404,
                "message_text" => "La propiedad no existe."
            ]);
        }

        $property->update($request->all());
        return response()->json([
            "message" => 200,
            "property" => [
                "id" => $property->id,
                "name" => $property->name,
                "code" => $property->code,
                "updated_at" => $property->updated_at->format("Y-m-d h:i:s"),
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $property = Property::find($id);

        if (!$property) {
            return response()->json([
                "message" => 404,
                "message_text" => "La propiedad no existe."
            ]);
        }

        // Validate when we delete property which is used in others products
        if (
            $property->specifications()->count() > 0
            || $property->variations()->count() > 0
        ) {
            return response()->json(["message" => 403, "message_text" => "La propiedad ya está en uso."]);
        }

        $property->delete();
        return response()->json([
            "message" => 200,
            "message_text" => "La propiedad ha sido eliminada."
        ]);
    }
}
