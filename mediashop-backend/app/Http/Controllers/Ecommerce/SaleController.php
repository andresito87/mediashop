<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Http\Resources\Ecommerce\Sale\SaleCollection;
use App\Http\Resources\Ecommerce\Sale\SaleResource;
use App\Mail\SaleMail;
use App\Models\Product\Product;
use App\Models\Product\ProductVariation;
use App\Models\Sale\Cart;
use App\Models\Sale\Sale;
use App\Models\Sale\SaleAddres;
use App\Models\Sale\SaleDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function orders()
    {
        $user = auth("api")->user();

        $sales = Sale::where("user_id", $user->id)
            ->orderBy("id", "desc")
            ->get();

        return response()->json([
            "sales" => SaleCollection::make($sales)
        ]);
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
            $original_cart = $cart;
            $new_detail = [];
            $new_detail = $original_cart->toArray();
            $new_detail["sale_id"] = $sale->id;
            SaleDetail::create($new_detail);

            // decrease the total product stock by the quantity
            if ($cart->product_variation_id) {
                $variation = ProductVariation::find($cart->product_variation_id);
                if ($variation->variation_parent) {
                    $variation->variation_parent->update([
                        "stock" => $variation->variation_parent->stock - $cart->quantity
                    ]);
                    $variation->update([
                        "stock" => $variation->stock - $cart->quantity
                    ]);
                } else {
                    $variation->update([
                        "stock" => $variation->stock - $cart->quantity
                    ]);
                }
            } else {
                $product = Product::find($cart->product_id);
                $product->update([
                    "stock" => $product->stock - $cart->quantity
                ]);
            }

            // clean shopping cart
            $cart->delete();
        }

        $sale_addres = $request->sale_address;
        $sale_addres["sale_id"] = $sale->id;
        $sale_address = SaleAddres::create($sale_addres);

        // send mail to the customer with sale details
        $sale_new = Sale::findOrFail($sale->id);
        Mail::to(auth("api")->user()->email)
            ->send(new SaleMail(auth("api")->user(), $sale_new));

        return response()->json([
            "message" => "Venta creada correctamente",
            "sale" => SaleResource::make($sale),
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|exists:sales,code_transaction'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Hay errores en los datos enviados',
                'errors' => $validator->errors()
            ], 422);
        }

        $sale = Sale::where("code_transaction", $id)->first();

        return response()->json([
            "sale" => SaleResource::make($sale),
        ], 200);
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

        $validator = Validator::make(['id' => $id], [
            'id' => 'required|numeric|exists:sales,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Hay errores en los datos enviados',
                'errors' => $validator->errors()
            ], 422);
        }

        $sale = Sale::where("id", $id)->first();

        $sale->delete();

        return response()->json([
            "message" => "Venta eliminada correctamente",
        ], 200);

    }
}
