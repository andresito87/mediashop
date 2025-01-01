<?php

use App\Http\Controllers\Admin\Coupon\CouponController;
use App\Http\Controllers\Admin\Discount\DiscountController;
use App\Http\Controllers\Admin\Product\AttributeProductController;
use App\Http\Controllers\Admin\Product\BrandController;
use App\Http\Controllers\Admin\Product\CategorieController;
use App\Http\Controllers\Admin\Product\ProductController;
use App\Http\Controllers\Admin\Product\ProductNestedVariationsController;
use App\Http\Controllers\Admin\Product\ProductSpecificationsController;
use App\Http\Controllers\Admin\Product\ProductVariationsController;
use App\Http\Controllers\Admin\Product\PropertyAttributetController;
use App\Http\Controllers\Admin\Sale\SalesController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Ecommerce\CartController;
use App\Http\Controllers\Ecommerce\HomeController;
use App\Http\Controllers\Ecommerce\ReviewController;
use App\Http\Controllers\Ecommerce\SaleController;
use App\Http\Controllers\Ecommerce\UserAddressController;
use App\Http\Controllers\JWTAuthController;
use App\Http\Middleware\JwtMiddleware;
use Illuminate\Support\Facades\Route;

// ================================== REGISTER AND LOGIN ================================== //
Route::prefix('auth')->group(function () {
    Route::post('register', [JWTAuthController::class, 'register']);
    Route::post('login', [JWTAuthController::class, 'login']);
    Route::post('admin_login', [JWTAuthController::class, 'admin_login']);
    Route::post('logout', [JWTAuthController::class, 'logout']);
    Route::post('verified_auth', [JWTAuthController::class, 'verified_auth']);
    // Process to change password
    Route::post('verified_email', [JWTAuthController::class, 'verified_email']);
    Route::post('verified_code', [JWTAuthController::class, 'verified_code']);
    Route::post('verified_password', [JWTAuthController::class, 'verified_password']);
});
// =========================================================================================== //

// ====================================== USERS ====================================== //
Route::middleware([JwtMiddleware::class])->group(function () {
    Route::get('user', [JWTAuthController::class, 'getUser']);
});
// ==================================================================================== //

// ========================================== ADMIN ========================================== //
Route::middleware("auth:api")->prefix("admin")->group(function () {

    // ================================ CATEGORIES ================================ //
    Route::get('categories/config', [CategorieController::class, 'config']);
    Route::resource('categories', CategorieController::class);
    Route::post('categories/{id}', [CategorieController::class, "update"]);
    // ============================================================================ //

    // ================================ ATTRIBUTES ================================ //
    Route::resource('attributes', AttributeProductController::class);
    // ============================================================================ //

    // ================================ PROPERTIES ================================ //
    Route::post('properties', [PropertyAttributetController::class, "store"]);
    Route::delete('properties/{id}', [PropertyAttributetController::class, "destroy"]);
    // ========================================================================= //

    // ================================= SLIDERS ================================= //
    Route::resource('sliders', SliderController::class);
    /*It's necesary a method-post endpoint to send images, method-put doesn't allow it*/
    Route::post('sliders/{id}', [SliderController::class, "update"]);
    // ============================================================================ //

    // ================================ BRANDS ================================ //
    Route::resource('brands', BrandController::class);
    // ========================================================================= //

    // ================================ PRODUCTS ================================ //
    Route::get('products/config', [ProductController::class, 'config']);
    Route::post('products/images', [ProductController::class, "images"]);
    Route::delete('products/images/{id}', [ProductController::class, "delete_image"]);
    Route::post('products/index', [ProductController::class, "index"]);
    Route::resource('products', ProductController::class);
    Route::post('products/{id}', [ProductController::class, "update"]);
    // ============================================================================ //

    // =========================== PRODUCTS-VARIATIONS =========================== //
    Route::get('variations/config', [ProductVariationsController::class, 'config']);
    Route::resource('variations', ProductVariationsController::class);
    Route::resource('nested_variations', ProductNestedVariationsController::class);
    // =========================================================================== //

    // ========================= PRODUCTS-SPECIFICATIONS ========================= //
    Route::resource('specifications', ProductSpecificationsController::class);
    // =========================================================================== //

    // ================================= COUPONS ================================= //
    Route::get('coupons/config', [CouponController::class, 'config']);
    Route::resource('coupons', CouponController::class);
    // ============================================================================ //

    // ================================ DISCOUNTS ================================ //
    Route::resource('discounts', DiscountController::class);
    // =========================================================================== //

    // ================================== SALES ================================ //
    Route::post("sales/list", [SalesController::class, "list"]);
    // ========================================================================= //
});
// =============================================================================================== //

// ========================== REPORTING EXCEL FILES ============================== //
Route::get("sales/list-excel", [SalesController::class, "list_excel"]);
// ================================================================================ //

// ========================================== ECOMMERCE ========================================== //
Route::prefix("ecommerce")
    ->group(function () {

        /******************************* UNAUTHENTICATED USERS *******************************/

        // ================================ HOME ================================ //
        Route::get("home", [HomeController::class, "home"]);
        // ====================================================================== //
    
        // =============================== MENUS =============================== //
        Route::get("menus", [HomeController::class, "menus"]);
        // ====================================================================== //
    
        // =============================== PRODUCT-DETAILS =============================== //
        Route::get("product/{slug}", [HomeController::class, "show_product"]);
        // ============================================================================== //
    
        /******************************************************************************************/


        /******************************* AUTHENTICATED USERS *******************************/

        Route::group([
            "middleware" => "auth:api", // endpoints protected against unathenticated users
        ], function ($router) {

            // ==================================== CARTS ==================================== //
            Route::delete("carts/delete_all", [CartController::class, "delete_all"]);
            Route::post("carts/apply_coupon", [CartController::class, "apply_coupon"]);
            Route::resource('carts', CartController::class);
            // ============================================================================== //
    
            // =============================== USER ADDRESS ================================= //
            Route::resource('user_address', UserAddressController::class);
            // ============================================================================= //
    
            // ========================= SALES & ORDERS ========================= //
            Route::get("sale/{id}", [SaleController::class, "show"]);
            // ================================================================== //
    
            // ===================== CHECKOUT & PAYMENT ======================= //
            Route::post("checkout", [SaleController::class, "store"]);
            // ================================================================ //
    
            // =============================== PROFILE ================================= //
            Route::get("profile_client/me", [JWTAuthController::class, "me"]);
            Route::get("profile_client/orders", [SaleController::class, "orders"]);
            Route::post("profile_client", [JWTAuthController::class, "update"]);
            // ========================================================================= //
    
            // =============================== REVIEWS ========================= //
            Route::resource('reviews', ReviewController::class);
            // ================================================================== //
    
        });

        /******************************************************************************************/
    });

// =============================================================================================== //
