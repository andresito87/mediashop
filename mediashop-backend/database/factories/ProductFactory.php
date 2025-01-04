<?php

namespace Database\Factories;

use App\Models\Product\Brand;
use App\Models\Product\Product;
use App\Models\Product\Categorie;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        return [
            'title' => $this->faker->word,
            'slug' => $this->faker->slug,
            'sku' => $this->faker->unique()->word,
            'price_eur' => $this->faker->randomFloat(2, 10, 500),
            'price_usd' => $this->faker->randomFloat(2, 10, 500),
            'resume' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'state' => $this->faker->randomElement([1, 2]), // 1: inactive, 2: active
            'image' => $this->faker->imageUrl(),
            'tags' => '[
                    {
                        "item_id": 1705930402576,
                        "item_text": "iphone 14"
                    },
                    {
                        "item_id": 1705930408848,
                        "item_text": "256gb"
                    },
                    {
                        "item_id": 1705930412984,
                        "item_text": "titinario negro"
                    },
                    {
                        "item_id": 1705930417201,
                        "item_text": "apple"
                    }
            ]',
            'stock' => $this->faker->randomNumber(),
            // Relación con Categorie
            'categorie_first_id' => 1, //Categorie::factory(),
            'categorie_second_id' => null,
            'categorie_third_id' => null,
            'brand_id' => 1 //Brand::factory(),
        ];
    }
}
