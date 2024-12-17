<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Http\Resources\Ecommerce\Product\ProductEcommerceCollection;
use App\Http\Resources\Ecommerce\Product\ProductEcommerceResource;
use App\Models\Discount\Discount;
use App\Models\Product\Categorie;
use App\Models\Product\Product;
use App\Models\Sale\Review;
use App\Models\Slider;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    //

    public function home(Request $request)
    {
        $sliders_principal = $sliders_principal = Slider::where("state", 1)
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

        $sliders_secondaries = Slider::where("state", 1)
            ->where("type_slider", 2)
            ->orderBy("id", "asc")->get();

        $products_electronics_gadgets = Product::where("state", 2)
            ->where("categorie_first_id", 1)
            ->inRandomOrder()->limit(6)->get();

        $products_slider = Product::where("state", 2)
            ->whereIn("categorie_first_id", $categories_randoms
                ->pluck("id"))
            ->inRandomOrder()->get();

        $sliders_tertiaries = Slider::where("state", 1)
            ->where("type_slider", 3)
            ->orderBy("id", "asc")->get();

        $discount_products_column = Product::where("state", 2)
            ->inRandomOrder()->limit(3)->get();
        $featured_products_column = Product::where("state", 2)
            ->inRandomOrder()->limit(3)->get();
        $selling_products_column = Product::where("state", 2)
            ->inRandomOrder()->limit(3)->get();

        date_default_timezone_set("Europe/Madrid");
        $discounts_flash = Discount::where("type_campaign", 2)
            ->where("state", 1)
            ->where("start_date", "<=", today())
            ->where("end_date", ">=", today())
            ->first();

        $discounts_flash_products = collect([]);

        if ($discounts_flash) {
            foreach ($discounts_flash->products as $key => $product_aux) {
                $discounts_flash_products->push(ProductEcommerceResource::make($product_aux->product));
            }

            foreach ($discounts_flash->categories as $key => $categorie_aux) {
                $products_of_categories = Product::where("state", 2)
                    ::where("categorie_first_id", $categorie_aux->categorie_id)->get();

                foreach ($products_of_categories as $key => $product) {
                    $discounts_flash_products->push(ProductEcommerceResource::make($product));
                }

            }

            foreach ($discounts_flash->brands as $key => $brand_aux) {
                $products_of_brands = Product::where("state", 2)
                    ::where("brand_id", $brand_aux->brand_id)->get();

                foreach ($products_of_brands as $key => $product) {
                    $discounts_flash_products->push(ProductEcommerceResource::make($product));
                }
            }
            // format Sep 30 2014 20:20:23
            $discounts_flash->end_date_format = Carbon::parse($discounts_flash->end_date)
                ->addDays(1)
                ->format("Y-m-d\TH:i:s");
        }


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
            "sliders_secondaries" => $sliders_secondaries->map(function ($slider) {
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
            "products_electronics_gadgets" => ProductEcommerceCollection::make($products_electronics_gadgets),
            "products_slider" => ProductEcommerceCollection::make($products_slider),
            "sliders_tertiaries" => $sliders_tertiaries->map(function ($slider) {
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
            "discount_products_column" => ProductEcommerceCollection::make($discount_products_column),
            "featured_products_column" => ProductEcommerceCollection::make($featured_products_column),
            "selling_products_column" => ProductEcommerceCollection::make($selling_products_column),
            "discounts_flash" => $discounts_flash,
            "discounts_flash_products" => $discounts_flash_products

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

    public function show_product(Request $request, $slug)
    {
        $campaign_discount = $request->get("campaign_discount");

        $discount = null;
        if ($campaign_discount) {
            $discount = Discount::where("code", $campaign_discount)->first();
        }

        $product = Product::where("slug", $slug)
            ->where("state", 2)
            ->first();

        if (!$product) {
            return response()
                ->json(["message" => "El producto no existe"], 404);
        }

        $products_related = Product::where("categorie_first_id", $product->categorie_first_id)
            ->where("state", 2)
            ->get();

        $reviews = Review::where("product_id", $product->id)->get();

        return response()
            ->json([
                "product" => ProductEcommerceResource::make($product),
                "products_related" => ProductEcommerceCollection::make($products_related),
                "discount_campaign" => $discount,
                "reviews" => $reviews->map(function ($review) {
                    return [
                        "id" => $review->id,
                        "user" => [
                            "fullname" => $review->user->name . " " . $review->user->surname,
                            'avatar' => $review->user->avatar ? env('APP_URL') . 'storage/' . $review->avatar : 'https://cdn-icons-png.flaticon.com/512/5567/5567235.png',
                        ],
                        "message" => $review->message,
                        "rating" => $review->rating,
                        "created_at" => $review->created_at->format("Y-m-d h:i A")
                    ];
                })
            ], 200);
    }
}
