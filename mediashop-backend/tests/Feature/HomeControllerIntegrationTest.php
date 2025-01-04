<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\TestCase;
use App\Models\Product\Product;
use App\Models\Product\Categorie;
use App\Models\Slider;
use PHPUnit\Framework\Attributes\Test;

class HomeControllerIntegrationTest extends TestCase
{
    #[Test]
    public function it_returns_home_data_correctly()
    {
        // Crear datos de prueba: sliders, categorías y productos
        $slider = Slider::factory()->create();
        $categorie = Categorie::factory()->create();
        $product = Product::factory()->create();

        // Realizar una solicitud GET a la ruta /api/home
        $response = $this->getJson('/api/ecommerce/home');

        // Verificar que la respuesta tenga el status 200 (OK)
        $response->assertStatus(200);

        // Verificar que la respuesta tenga la estructura esperada
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

        // Eliminar los elementos creados permanentemente
        $slider->forceDelete();
        $categorie->forceDelete();
        $product->forceDelete();
    }
}
