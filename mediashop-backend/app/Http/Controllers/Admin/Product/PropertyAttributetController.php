<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\Property;
use Illuminate\Http\Request;

class PropertyAttributetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
            "message" => 200,
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $property = Property::findOrFail($id);
        $property->delete();
        return response()->json([
            "message" => 200
        ]);
    }
}
