<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SliderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        $sliders = Slider::where("title", "like", "%$search%")->orderBy("id", "desc")->paginate(25);

        return response()->json([
            "total" => $sliders->total(),
            "sliders" => $sliders->map(function ($slider) {
                return [
                    "id" => $slider->id,
                    "title" => $slider->title,
                    "subtitle" => $slider->subtitle,
                    "label" => $slider->label,
                    "link" => $slider->link,
                    "state" => $slider->state,
                    "type_slider" => $slider->type_slider,
                    "price_original" => $slider->price_original,
                    "price_campaign" => $slider->price_campaign,
                    "color" => $slider->color,
                    "image" => env("APP_URL") . "storage/" . $slider->image,
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Not necesary existing validation, sliders can be repeated
        if ($request->hasfile("imagen")) {
            $path = Storage::putFile("slider", $request->file("imagen"));
            $request->merge(['image' => $path]);
        }

        $slider = Slider::create($request->all());
        return response()->json(["message" => 200, "message_text" => "Slider creado", "id" => $slider->id]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $slider = Slider::find($id);

        if (!$slider) {
            return response()->json(["message" => 404, "message_text" => "Slider no encontrado"]);
        }

        return response()->json([
            "slider" => [
                "id" => $slider->id,
                "title" => $slider->title,
                "subtitle" => $slider->subtitle,
                "label" => $slider->label,
                "link" => $slider->link,
                "state" => $slider->state,
                "type_slider" => $slider->type_slider,
                "price_original" => $slider->price_original,
                "price_campaign" => $slider->price_campaign,
                "color" => $slider->color,
                "image" => env("APP_URL") . "storage/" . $slider->image,
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $slider = Slider::find($id);

        if (!$slider) {
            return response()->json(["message" => 404, "message_text" => "Slider no encontrado"], 404);
        }

        if ($request->hasfile("imagen")) {
            if ($slider->image) {
                Storage::delete($slider->image);
            }
            $path = Storage::putFile("sliders", $request->file("imagen"));
            $request->request->add(["image" => $path]);
        }

        $slider->update($request->all());
        return response()->json(["message" => 200, "message_text" => "Slider actualizado"], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $slider = Slider::find($id);

        if (!$slider) {
            return response()->json(["message" => 404, "message_text" => "Slider no encontrado"]);
        }

        $slider->delete();
        return response()->json(["message" => 200, "message_text" => "Slider eliminado"]);
    }
}
