<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Sale\Cart;
use App\Models\Sale\Sale;
use App\Models\Sale\SaleAddres;
use App\Models\Sale\SaleDetail;
use Illuminate\Http\Request;

class SaleController extends Controller
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
        $request->request->add(["user_id" => auth("api")->user()->id]);
        $sale = Sale::create($request->all());

        $carts = Cart::where("user_id", auth("api")->user()->id)->get();

        foreach ($carts as $key => $cart) {
            $new_detail = [];
            $new_detail = $cart->toArray();
            $new_detail["sale_id"] = $sale->id;
            SaleDetail::create($new_detail);
            // clean shopping cart
        }

        $sale_addres = $request->sale_address;
        $sale_addres["sale_id"] = $sale->id;
        $sale_address = SaleAddres::create($sale_addres);

        // send mail to the customer with sale details
        return response()->json([
            "message" => "Venta creada correctamente"
        ], 200);
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
        //
    }
}
