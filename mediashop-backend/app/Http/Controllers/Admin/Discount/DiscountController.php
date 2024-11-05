<?php

namespace App\Http\Controllers\Admin\Discount;

use App\Http\Controllers\Controller;
use App\Http\Resources\Discount\DiscountCollection;
use App\Http\Resources\Discount\DiscountResource;
use App\Models\Discount\Discount;
use App\Models\Discount\DiscountBrand;
use App\Models\Discount\DiscountCategorie;
use App\Models\Discount\DiscountProduct;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $discounts = Discount::orderBy("id", "desc")->paginate();

        return response()->json([
            "total" => $discounts->total(),
            "discounts" => DiscountCollection::make($discounts)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate that products, categories, or brands aren't registered
        // in the same period of time for same discount type campaigns.
        // range between start_date and end_date
        // target_discount -> product / categorie / brand
        // type_discount -> % or fixed amount
        // product_selected / categorie_selected / brand_selected
        // type campaign -> normal / flash / link

        if ($request->target_discount == 1) { // Products

            foreach ($request->product_selected as $key => $product_selec) {

                // validate if date range campaign which trying create, is included in other campaign for products
                $EXIST_DISCOUNT_START_DATE = Discount::where("type_campaign", $request->type_campaign)
                    ->where("target_discount", $request->target_discount)
                    ->whereHas("prroducts", function ($query) use ($product_selec) {
                        $query->where("product_id", $product_selec["id"]);
                    })->whereBetween("start_date", [$request->start_date, $request->end_date])
                    ->first();
                $EXIST_DISCOUNT_END_DATE = Discount::where("type_campaign", $request->type_campaign)
                    ->where("target_discount", $request->target_discount)
                    ->whereHas("prroducts", function ($query) use ($product_selec) {
                        $query->where("product_id", $product_selec["id"]);
                    })->whereBetween("end_date", [$request->start_date, $request->end_date])
                    ->first();
                if ($EXIST_DISCOUNT_START_DATE || $EXIST_DISCOUNT_END_DATE) {
                    return response()->json(
                        [
                            "message" => "El producto ya tiene activa otra campaña de descuento de productos"
                        ],
                        409
                    );
                }
            }
        }

        if ($request->target_discount == 2) { // Categories

            foreach ($request->categorie_selected as $key => $categorie_selec) {

                // validate if date range campaign which trying create, is included in other campaign for categories
                $EXIST_DISCOUNT_START_DATE = Discount::where("type_campaign", $request->type_campaign)
                    ->where("target_discount", $request->target_discount)
                    ->whereHas("categories", function ($query) use ($categorie_selec) {
                        $query->where("categorie_id", $categorie_selec["id"]);
                    })->whereBetween("start_date", [$request->start_date, $request->end_date])
                    ->first();
                $EXIST_DISCOUNT_END_DATE = Discount::where("type_campaign", $request->type_campaign)
                    ->where("target_discount", $request->target_discount)
                    ->whereHas("categories", function ($query) use ($categorie_selec) {
                        $query->where("categorie_id", $categorie_selec["id"]);
                    })->whereBetween("end_date", [$request->start_date, $request->end_date])
                    ->first();
                if ($EXIST_DISCOUNT_START_DATE || $EXIST_DISCOUNT_END_DATE) {
                    return response()->json(
                        [
                            "message" => "La categoría ya tiene activa otra campaña de descuento de categorías"
                        ],
                        409
                    );
                }
            }
        }

        if ($request->target_discount == 3) { // Brands

            foreach ($request->brand_selected as $key => $brand_selec) {

                // validate if date range campaign which trying create, is included in other campaign for brands
                $EXIST_DISCOUNT_START_DATE = Discount::where("type_campaign", $request->type_campaign)
                    ->where("target_discount", $request->target_discount)
                    ->whereHas("brands", function ($query) use ($brand_selec) {
                        $query->where("brand_id", $brand_selec["id"]);
                    })->whereBetween("start_date", [$request->start_date, $request->end_date])
                    ->first();
                $EXIST_DISCOUNT_END_DATE = Discount::where("type_campaign", $request->type_campaign)
                    ->where("target_discount", $request->target_discount)
                    ->whereHas("brands", function ($query) use ($brand_selec) {
                        $query->where("brand_id", $brand_selec["id"]);
                    })->whereBetween("end_date", [$request->start_date, $request->end_date])
                    ->first();
                if ($EXIST_DISCOUNT_START_DATE || $EXIST_DISCOUNT_END_DATE) {
                    return response()->json(
                        [
                            "message" => "La marca ya tiene activa otra campaña de descuento de marcas"
                        ],
                        409
                    );
                }
            }
        }

        // save a auto generated code
        $request->request->add(["code" => uniqid()]);
        $discount = Discount::create($request->all());

        foreach ($request->product_selected as $key => $product_selec) {
            DiscountProduct::create([
                "discount_id" => $discount->id,
                "product_id" => $product_selec["id"],
            ]);
        }

        foreach ($request->categorie_selected as $key => $categorie_selec) {
            DiscountCategorie::create([
                "discount_id" => $discount->id,
                "categorie_id" => $categorie_selec["id"],
            ]);
        }

        foreach ($request->brand_selected as $key => $brand_selec) {
            DiscountBrand::create([
                "discount_id" => $discount->id,
                "brand_id" => $brand_selec["id"],
            ]);
        }

        return response()->json([], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $discount = Discount::findOrFail($id);

        return response()->json(
            [
                "discount" => DiscountResource::make($discount)
            ],
            200
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate that products, categories, or brands aren't registered
        // in the same period of time for same discount type campaigns.
        // range between start_date and end_date
        // target_discount -> product / categorie / brand
        // type_discount -> % or fixed amount
        // product_selected / categorie_selected / brand_selected
        // type campaign -> normal / flash / link

        if ($request->target_discount == 1) { // Products

            foreach ($request->product_selected as $key => $product_selec) {

                // validate if date range campaign which trying update, is included in other campaign for products
                $EXIST_DISCOUNT_START_DATE = Discount::where("type_campaign", $request->type_campaign)
                    ->where("id", "<>", $id)
                    ->where("target_discount", $request->target_discount)
                    ->whereHas("prroducts", function ($query) use ($product_selec) {
                        $query->where("product_id", $product_selec["id"]);
                    })->whereBetween("start_date", [$request->start_date, $request->end_date])
                    ->first();
                $EXIST_DISCOUNT_END_DATE = Discount::where("type_campaign", $request->type_campaign)
                    ->where("id", "<>", $id)
                    ->where("target_discount", $request->target_discount)
                    ->whereHas("prroducts", function ($query) use ($product_selec) {
                        $query->where("product_id", $product_selec["id"]);
                    })->whereBetween("end_date", [$request->start_date, $request->end_date])
                    ->first();
                if ($EXIST_DISCOUNT_START_DATE || $EXIST_DISCOUNT_END_DATE) {
                    return response()->json(
                        [
                            "message" => "El producto ya tiene activa otra campaña de descuento de productos"
                        ],
                        409
                    );
                }
            }
        }

        if ($request->target_discount == 2) { // Categories

            foreach ($request->categorie_selected as $key => $categorie_selec) {

                // validate if date range campaign which trying update, is included in other campaign for categories
                $EXIST_DISCOUNT_START_DATE = Discount::where("type_campaign", $request->type_campaign)
                    ->where("id", "<>", $id)
                    ->where("target_discount", $request->target_discount)
                    ->whereHas("categories", function ($query) use ($categorie_selec) {
                        $query->where("categorie_id", $categorie_selec["id"]);
                    })->whereBetween("start_date", [$request->start_date, $request->end_date])
                    ->first();
                $EXIST_DISCOUNT_END_DATE = Discount::where("type_campaign", $request->type_campaign)
                    ->where("id", "<>", $id)
                    ->where("target_discount", $request->target_discount)
                    ->whereHas("categories", function ($query) use ($categorie_selec) {
                        $query->where("categorie_id", $categorie_selec["id"]);
                    })->whereBetween("end_date", [$request->start_date, $request->end_date])
                    ->first();
                if ($EXIST_DISCOUNT_START_DATE || $EXIST_DISCOUNT_END_DATE) {
                    return response()->json(
                        [
                            "message" => "La categoría ya tiene activa otra campaña de descuento de categorías"
                        ],
                        409
                    );
                }
            }
        }

        if ($request->target_discount == 3) { // Brands

            foreach ($request->brand_selected as $key => $brand_selec) {

                // validate if date range campaign which trying update, is included in other campaign for brands
                $EXIST_DISCOUNT_START_DATE = Discount::where("type_campaign", $request->type_campaign)
                    ->where("id", "<>", $id)
                    ->where("target_discount", $request->target_discount)
                    ->whereHas("brands", function ($query) use ($brand_selec) {
                        $query->where("brand_id", $brand_selec["id"]);
                    })->whereBetween("start_date", [$request->start_date, $request->end_date])
                    ->first();
                $EXIST_DISCOUNT_END_DATE = Discount::where("type_campaign", $request->type_campaign)
                    ->where("id", "<>", $id)
                    ->where("target_discount", $request->target_discount)
                    ->whereHas("brands", function ($query) use ($brand_selec) {
                        $query->where("brand_id", $brand_selec["id"]);
                    })->whereBetween("end_date", [$request->start_date, $request->end_date])
                    ->first();
                if ($EXIST_DISCOUNT_START_DATE || $EXIST_DISCOUNT_END_DATE) {
                    return response()->json(
                        [
                            "message" => "La marca ya tiene activa otra campaña de descuento de marcas"
                        ],
                        409
                    );
                }
            }
        }

        $discount = Discount::findOrFail($id);
        $discount->update($request->all());

        // delete and recreate strategy
        // delete all discounts and its relations, and then create them again is more efficient than validate them
        foreach ($discount->products as $key => $product) {
            $product->delete();
        }

        foreach ($discount->categories as $key => $categorie) {
            $categorie->delete();
        }

        foreach ($discount->brands as $key => $brand) {
            $brand->delete();
        }

        foreach ($request->product_selected as $key => $product_selec) {
            DiscountProduct::create([
                "discount_id" => $discount->id,
                "product_id" => $product_selec["id"],
            ]);
        }

        foreach ($request->categorie_selected as $key => $categorie_selec) {
            DiscountCategorie::create([
                "discount_id" => $discount->id,
                "categorie_id" => $categorie_selec["id"],
            ]);
        }

        foreach ($request->brand_selected as $key => $brand_selec) {
            DiscountBrand::create([
                "discount_id" => $discount->id,
                "brand_id" => $brand_selec["id"],
            ]);
        }

        return response()->json([], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $discount = Discount::findOrFail($id);

        // validate if the discount is in use, dont allow delete it
        $discount->delete();

        return response()->json([], 200);
    }
}
