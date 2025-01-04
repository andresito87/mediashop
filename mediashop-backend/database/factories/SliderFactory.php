<?php

namespace Database\Factories;

use App\Models\Slider;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Slider>
 */
class SliderFactory extends Factory
{
    protected $model = Slider::class;

    public function definition()
    {
        return [
            'title' => $this->faker->word,
            'subtitle' => $this->faker->sentence,
            'label' => $this->faker->word,
            'image' => $this->faker->imageUrl(),
            'link' => $this->faker->url,
            'state' => $this->faker->randomElement([1, 2]), // 1: active, 2: inactive
            'color' => $this->faker->hexColor,
            'type_slider' => $this->faker->randomElement([1, 2, 3]),
            'price_original' => $this->faker->randomFloat(2, 50, 100),
            'price_campaign' => $this->faker->randomFloat(2, 30, 80),
        ];
    }
}
