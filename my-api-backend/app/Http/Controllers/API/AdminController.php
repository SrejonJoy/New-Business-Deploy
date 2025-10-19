<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    // List all users (basic info)
    public function users(Request $request)
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at')->orderBy('id', 'desc')->get();
        return response()->json($users);
    }

    // Update a user's role
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string',
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->input('role');
        $user->save();

        return response()->json(['message' => 'Role updated', 'user' => $user]);
    }

    // Simple orders listing placeholder
    public function orders(Request $request)
    {
        // If you have an Order model, replace this with a real query.
        $orders = [];
        return response()->json($orders);
    }

    // Simple payments listing placeholder
    public function payments(Request $request)
    {
        // If you have a Payment model, replace this with a real query.
        $payments = [];
        return response()->json($payments);
    }

    // Add a jersey/product
    public function addProduct(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'name' => 'nullable|string|max:255',
            'team_name' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:20',
            'jersey_type' => 'nullable|in:cricket,football',
            'league' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'prev_price' => 'nullable|numeric',
            'image' => 'nullable|string',
            'in_stock' => 'nullable|boolean',
            'size_chart' => 'nullable|string',
            'sizes' => 'nullable|array',
            'sizes.*' => 'string',
            'shipping_time_days' => 'nullable|integer',
            'brand' => 'nullable|string',
            'country_of_origin' => 'nullable|string',
            'fabric' => 'nullable|string',
            'details' => 'nullable|array',
            'details.*' => 'string',
        ]);

        // normalize fields
        if (isset($data['sizes'])) $data['sizes'] = array_values($data['sizes']);
        if (isset($data['details']) && is_array($data['details'])) $data['details'] = array_values($data['details']);

        $product = Product::create($data);
        return response()->json(['message' => 'Product created', 'product' => $product], 201);
    }

    // List products (for admin UI)
    public function listProducts(Request $request)
    {
        $products = Product::orderBy('id', 'desc')->get();
        return response()->json($products);
    }

    // Public product list for debugging (temporary)
    public function listPublicProducts(Request $request)
    {
        $products = Product::orderBy('id', 'desc')->get();
        return response()->json($products);
    }

    // Edit a product
    public function editProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'name' => 'nullable|string|max:255',
            'team_name' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:20',
            'jersey_type' => 'nullable|in:cricket,football',
            'league' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric',
            'prev_price' => 'nullable|numeric',
            'image' => 'nullable|string',
            'in_stock' => 'nullable|boolean',
            'size_chart' => 'nullable|string',
            'sizes' => 'nullable|array',
            'sizes.*' => 'string',
            'shipping_time_days' => 'nullable|integer',
            'brand' => 'nullable|string',
            'country_of_origin' => 'nullable|string',
            'fabric' => 'nullable|string',
            'details' => 'nullable|array',
            'details.*' => 'string',
        ]);

        if (isset($data['sizes'])) $data['sizes'] = array_values($data['sizes']);
        if (isset($data['details']) && is_array($data['details'])) $data['details'] = array_values($data['details']);

        $product->fill($data);
        $product->save();

        return response()->json(['message' => 'Product updated', 'product' => $product]);
    }

    // Remove a product
    public function removeProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        // If image is a local storage url (contains '/storage/'), try to delete file
        try {
            $img = $product->image ?? '';
            if ($img && strpos($img, '/storage/') !== false) {
                $parts = explode('/storage/', $img);
                $rel = end($parts);
                if ($rel) {
                    Storage::disk('public')->delete($rel);
                }
            }
        } catch (\Exception $e) {
            // ignore deletion errors
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }

    // Apply a discount to a product (percentage or fixed)
    public function discountProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $data = $request->validate([
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
        ]);

        // store discount info on the product (simple approach)
        if ($data['type'] === 'percent') {
            $product->discount_percent = $data['value'];
        } else {
            $product->discount_fixed = $data['value'];
        }

        $product->save();

        return response()->json(['message' => 'Discount applied', 'product' => $product]);
    }

    // Upload an image file and return a public URL (admins only)
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg,gif,webp|max:5120', // max 5MB
        ]);

        $file = $request->file('image');
        // store original
        $path = $file->store('products/original', 'public');

        // create resized copy (max width 1200, maintain aspect)
        $maxWidth = 1200;
        $tmpPath = $file->getRealPath();
        $imgInfo = getimagesize($tmpPath);
        $width = $imgInfo[0] ?? null;
        $height = $imgInfo[1] ?? null;

        $resizedPath = $path; // default to original path
        if ($width && $width > $maxWidth) {
            $ratio = $height / $width;
            $newW = $maxWidth;
            $newH = (int) round($newW * $ratio);

            $mime = $imgInfo['mime'] ?? '';
            $src = null;
            switch ($mime) {
                case 'image/jpeg': $src = imagecreatefromjpeg($tmpPath); break;
                case 'image/png': $src = imagecreatefrompng($tmpPath); break;
                case 'image/gif': $src = imagecreatefromgif($tmpPath); break;
                case 'image/webp': $src = imagecreatefromwebp($tmpPath); break;
            }

            if ($src) {
                $dst = imagecreatetruecolor($newW, $newH);
                // preserve PNG transparency
                if ($mime === 'image/png' || $mime === 'image/webp') {
                    imagealphablending($dst, false);
                    imagesavealpha($dst, true);
                    $transparent = imagecolorallocatealpha($dst, 255, 255, 255, 127);
                    imagefilledrectangle($dst, 0, 0, $newW, $newH, $transparent);
                }
                imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $width, $height);

                // save resized image to public/products/resized
                $resizedName = 'products/resized/' . uniqid() . '.' . pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
                $fullPath = storage_path('app/public/' . $resizedName);
                switch ($mime) {
                    case 'image/jpeg': imagejpeg($dst, $fullPath, 85); break;
                    case 'image/png': imagepng($dst, $fullPath); break;
                    case 'image/gif': imagegif($dst, $fullPath); break;
                    case 'image/webp': imagewebp($dst, $fullPath, 85); break;
                }
                imagedestroy($dst);
                imagedestroy($src);
                $resizedPath = $resizedName;
            }
        }

        $url = Storage::url($resizedPath);

        return response()->json(['url' => $url, 'path' => $resizedPath, 'original' => $path]);
    }
}
