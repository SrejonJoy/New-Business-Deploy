<?php
namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Product;

class CartControllerTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        // create a user and a product
        $this->user = User::factory()->create();
        $this->product = Product::create(['title' => 'Test Jersey', 'price' => 100, 'in_stock' => true]);
    }

    public function test_add_item_to_cart_authenticated()
    {
        $this->actingAs($this->user);
        $resp = $this->postJson('/api/cart/add', ['id' => $this->product->id, 'title' => $this->product->title, 'price' => $this->product->price, 'qty' => 2]);
        $resp->assertStatus(200);
        $resp->assertJsonStructure(['items']);
        $this->assertDatabaseHas('carts', ['user_id' => $this->user->id]);
    }

    public function test_update_item_quantity()
    {
        $this->actingAs($this->user);
        $this->postJson('/api/cart/add', ['id' => $this->product->id, 'title' => $this->product->title, 'price' => $this->product->price, 'qty' => 1]);
        $cart = \App\Models\Cart::where('user_id', $this->user->id)->first();
        $key = $cart->items[0]['key'];
        $resp = $this->postJson('/api/cart/update-item', ['key' => $key, 'qty' => 5]);
        $resp->assertStatus(200);
        $this->assertEquals(5, $resp->json('items')[0]['qty']);
    }

    public function test_remove_item()
    {
        $this->actingAs($this->user);
        $this->postJson('/api/cart/add', ['id' => $this->product->id, 'title' => $this->product->title, 'price' => $this->product->price, 'qty' => 1]);
        $cart = \App\Models\Cart::where('user_id', $this->user->id)->first();
        $key = $cart->items[0]['key'];
        $resp = $this->postJson('/api/cart/remove-item', ['key' => $key]);
        $resp->assertStatus(200);
        $this->assertEmpty($resp->json('items'));
    }

    public function test_cannot_add_out_of_stock()
    {
        $this->actingAs($this->user);
    $oos = Product::create(['title' => 'Out of stock', 'price' => 50, 'in_stock' => false]);
        $resp = $this->postJson('/api/cart/add', ['id' => $oos->id, 'title' => $oos->title, 'price' => $oos->price, 'qty' => 1]);
        $resp->assertStatus(422);
    }
}
