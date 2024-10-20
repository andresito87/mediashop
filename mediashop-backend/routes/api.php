<?php

use App\Http\Controllers\Admin\Product\AttributeProductController;
use App\Http\Controllers\Admin\Product\CategorieController;
use App\Http\Controllers\Admin\Product\PropertyAttributetController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\JWTAuthController;
use App\Http\Middleware\JwtMiddleware;
use Illuminate\Support\Facades\Route;

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

Route::middleware([JwtMiddleware::class])->group(function () {
    Route::get('user', [JWTAuthController::class, 'getUser']);
});

Route::middleware("auth:api")->prefix("admin")->group(function () {

    // ============================= CATEGORIES ============================= //
    Route::get('categories/config', [CategorieController::class, 'config']);
    Route::resource('categories', CategorieController::class);
    Route::post('categories/{id}', [CategorieController::class, "update"]);
    // ====================================================================== //

    // ============================= ATTRIBUTES ============================= //
    Route::resource('attributes', AttributeProductController::class);
    // ====================================================================== //

    // ============================= PROPERTIES ============================= //
    Route::post('properties', [PropertyAttributetController::class, "store"]);
    Route::delete('properties/{id}', [PropertyAttributetController::class, "destroy"]);
    // ====================================================================== //

    // ============================== SLIDERS ============================== //
    Route::resource('sliders', SliderController::class);
    /*It's necesary a method-post endpoint to send images, method-put doesn't allow it*/
    Route::post('sliders/{id}', [SliderController::class, "update"]);
    // ====================================================================== //

});

