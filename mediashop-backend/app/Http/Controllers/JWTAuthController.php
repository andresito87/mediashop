<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Exception;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Mail\VerifiedMail;

class JWTAuthController extends Controller
{
    // User registration
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 400);  // Return a 400 response if validation fails
        }

        $user = User::create([
            'name' => $request->get('name'),
            'surname' => $request->get('surname'),
            'phone' => $request->get('phone'),
            'type_user' => 2,
            'email' => $request->get('email'),
            'unique_id' => uniqid(),
            'password' => Hash::make($request->get('password')),
        ]);

        try {
            Mail::to($request->get('email'))->send(new VerifiedMail($user));
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al enviar el correo: ' . $e->getMessage()
            ], 500);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    // User login
    public function login(Request $request)
    {
        // Get user credentials
        $credentials = $request->only('email', 'password');

        try {
            // Check if user exists and is a customer
            if (!($token = Auth::guard('api')->attempt($credentials)) || Auth::user()->type_user != 2) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            // Check if user has verified their email
            if (Auth::user()->email_verified_at == null) {
                return response()->json(['error' => 'Email not verified'], 401);
            }

            return $this->respondWithToken(Auth::guard('api')->attempt($credentials));
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }

    // Admin login
    public function admin_login(Request $request)
    {
        // Get user credentials
        $credentials = $request->only('email', 'password');

        try {
            // Check if user exists and is an admin
            if (!($token = Auth::guard('api')->attempt($credentials)) || Auth::user()->type_user != 1) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            return $this->respondWithToken(Auth::guard('api')->attempt($credentials));
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }

    // Verify user email
    public function verified_auth(Request $request)
    {
        $user = User::where('unique_id', $request->get('code'))->first();

        if ($user == null) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->email_verified_at = now();
        $user->save();

        return response()->json(['message' => 'Email verified'], 200);
    }

    // Get authenticated user
    public function getUser()
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Invalid token'], 400);
        }

        return response()->json(compact('user'));
    }

    // User logout
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => [
                'id' => Auth::user()->id,
                'full_name' => Auth::user()->name . ' ' . Auth::user()->surname,
                'email' => Auth::user()->email,
            ]
        ]);
    }
}
