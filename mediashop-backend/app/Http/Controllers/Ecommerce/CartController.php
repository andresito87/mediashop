<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Http\Resources\Ecommerce\Cart\CartEcommerceCollection;
use App\Http\Resources\Ecommerce\Cart\CartEcommerceResource;
use App\Models\Coupon\Coupon;
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
     * Apply a coupon to the cart.
     */
    public function apply_coupon(Request $request)
    {
        $coupon = Coupon::where("code", $request->code_coupon)->where("state", 1)->first();

        if (!$coupon) {
            return response()->json(["message" => "El cupón ingresado no existe"], 403);
        }

        $user = auth("api")->user();
        $carts = Cart::where("user_id", $user->id)->get();

        foreach ($carts as $key => $cart) {
            if ($coupon->type_coupon == 1) { // Product coupon
                $exist_product_coupon = false;
                foreach ($coupon->products as $coupon_product) {
                    if ($coupon_product->product_id == $cart->product_id) {
                        $exist_product_coupon = true;
                        break;
                    }
                }
                if ($exist_product_coupon) {
                    $subtotal = 0;
                    if ($coupon->type_discount == 1) { // %
                        $subtotal = $cart->price_unit - $cart->price_unit * ($coupon->discount * 0.01);
                    }

                    if ($coupon->type_discount == 2) { // fixed amount
                        $subtotal = $cart->price_unit - $coupon->discount;
                    }

                    $cart->update([
                        "type_discount" => $coupon->type_discount,
                        "discount" => $coupon->discount,
                        "code_coupon" => $coupon->code,
                        "subtotal" => $subtotal,
                        "total" => $subtotal * $cart->quantity,
                        "type_campaign" => NULL,
                        "code_discount" => NULL
                    ]);
                }
            }

            if ($coupon->type_coupon == 2) { // Categorie coupon
                $exist_categorie_coupon = false;
                foreach ($coupon->categories as $coupon_product) {
                    if ($coupon_product->categorie_id == $cart->product->categorie_first_id) {
                        $exist_categorie_coupon = true;
                        break;
                    }
                }
                if ($exist_categorie_coupon) {
                    $subtotal = 0;
                    if ($coupon->type_discount == 1) { // %
                        $subtotal = $cart->price_unit - $cart->price_unit * ($coupon->discount * 0.01);
                    }

                    if ($coupon->type_discount == 2) { // fixed amount
                        $subtotal = $cart->price_unit - $coupon->discount;
                    }

                    $cart->update([
                        "type_discount" => $coupon->type_discount,
                        "discount" => $coupon->discount,
                        "code_coupon" => $coupon->code,
                        "subtotal" => $subtotal,
                        "total" => $subtotal * $cart->quantity,
                        "type_campaign" => NULL,
                        "code_discount" => NULL
                    ]);
                }
            }

            if ($coupon->type_coupon == 3) { // Brand coupon
                $exist_brand_coupon = false;
                foreach ($coupon->brands as $coupon_product) {
                    if ($coupon_product->brand_id == $cart->product->brand_id) {
                        $exist_brand_coupon = true;
                        break;
                    }
                }
                if ($exist_brand_coupon) {
                    $subtotal = 0;
                    if ($coupon->type_discount == 1) { // %
                        $subtotal = $cart->price_unit - $cart->price_unit * ($coupon->discount * 0.01);
                    }

                    if ($coupon->type_discount == 2) { // fixed amount
                        $subtotal = $cart->price_unit - $coupon->discount;
                    }

                    $cart->update([
                        "type_discount" => $coupon->type_discount,
                        "discount" => $coupon->discount,
                        "code_coupon" => $coupon->code,
                        "subtotal" => $subtotal,
                        "total" => $subtotal * $cart->quantity,
                        "type_campaign" => NULL,
                        "code_discount" => NULL
                    ]);
                }
            }
        }

        return response()->json(['message' => 'Cupón aplicado correctamente'], 200);
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
     * Remove all cart items.
     */
    public function delete_all()
    {
        $user = auth("api")->user();
        $carts = Cart::where("user_id", $user->id)->get();
        foreach ($carts as $key => $cart) {
            $cart->delete();
        }

        return response()->json([
            "message" => "Carrito de compra limpiado correctamente"
        ], 200);
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
