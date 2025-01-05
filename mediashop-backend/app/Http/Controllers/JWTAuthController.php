<?php

namespace App\Http\Controllers;

use App\Mail\ForgotPasswordMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
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
            'type_user' => $request->get('type_user') ? $request->get('type_user') : 2,
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

    public function forgot_password(Request $request)
    {
        $user = User::where('email', $request->get('email'))->first();

        if ($user == null) {
            return response()->json(['error' => 'User not found'], 404);
        }

        try {
            $user->update(['code_verified' => uniqid()]);
            Mail::to($request->get('email'))->send(new ForgotPasswordMail($user));
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al enviar el correo: ' . $e->getMessage()
            ], 500);
        }

        return response()->json(['message' => 'Email sent'], 200);
    }

    public function update(Request $request)
    {
        // Change password
        if ($request->password) {
            $user = User::find(auth("api")->user()->id);
            $user->update([
                "password" => bcrypt($request->password)
            ]);
            return response()->json([
                "message" => "Contraseña editada correctamente"
            ], 200);
        }

        //Edit user: validate if email exists in DB
        $exist_email = User::where("id", "<>", auth("api")->user()->id)
            ->where("email", $request->email)->first();

        if ($exist_email) {
            return response()->json([
                "message" => "El email ya existe"
            ], 409);
        }

        $user = User::find(auth("api")->user()->id);
        if ($request->hasFile("file_image")) {
            if ($user->avatar) {
                Storage::delete($user->avatar);
            }
            $path = Storage::putFile("users", $request->file("file_image"));
            $request->request->add(["avatar" => $path]);
        }
        $user->update($request->all());
        return response()->json([
            "message" => "Usuario editado correctamente"
        ], 200);
    }

    public function update_password_admin(Request $request)
    {
        $user = User::where("email", $request->email)->first();
        $user->update([
            "password" => bcrypt($request->password)
        ]);
        return response()->json([
            "message" => "Contraseña editada correctamente"
        ], 200);
    }

    /* Process to change password*/
    public function verified_email(Request $request)
    {
        $user = User::where('email', $request->get('email'))->first();

        if ($user == null) {
            return response()->json(['error' => 'User not found'], 404);
        }

        try {
            $user->update(['code_verified' => uniqid()]);
            Mail::to($request->get('email'))->send(new ForgotPasswordMail($user));
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al enviar el correo: ' . $e->getMessage()
            ], 500);
        }

        return response()->json(['message' => 'Email sent'], 200);
    }

    public function verified_code(Request $request)
    {
        $user = User::where('code_verified', $request->get('code'))->first();

        if ($user == null) {
            return response()->json(['error' => 'Code not found'], 404);
        }

        return response()->json(['message' => 'Code verified'], 200);
    }

    public function verified_password(Request $request)
    {
        $user = User::where('code_verified', $request->get('code'))->first();

        $user->password = Hash::make($request->get('new_password'));
        $user->code_verified = null;
        $user->save();

        return response()->json(['message' => 'Password changed'], 200);
    }
    /* End Process to change password*/

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

            if (Auth::user()->email_verified_at == null) {
                return response()->json(['error' => 'Email not verified'], 401);
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
    public function get_user()
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

    public function me()
    {

        $user = User::find(auth('api')->user()->id);

        return response()->json([
            'name' => $user->name,
            'surname' => $user->surname,
            'phone' => $user->phone,
            'email' => $user->email,
            'biography' => $user->biography,
            'fbLink' => $user->fbLink,
            'gender' => $user->gender,
            'address_city' => $user->address_city,
            'avatar' => $user->avatar ? env('APP_URL') . 'storage/' . $user->avatar : 'https://cdn-icons-png.flaticon.com/512/5567/5567235.png',
        ]);
    }

    // User logout
    public function logout()
    {
        try {
            // Invalidar el token
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json(['message' => 'Deslogueo exitoso'], 200);
        } catch (JWTException $e) {
            return response()->json(['error' => 'No se pudo desloguear, intente nuevamente'], 500);
        }
    }

    public function refresh()
    {
        return $this->respondWithToken(JWTAuth::refresh());
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
