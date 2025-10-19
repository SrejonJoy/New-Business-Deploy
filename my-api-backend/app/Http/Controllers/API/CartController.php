<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;

class CartController extends Controller
{
    public function getCart(Request $request)
    {
        $user = $request->user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id], ['items' => []]);
        return response()->json(['items' => $cart->items ?? []]);
    }

    public function saveCart(Request $request)
    {
        $user = $request->user();
        $data = $request->validate(['items' => 'required|array']);
        $cart = Cart::updateOrCreate(['user_id' => $user->id], ['items' => $data['items']]);
        return response()->json(['items' => $cart->items]);
    }

    public function addItem(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'id' => 'required',
            'title' => 'required|string',
            'price' => 'nullable|numeric',
            'image' => 'nullable|string',
            'qty' => 'nullable|integer|min:1',
            'size' => 'nullable|string'
        ]);
        // enforce product availability
        $product = \App\Models\Product::find($data['id']);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        if (!$product->in_stock) {
            return response()->json(['message' => 'Product is not in stock'], 422);
        }
        if (!empty($data['size']) && is_array($product->sizes) && count($product->sizes) > 0) {
            if (!in_array($data['size'], $product->sizes)) {
                return response()->json(['message' => 'Selected size is not available'], 422);
            }
        }

        $cart = Cart::firstOrCreate(['user_id' => $user->id], ['items' => []]);
        $items = $cart->items ?? [];
        $key = $data['id'] . '::' . ($data['size'] ?? '');
        $found = false;
        foreach ($items as &$it) {
            if (($it['key'] ?? '') === $key) { $it['qty'] = ($it['qty'] ?? 0) + ($data['qty'] ?? 1); $found = true; break; }
        }
        if (!$found) {
            $items[] = ['key' => $key, 'id' => $data['id'], 'title' => $data['title'], 'price' => $data['price'] ?? 0, 'image' => $data['image'] ?? null, 'qty' => $data['qty'] ?? 1, 'size' => $data['size'] ?? null];
        }
        $cart->items = $items;
        $cart->save();
        return response()->json(['items' => $cart->items]);
    }

    // Update a single cart item (quantity)
    public function updateItem(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'key' => 'required|string',
            'qty' => 'required|integer|min:1'
        ]);

        $cart = Cart::firstOrCreate(['user_id' => $user->id], ['items' => []]);
        $items = $cart->items ?? [];
        $found = false;
        foreach ($items as &$it) {
            if (($it['key'] ?? '') === $data['key']) { $it['qty'] = $data['qty']; $found = true; break; }
        }
        if (!$found) return response()->json(['message' => 'Item not found'], 404);
        $cart->items = $items;
        $cart->save();
        return response()->json(['items' => $cart->items]);
    }

    // Remove a single cart item by key
    public function removeItem(Request $request)
    {
        $user = $request->user();
        $data = $request->validate(['key' => 'required|string']);
        $cart = Cart::firstOrCreate(['user_id' => $user->id], ['items' => []]);
        $items = $cart->items ?? [];
        $next = array_values(array_filter($items, function($it) use ($data) { return ($it['key'] ?? '') !== $data['key']; }));
        $cart->items = $next;
        $cart->save();
        return response()->json(['items' => $cart->items]);
    }

    public function clear(Request $request)
    {
        $user = $request->user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id], ['items' => []]);
        $cart->items = [];
        $cart->save();
        return response()->json(['items' => []]);
    }
}
