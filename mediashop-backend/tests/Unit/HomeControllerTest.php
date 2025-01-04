<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\TestCase;
use App\Models\Product\Categorie;
use App\Models\Product\Product;
use App\Models\Slider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;

class HomeControllerTest extends TestCase
{
    #[Test]
    public function it_returns_home_data_successfully()
    {

        $response = $this->getJson('/api/ecommerce/home');


        $response->assertStatus(200);


        $response->assertJsonStructure([
            'sliders_principal',
            'categories_random',
            'products_trending_new',
            'products_trending_featured',
            'products_trending_top_sellers',
            'sliders_secondaries',
            'products_electronics_gadgets',
            'products_slider',
            'sliders_tertiaries',
            'discount_products_column',
            'featured_products_column',
            'selling_products_column',
            'discounts_flash',
            'discounts_flash_products',
        ]);
    }

    #[Test]
    public function it_returns_menus_data_successfully()
    {

        $response = $this->getJson('/api/ecommerce/menus');


        $response->assertStatus(200);


        $response->assertJsonStructure([
            'categories_menu' => [
                '*' => [
                    'id',
                    'name',
                    'icon',
                    'categories' => [
                        '*' => [
                            'id',
                            'name',
                            'image',
                            'subcategories' => [
                                '*' => [
                                    'id',
                                    'name',
                                    'image',
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]);
    }

    public function it_returns_product_data_successfully()
    {
        $response = $this->getJson('/api/ecommerce/show_product/consola-ps5-slim-1-tb-con-lector-marvel-spiderman-2-bundle');

        // Verificar que la respuesta sea exitosa
        $response->assertStatus(200);

        // Verificar que la respuesta contenga los datos del producto
        $response->assertJsonStructure([
            'product' => [
                'id',
                'name',
                'slug',
                'price',
                'description',
            ],
            'products_related' => [
                '*' => [
                    'id',
                    'name',
                    'price',
                    'slug',
                ]
            ],
            'discount_campaign',
            'reviews' => [
                '*' => [
                    'id',
                    'user' => [
                        'fullname',
                        'avatar',
                    ],
                    'message',
                    'rating',
                    'created_at',
                ]
            ],
        ]);
    }

    #[Test]
    public function it_returns_404_when_product_not_found()
    {
        // Realizar la solicitud a la ruta con un slug no existente
        $response = $this->getJson('/api/ecommerce/product/invalid-slug');

        // Verificar que la respuesta sea 404
        $response->assertStatus(404);
        $response->assertJson(['message' => 'El producto no existe']);
    }
}
