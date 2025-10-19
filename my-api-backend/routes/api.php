<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// --- Stateful Authentication Routes ---
// These routes need sessions to work. We must wrap them in the 'web' middleware.
// Note: social and guest login routes have been moved to web.php so they run under the web middleware


// --- Stateless/Token-based Routes ---
// These routes are protected by Sanctum and can be used with API tokens OR the session cookie.
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Admin-only API
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/users', [\App\Http\Controllers\API\AdminController::class, 'users']);
        Route::post('/users/{id}/role', [\App\Http\Controllers\API\AdminController::class, 'updateRole']);
        // Orders, payments and product (jersey) management
        Route::get('/orders', [\App\Http\Controllers\API\AdminController::class, 'orders']);
        Route::get('/payments', [\App\Http\Controllers\API\AdminController::class, 'payments']);
        Route::post('/products', [\App\Http\Controllers\API\AdminController::class, 'addProduct']);
        Route::get('/products', [\App\Http\Controllers\API\AdminController::class, 'listProducts']);
        Route::put('/products/{id}', [\App\Http\Controllers\API\AdminController::class, 'editProduct']);
        Route::delete('/products/{id}', [\App\Http\Controllers\API\AdminController::class, 'removeProduct']);
        Route::post('/products/upload', [\App\Http\Controllers\API\AdminController::class, 'uploadImage']);
        Route::post('/products/{id}/discount', [\App\Http\Controllers\API\AdminController::class, 'discountProduct']);
    });

    // Cart APIs (for authenticated users)
    Route::get('/cart', [\App\Http\Controllers\API\CartController::class, 'getCart']);
    Route::post('/cart', [\App\Http\Controllers\API\CartController::class, 'saveCart']);
    Route::post('/cart/add', [\App\Http\Controllers\API\CartController::class, 'addItem']);
    Route::post('/cart/remove-item', [\App\Http\Controllers\API\CartController::class, 'removeItem']);
    Route::post('/cart/update-item', [\App\Http\Controllers\API\CartController::class, 'updateItem']);
    Route::post('/cart/clear', [\App\Http\Controllers\API\CartController::class, 'clear']);
});

// Temporary public debug endpoint (no auth required) - remove/secure for production
Route::get('/public/products', [\App\Http\Controllers\API\AdminController::class, 'listPublicProducts']);