<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\CategorieCollection;
use App\Http\Resources\Product\CategorieResource;
use App\Models\Product\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        $categories = Categorie::where("name", "like", "%" . $search . "%")->orderBy("id", "desc")->paginate(25);

        return response()->json([
            "total" => $categories->total(),
            "categories" => CategorieCollection::make($categories)
        ]);

    }

    public function config()
    {
        // get all departments
        $categories_first_level = Categorie::where("categorie_second_id", NULL)->where("categorie_third_id", NULL)->get();
        // get all categories
        $categories_second_level = Categorie::where("categorie_second_id", "<>", NULL)->where("categorie_third_id", NULL)->get();

        return response()->json([
            "categories_first" => $categories_first_level,
            "categories_second" => $categories_second_level
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exists = Categorie::where("name", $request->name)->first();

        if ($is_exists) {
            return response()->json(["message" => 403]);
        }

        if ($request->hasfile("imagen")) {
            $path = Storage::putFile("categories", $request->file("imagen"), );
            $request->merge(['image' => $path]);
        }

        $categorie = Categorie::create($request->all());
        return response()->json(["message" => 200]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $categorie = Categorie::findOrFail($id);

        return response()->json(["categorie" => CategorieResource::make($categorie)]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $is_exists = Categorie::where("id", "<>", $id)->where("name", $request->name)->first();

        if ($is_exists) {
            return response()->json(["message" => 403]);
        }
        $categorie = Categorie::findOrFail($id);
        if ($request->hasfile("image")) {
            if ($categorie->image) {
                Storage::delete($categorie->image);
            }
            $path = Storage::putFile("categories", $request->file("image"));
            $request->request->add(["image" => $path]);
        }

        $categorie->update($request->all());
        return response()->json(["message" => 200]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $categorie = Categorie::findOrFail($id);
        $categorie->delete();
        // Validate that the category is not included in any product
        return response()->json(["message" => 200]);
    }
}
