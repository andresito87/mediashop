<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Sale\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($user_id = null)
    {
        // If no user_id is provided, get the reviews of the authenticated user
        if (!$user_id) {
            $user_id = auth("api")->user()->id;
        }

        if (!User::find($user_id)) {
            return response()->json([
                "message" => "Usuario no encontrado"
            ], 404);
        }

        $reviews = Review::where("user_id", $user_id)->get();

        if ($reviews->isEmpty()) {
            return response()->json([
                "message" => "No se encontraron reseñas"
            ], 200);
        }

        return response()->json([
            "reviews" => $reviews
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->request->add(["user_id" => auth("api")->user()->id]);

        $existing_review = Review::where("user_id", auth("api")->user()->id)
            ->where("product_id", $request->product_id)
            ->first();

        if ($existing_review) {
            return response()->json([
                "message" => "Ya has dejado una reseña para este producto"
            ], 409);
        }

        $review = Review::create($request->all());

        return response()->json([
            "review" => $review
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
        $validator = Validator::make($request->all(), [
            'message' => 'required|string',
            'rating' => 'required|integer|between:1,5'
        ], [
            'id.required' => 'El id de la reseña es obligatorio',
            'message.required' => 'El mensaje es obligatorio',
            'message.string' => 'El mensaje debe ser un texto',
            'rating.required' => 'La valoración es obligatoria',
            'rating.integer' => 'La valoración debe ser un número entero',
            'rating.between' => 'La valoración debe estar entre 1 y 5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Hay errores en los datos enviados',
                'errors' => $validator->errors()
            ], 422);
        }

        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'message' => 'Reseña no encontrada'
            ], 404);
        }

        $belongsToUser = Review::where('id', $id)
            ->where('user_id', auth('api')->user()->id)
            ->exists();

        if (!$belongsToUser) {
            return response()->json([
                'message' => 'No puedes actualizar esta reseña'
            ], 403);
        }

        // Allow only to update the message and rating
        $review->update([
            'message' => $validator->validated()['message'],
            'rating' => $validator->validated()['rating']
        ]);

        return response()->json([
            'review' => $review
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // user can't delete his reviews
    }
}
