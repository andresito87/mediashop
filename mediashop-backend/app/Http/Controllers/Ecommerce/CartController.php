<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Http\Resources\Ecommerce\Cart\CartEcommerceCollection;
use App\Http\Resources\Ecommerce\Cart\CartEcommerceResource;
use App\Models\Product\Product;
use App\Models\Product\ProductVariation;
use App\Models\Sale\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth('api')->user();

        $carts = Cart::where('user_id', $user->id)->get();

        return response()->json([
            "carts" => CartEcommerceCollection::make($carts)
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = auth('api')->user();

        // validate if there is a cart with the same VARIATION PRODUCT for the same user
        if ($request->product_variation_id) {
            $exists_cart_variation = Cart::where("product_variation_id", $request->product_variation_id)
                ->where('product_id', $request->product_id)
                ->where('user_id', $user->id)->first();

            if ($exists_cart_variation) {
                return response()->json([
                    "message" => "Esta variación del producto ya está en el carrito, puede aumentar la cantidad desde el carrito directamente."
                ], 403);
            } else {
                // validate if quantity of that PRODUCT VARIATION which is trying to add, it is available
                $variation = ProductVariation::find($request->product_variation_id);

                if ($variation && $variation->stock < $request->quantity) {
                    return response()->json([
                        "message" => "No se puede agregar esa cantidad de esa variación del producto por falta de stock."
                    ], 403);
                }
            }
        } else {
            // validate if there is a cart with the same PRODUCT for the same user
            $exists_cart_variation = Cart::where("product_variation_id", NULL)
                ->where('product_id', $request->product_id)
                ->where('user_id', $user->id)->first();

            if ($exists_cart_variation) {
                return response()->json([
                    "message" => "El producto ya está en el carrito, puede aumentar la cantidad desde el carrito directamente."
                ], 403);
            } else {
                // validate if quantity of that PRODUCT which is trying to add, it is available
                $product = Product::find($request->product_id);
                if ($product->stock < $request->quantity) {
                    return response()->json([
                        "message" => "No se puede agregar esa cantidad del producto por falta de stock."
                    ], 403);
                }
            }
        }

        $request->request->add(["user_id" => $user->id]);
        $cart = Cart::create($request->all());

        return response()->json(["cart" => CartEcommerceResource::make($cart)], 201);
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
        $user = auth('api')->user();

        // validate if there is a cart with the same VARIATION PRODUCT for the same user
        if ($request->product_variation_id) {
            $exists_cart_variation = Cart::where('product_variation_id', $request->product_variation_id)
                ->where('product_id', $request->product_id)
                ->where('id', '<>', $id) //cart_id not inclueded the cart which is updating
                ->where('user_id', $user->id)->first();

            if ($exists_cart_variation) {
                return response()->json([
                    "message" => "Esta variación del producto ya está en el carrito, puede aumentar la cantidad desde el carrito directamente."
                ], 403);
            } else {
                // validate if quantity of that PRODUCT VARIATION which is trying to add, it is available
                $variation = ProductVariation::find($request->product_variation_id);

                if ($variation && $variation->stock < $request->quantity) {
                    return response()->json([
                        "message" => "No se puede agregar esa cantidad de esa variación del producto por falta de stock."
                    ], 403);
                }
            }
        } else {
            // validate if there is a cart with the same PRODUCT for the same user
            $exists_cart_variation = Cart::where('product_variation_id', NULL)
                ->where('product_id', $request->product_id)
                ->where('id', '<>', $id) //cart_id not inclueded the cart which is updating
                ->where('user_id', $user->id)->first();

            if ($exists_cart_variation) {
                return response()->json([
                    "message" => "El producto ya está en el carrito, puede aumentar la cantidad desde el carrito directamente."
                ], 403);
            } else {
                // validate if quantity of that PRODUCT which is trying to add, it is available
                $product = Product::find($request->product_id);
                if ($product->stock < $request->quantity) {
                    return response()->json([
                        "message" => "No se puede agregar esa cantidad del producto por falta de stock."
                    ], 403);
                }
            }
        }

        $cart = Cart::findOrFail($id);
        $cart->update($request->all());

        return response()->json(["cart" => CartEcommerceResource::make($cart)], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $cart = Cart::findOrFail($id);
        $cart->delete();

        return response()->json([
            "message" => "Producto eliminado del carrito correctamente"
        ], 200);
    }
}
