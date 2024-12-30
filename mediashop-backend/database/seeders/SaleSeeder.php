<?php

namespace Database\Seeders;

use App\Models\Coupon\Coupon;
use App\Models\Sale\Sale;
use Illuminate\Support\Str;
use App\Models\Product\Product;
use App\Models\Sale\SaleAddres;
use App\Models\Sale\SaleDetail;
use Illuminate\Database\Seeder;
use App\Models\Discount\Discount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Sale::factory()->count(500)->create()->each(function ($p) {
            $faker = \Faker\Factory::create();

            SaleAddres::create([
                "sale_id" => $p->id,
                "name" => $faker->name(),
                "surname" => $faker->lastName(),
                "company" => $faker->company(),
                "country_region" => $faker->country(),
                "street_address" => $faker->address(),
                "city" => $faker->city(),
                "postcode_zip" => $faker->numberBetween(10000, 99999),
                "phone" => $faker->phoneNumber(),
                "email" => $faker->unique()->safeEmail(),
            ]);

            $num_items = $faker->randomElement([1, 2, 3, 4, 5]);

            $sum_total_sale = 0;
            for ($i = 0; $i < $num_items; $i++) {
                $quantity = $faker->randomElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
                $product = Product::inRandomOrder()->first();
                $is_coupon_discount = $faker->randomElement([1, 2, 3]);
                $discount_coupon = $this->getDiscountCoupon($is_coupon_discount);
                $sale_detail = SaleDetail::create([
                    "sale_id" => $p->id,
                    "product_id" => $product->id,
                    "type_discount" => $discount_coupon ? $discount_coupon->type_discount : NULL,
                    "discount" => $discount_coupon ? $discount_coupon->discount : NULL,
                    "type_campaign" => $is_coupon_discount == 2 ? $discount_coupon->type_campaign : NULL,
                    "code_coupon" => $is_coupon_discount == 1 ? $discount_coupon->code : NULL,
                    "code_discount" => $is_coupon_discount == 2 ? $discount_coupon->code : NULL,
                    "product_variation_id" => NULL,
                    "quantity" => $quantity,
                    "price_unit" => $p->currency_total == 'EUR' ? $product->price_eur : $product->price_usd,
                    "subtotal" => $this->getTotalProduct($discount_coupon, $product, $p->currency_total),
                    "total" => $this->getTotalProduct($discount_coupon, $product, $p->currency_total) * $quantity,
                    "currency" => $p->currency_total,
                    "created_at" => $p->created_at,
                    "updated_at" => $p->updated_at,
                ]);
                $sum_total_sale += $sale_detail->total;
            }

            $sale = Sale::findOrFail($p->id);

            if ($p->currency_total != $p->currency_payment) {
                $sum_total_sale = round(($sum_total_sale * 1.04), 2);
                $sale->update([
                    "subtotal" => $sum_total_sale,
                    "total" => $sum_total_sale,
                ]);
            } else {
                $sale->update([
                    "subtotal" => $sum_total_sale,
                    "total" => $sum_total_sale,
                ]);
            }

        });
        // php artisan db:seed --class=SaleSeeder
    }

    public function getDiscountCoupon($is_coupon_discount)
    {
        if ($is_coupon_discount != 3) {
            if ($is_coupon_discount == 1) {
                $cupone = Coupon::inRandomOrder()->first();
                return $cupone;
            } else {
                $discount = Discount::inRandomOrder()->first();
                return $discount;
            }
        }
        return null;
    }

    public function getTotalProduct($discount_coupon, $product, $currency)
    {
        if ($discount_coupon) {
            if ($currency == "EUR") {
                $price = $product->price_eur;
            } else {
                $price = $product->price_usd;
            }
            if ($discount_coupon->type_discount == 1) {
                $price = $price - $discount_coupon->discount * 0.01 * $price;
            } else {
                $price = $price - $discount_coupon->discount;
            }
            return $price;
        }
        if ($currency == "EUR") {
            return $product->price_eur;
        } else {
            return $product->price_usd;
        }
    }
}
