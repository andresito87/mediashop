<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product\Brand;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product\Brand>
 */
class BrandFactory extends Factory
{
    protected $model = Brand::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company,
            'image' => $this->faker->imageUrl(),
            "state" => $this->faker->randomElement([1, 2]), // 1: inactive, 2: active
        ];
    }
}
