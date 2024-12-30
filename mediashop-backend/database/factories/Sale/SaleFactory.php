<?php

namespace Database\Factories\Sale;

use App\Models\User;
use App\Models\Sale\Sale;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale\Sale>
 */
class SaleFactory extends Factory
{
    protected $model = Sale::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $method_payment = $this->faker->randomElement(["PAYPAL", "STRIPE"]);
        //$date_sales = $this->faker->dateTimeBetween("2023-01-01 00:00:00", "2023-12-31 23:59:59");
        $date_sales = $this->faker->dateTimeBetween("2024-01-01 00:00:00", "2024-12-31 23:59:59");


        $currency_payment = $this->faker->randomElement(["USD", "EUR"]);
        return [
            "user_id" => User::where("type_user", 2)->inRandomOrder()->first()->id,
            "method_payment" => $method_payment,
            "currency_total" => $currency_payment == "USD" ? $this->faker->randomElement(["USD", "EUR"]) : 'EUR',
            "currency_payment" => $currency_payment,
            "discount" => rand(1, 10),
            "subtotal" => rand(1, 1000),
            "total" => rand(1, 1000),
            "price_dolar" => rand(1, 1000),
            "description" => $this->faker->text($maxNbChars = 300),
            "code_transaction" => Str::random(6),
            "preference_id" => $method_payment == "STRIPE" ? Str::random(5) : NULL,
            //
            "created_at" => $date_sales,
            "updated_at" => $date_sales,
        ];
    }
}
