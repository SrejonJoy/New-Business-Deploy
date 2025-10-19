<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

use App\Http\Controllers\API\AuthController;

// Social Login and Guest Login (session-based) -----------------------------
Route::get('/auth/{provider}/redirect', [AuthController::class, 'redirectToProvider']);
Route::get('/auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);
Route::post('/auth/guest', [AuthController::class, 'guestLogin']);

// Backwards-compatible endpoints: some OAuth flows may have registered the callback under /api/auth/...
// Keep these routes so providers that redirect to /api/auth/... don't 404.
Route::get('/api/auth/{provider}/redirect', [AuthController::class, 'redirectToProvider']);
Route::get('/api/auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);
Route::post('/api/auth/guest', [AuthController::class, 'guestLogin']);
