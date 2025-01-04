<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product\Categorie;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product\Categorie>
 */
class CategorieFactory extends Factory
{
    protected $model = Categorie::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'image' => $this->faker->imageUrl(),
            'icon' => $this->faker->word,
            'categorie_second_id' => null,
            'categorie_third_id' => null,
            "position" => $this->faker->randomNumber(),
            "type_categorie" => $this->faker->randomElement([1, 2, 3]), // 1: deparment, 2: category, 3: subcategory
            "state" => $this->faker->randomElement([1, 2]), // 1: inactive, 2: active
        ];
    }
}
