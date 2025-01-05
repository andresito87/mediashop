<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // try to authenticate the user using the token
            $user = JWTAuth::parseToken()->authenticate();
        } catch (JWTException $e) {
            // If an exception occurs, return an error response
            return response()->json(['error' => 'Token is invalid or not provided'], 401);
        }

        // If the user is authenticated, continue with the request
        return $next($request);
    }
}
