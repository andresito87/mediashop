<?php

use App\Http\Controllers\JWTAuthController;
use App\Http\Middleware\JwtMiddleware;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [JWTAuthController::class, 'register']);
    Route::post('login', [JWTAuthController::class, 'login']);
    Route::post('admin_login', [JWTAuthController::class, 'admin_login']);
    Route::post('logout', [JWTAuthController::class, 'logout']);
    Route::post('verified_auth', [JWTAuthController::class, 'verified_auth']);
});

Route::middleware([JwtMiddleware::class])->group(function () {
    Route::get('user', [JWTAuthController::class, 'getUser']);
});
