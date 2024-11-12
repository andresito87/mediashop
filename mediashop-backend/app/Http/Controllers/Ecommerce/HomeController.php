<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Http\Resources\Ecommerce\Product\ProductEcommerceCollection;
use App\Models\Product\Categorie;
use App\Models\Product\Product;
use App\Models\Slider;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    //

    public function home(Request $request)
    {
        $sliders_principal = Slider::where("state", 1)
            ->where("type_slider", 1)
            ->orderBy("id", "desc")->get();

        $categories_randoms = Categorie::withCount(["product_categorie_firsts"])
            ->where("categorie_second_id", NULL)
            ->where("categorie_third_id", NULL)
            ->inRandomOrder()
            ->limit(5)->get();

        $products_trending_new = Product::where("state", 2)->inRandomOrder()->limit(8)->get();
        $products_trending_featured = Product::where("state", 2)->inRandomOrder()->limit(8)->get();
        $products_trending_top_sellers = Product::where("state", 2)->inRandomOrder()->limit(8)->get();

        return response()->json([
            "sliders_principal" => $sliders_principal->map(function ($slider) {
                return [
                    "id" => $slider->id,
                    "title" => $slider->title,
                    "subtitle" => $slider->subtitle,
                    "label" => $slider->label,
                    "image" => $slider->image ? env("APP_URL") . "storage/" . $slider->image : NULL,
                    "link" => $slider->link,
                    "state" => $slider->state,
                    "color" => $slider->color,
                    "type_slider" => $slider->type_slider,
                    "price_original" => $slider->price_original,
                    "price_campaign" => $slider->price_campaign
                ];
            }),
            "categories_random" => $categories_randoms->map(function ($categorie) {
                return [
                    "id" => $categorie->id,
                    "name" => $categorie->name,
                    "products_count" => $categorie->product_categorie_firsts_count,
                    "image" => env("APP_URL") . "storage/" . $categorie->image,
                ];
            }),
            "products_trending_new" => ProductEcommerceCollection::make($products_trending_new),
            "products_trending_featured" => ProductEcommerceCollection::make($products_trending_featured),
            "products_trending_top_sellers" => ProductEcommerceCollection::make($products_trending_top_sellers),
        ]);
    }

    public function menus()
    {
        $categories_menu = Categorie::where("categorie_second_id", NULL)
            ->where("categorie_third_id", NULL)
            ->orderBy("position", "desc")
            ->get();

        return response()->json([
            "categories_menu" => $categories_menu->map(function ($department) {
                return [
                    "id" => $department->id,
                    "name" => $department->name,
                    "icon" => $department->icon,
                    "categories" => $department->categorie_seconds->map(function ($categorie) {
                        return [
                            "id" => $categorie->id,
                            "name" => $categorie->name,
                            "image" => $categorie->image ? env("APP_URL") . "storage/" . $categorie->image : NULL,
                            "subcategories" => $categorie->categorie_seconds->map(function ($subcategorie) {
                                return [
                                    "id" => $subcategorie->id,
                                    "name" => $subcategorie->name,
                                    "image" => $subcategorie->image ? env("APP_URL") . "storage/" . $subcategorie->image : NULL,
                                ];
                            }),
                        ];
                    }),
                ];
            }),
        ]);
    }
}
