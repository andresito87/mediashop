<?php

namespace App\Http\Controllers\Admin\Coupon;

use App\Http\Controllers\Controller;
use App\Http\Resources\Coupon\CouponCollection;
use App\Http\Resources\Coupon\CouponResource;
use App\Models\Coupon\Coupon;
use App\Models\Coupon\CouponBrand;
use App\Models\Coupon\CouponCategorie;
use App\Models\Coupon\CouponProduct;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $coupons = Coupon::where("code", "like", "%" . $request->search . "%")
            ->orderBy("id", "desc")->paginate(25);

        return response()->json([
            "total" => $coupons->total(),
            "coupons" => CouponCollection::make($coupons)
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $request contains (product_selected, categorie_selected, brand_selected)
        $exists = Coupon::where("code", $request->code)->first();

        if ($exists) {
            return response()->json(["message" => "El cupón ya existe"], 409);
        }

        $coupon = Coupon::create([$request->all()]);

        foreach ($request->product_selected as $key => $product_selec) {
            CouponProduct::create([
                "coupon_id" => $coupon->id,
                "product_id" => $product_selec["id"],
            ]);
        }

        foreach ($request->categorie_selected as $key => $categorie_selec) {
            CouponCategorie::create([
                "coupon_id" => $coupon->id,
                "categorie_id" => $categorie_selec["id"],
            ]);
        }

        foreach ($request->brand_selected as $key => $brand_selec) {
            CouponBrand::create([
                "coupon_id" => $coupon->id,
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
        $coupon = Coupon::findOrFail($id);

        return response()->json(["coupon" => CouponResource::make($coupon)], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // $request contains (product_selected, categorie_selected, brand_selected)
        $exists = Coupon::where("code", $request->code)
            ->where("id", "<>", $id)
            ->first();

        if ($exists) {
            return response()->json(["message" => "El cupón ya existe"], 409);
        }

        $coupon = Coupon::findOrFail($id);
        $coupon->update($request->all());

        // delete and recreate strategy
        // delete all coupons and its relations, and then create them again is more efficient than validate them
        foreach ($coupon->products as $key => $product) {
            $product->delete();
        }

        foreach ($coupon->categories as $key => $categorie) {
            $categorie->delete();
        }

        foreach ($coupon->brands as $key => $brand) {
            $brand->delete();
        }

        foreach ($request->product_selected as $key => $product_selec) {
            CouponProduct::create([
                "coupon_id" => $coupon->id,
                "product_id" => $product_selec["id"],
            ]);
        }

        foreach ($request->categorie_selected as $key => $categorie_selec) {
            CouponCategorie::create([
                "coupon_id" => $coupon->id,
                "categorie_id" => $categorie_selec["id"],
            ]);
        }

        foreach ($request->brand_selected as $key => $brand_selec) {
            CouponBrand::create([
                "coupon_id" => $coupon->id,
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
        $coupon = Coupon::findOrFail($id);

        // Validate if the coupon has been used in a purchase; it should not be allowed to be deleted.

        $coupon->delete();

        return response()->json([], 200);
    }
}
