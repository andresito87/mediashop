<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Sale\UserAddres;
use Illuminate\Http\Request;

class UserAddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $addresses = UserAddres::orderBy("id", "desc")->get();

        return response()->json([
            "addresses" => $addresses
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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
        $address = UserAddres::findOrFail($id);
        $address->update($request->all());

        return response()->json([
            "address" => $address
        ]);
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
