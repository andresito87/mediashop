<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Sale\UserAddres;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserAddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth('api')->user();
        $addresses = UserAddres::where("user_id", $user->id)
            ->orderBy("id", "desc")->get();

        return response()->json([
            "addresses" => $addresses
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string|min:3|max:255",
            "surname" => "required|string|min:3|max:255",
            "street_address" => "required|string|min:3|max:255",
        ], [
            "name.required" => "El campo 'name' es obligatorio.",
            "name.string" => "El campo 'name' debe ser una cadena de texto.",
            "name.min" => "El nombre debe tener al menos 3 caracteres.",
            "name.max" => "El nombre no puede tener más de 255 caracteres.",
            "surname.required" => "El campo 'surname' es obligatorio.",
            "surname.string" => "El campo 'surname' debe ser una cadena de texto.",
            "surname.min" => "El apellido debe tener al menos 3 caracteres.",
            "surname.max" => "El apellido no puede tener más de 255 caracteres.",
            "street_address.required" => "El campo 'street_address' es obligatorio.",
            "street_address.string" => "El campo 'street_address' debe ser una cadena de texto.",
            "street_address.min" => "La dirección debe tener al menos 3 caracteres.",
            "street_address.max" => "La dirección no puede tener más de 255 caracteres."
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Hay errores en los datos enviados',
                'errors' => $validator->errors()
            ], 422);
        }

        $request->request->add([
            "user_id" => auth("api")->user()->id
        ]);

        $exist = UserAddres::where("user_id", auth("api")->user()->id)
            ->where("name", $request->name)
            ->where("surname", $request->surname)
            ->where("street_address", $request->street_address)
            ->first();

        if ($exist) {
            return response()->json([
                "message" => "La dirección ya existe"
            ], 409);
        }

        $address = UserAddres::create($request->all());

        return response()->json([
            "address" => $address
        ]);
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
            "name" => "required|string|min:3|max:255",
            "surname" => "required|string|min:3|max:255",
            "street_address" => "required|string|min:3|max:255",
        ], [
            "name.required" => "El campo 'name' es obligatorio.",
            "name.string" => "El campo 'name' debe ser una cadena de texto.",
            "name.min" => "El nombre debe tener al menos 3 caracteres.",
            "name.max" => "El nombre no puede tener más de 255 caracteres.",
            "surname.required" => "El campo 'surname' es obligatorio.",
            "surname.string" => "El campo 'surname' debe ser una cadena de texto.",
            "surname.min" => "El apellido debe tener al menos 3 caracteres.",
            "surname.max" => "El apellido no puede tener más de 255 caracteres.",
            "street_address.required" => "El campo 'street_address' es obligatorio.",
            "street_address.string" => "El campo 'street_address' debe ser una cadena de texto.",
            "street_address.min" => "La dirección debe tener al menos 3 caracteres.",
            "street_address.max" => "La dirección no puede tener más de 255 caracteres."
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Hay errores en los datos enviados',
                'errors' => $validator->errors()
            ], 422);
        }

        $address = UserAddres::find($id);

        if (!$address) {
            return response()->json([
                "message" => "Dirección no encontrada"
            ], 404);
        }

        $address->update($request->all());

        return response()->json([
            "message" => "Dirección actualizada correctamente",
            "address" => $address
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $address = UserAddres::findOrFail($id);
        $address->delete();

        return response()->json([
            "message" => "Dirección eliminada correctamente"
        ], 200);
    }
}
