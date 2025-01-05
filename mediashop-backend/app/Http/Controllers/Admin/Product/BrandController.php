<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        $brands = Brand::where("name", "like", "%$search%")
            ->orderBy("id", "desc")->paginate(25);

        return response()->json([
            "total" => $brands->total(),
            "brands" => $brands->map(function ($brand) {
                return [
                    "id" => $brand->id,
                    "name" => $brand->name,
                    "state" => $brand->state,
                    "created_at" => $brand->created_at->format("Y-m-d h:i:s"),
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'state' => 'required|numeric|in:1,2',
        ]);

        $exist = Brand::where("name", $request->name)->first();
        if ($exist) {
            return response()->json([
                "message" => 403,
                "message_text" => "La marca ya existe."
            ]);
        }

        $brand = Brand::create($request->all());
        return response()->json([
            "message" => 200,
            "brand" => [
                "id" => $brand->id,
                "name" => $brand->name,
                "state" => $brand->state,
                "created_at" => $brand->created_at->format("Y-m-d h:i:s"),
            ]
        ], 201);
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
        $exist = Brand::where("id", "<>", $id)->where("name", $request->name)->first();
        if ($exist) {
            return response()->json([
                "message" => 403,
                "message_text" => "La marca ya existe."
            ]);
        }
        $brand = Brand::find($id);

        $brand->update($request->all());
        return response()->json([
            "message" => 200,
            "brand" => [
                "id" => $brand->id,
                "name" => $brand->name,
                "state" => $brand->state,
                "created_at" => $brand->created_at->format("Y-m-d h:i:s"),
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                "message" => 404,
                "message_text" => "La marca no existe."
            ], 404);
        }

        // Validate when we delete brands which is used in others products
        if (
            $brand->products()->count() > 0
        ) {
            return response()->json(["message" => 403, "message_text" => "La marca ya está en uso."]);
        }

        $brand->delete();
        return response()->json([
            "message" => 200,
            "message_text" => "La marca ha sido eliminada."
        ]);
    }
}
