<?php

namespace App\Http\Controllers\Admin\Product;

use App\Models\Product\Brand;
use App\Models\Product\Categorie;
use Illuminate\Http\Request;
use App\Models\Product\Product;
use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductCollection;
use App\Http\Resources\Product\ProductResource;
use App\Models\Product\ProductImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input("search");
        $categorie_first_id = $request->input("categorie_first_id");
        $categorie_second_id = $request->input("categorie_second_id");
        $categorie_third_id = $request->input("categorie_third_id");
        $brand_id = $request->input("brand_id");

        $products = Product::filterAdvanceProduct($search, $categorie_first_id, $categorie_second_id, $categorie_third_id, $brand_id)
            ->orderBy("id")->paginate(25);

        return response()->json([
            "total" => $products->total(),
            "products" => ProductCollection::make($products)
        ]);

    }

    public function config()
    {
        // get all departments
        $categories_first_level = Categorie::where("state", 1)->where("categorie_second_id", NULL)->where("categorie_third_id", NULL)->get();
        // get all categories
        $categories_second_level = Categorie::where("state", 1)->where("categorie_second_id", "<>", NULL)->where("categorie_third_id", NULL)->get();
        // get all subcategories
        $categories_third_level = Categorie::where("state", 1)->where("categorie_second_id", "<>", NULL)->where("categorie_third_id", "<>", NULL)->get();

        $brands = Brand::where("state", 1)->get();

        return response()->json([
            "categories_first" => $categories_first_level,
            "categories_second" => $categories_second_level,
            "categories_third" => $categories_third_level,
            "brands" => $brands
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "title" => "required",
            "sku" => "required",
            "slug" => "required",
            "price_eur" => "required",
            "price_usd" => "required",
            "description" => "required",
            "resume" => "required",
            "image" => "required",
            "brand_id" => "required",
            "categorie_first_id" => "required",
        ]);

        $exist = Product::where("title", $request->title)->first();
        if ($exist) {
            return response()->json(["message" => 403, "message_text" => "El nombre del producto ya existe"]);
        }

        if ($request->hasFile("cover_image")) {
            $path = Storage::putFile("products", $request->file("cover_image"));
            $request->request->add(["image" => $path]);
        }

        $request->request->add(["slug" => Str::slug($request->title)]);

        $request->request->add(["tags" => $request->multiselect]);

        $product = Product::create($request->all());
        return response()->json([
            "message" => 200,
            "message_text" => "Producto creado correctamente",
            "product" => ProductResource::make($product)
        ], 201);
    }

    public function images(Request $request)
    {
        $product_id = $request->product_id;

        if ($request->hasFile("image_add")) {
            $path = Storage::putFile("products", $request->file("image_add"));
        }

        $product_image = ProductImage::create([
            "image" => $path,
            "product_id" => $product_id
        ]);

        return response()->json([
            "image" => [
                "id" => $product_image->id,
                "image" => env('APP_URL') . "storage/" . $product_image->image
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);

        return response()->json(["product" => ProductResource::make($product)]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // to avoid update a product with the same title that another product exists in our database
        $exist = Product::where("id", "<>", $id)->where("title", $request->title)->first();
        if ($exist) {
            return response()->json(["message" => 403, "message_text" => "El nombre del producto ya existe"]);
        }

        // process to update product image
        $product = Product::find($id);

        if (!$product) {
            return response()->json(["message" => 404, "message_text" => "Producto no encontrado"], 404);
        }

        if ($request->hasFile("cover_image")) {
            if ($product->image) {
                Storage::delete($product->image);
            }
            $path = Storage::putFile("products", $request->file("cover_image"));
            $request->request->add(["image" => $path]);
        }

        $request->request->add(["slug" => Str::slug($request->title)]);

        $request->request->add(["tags" => $request->multiselect]);

        $product->update($request->all());
        return response()->json(["message" => 200, "message_text" => "Producto actualizado correctamente"]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(["message" => 404, "message_text" => "Producto no encontrado"], 404);
        }

        $product->delete();

        return response()->json(["message" => 200, "message_text" => "Producto eliminado correctamente"]);
    }

    public function delete_image(string $id)
    {
        $product = ProductImage::findOrFail($id);
        if ($product->image) {
            Storage::delete($product->image);
        }

        $product->delete();

        return response()->json(["message" => 200, "message_text" => "Imagen eliminada correctamente"]);
    }

}
