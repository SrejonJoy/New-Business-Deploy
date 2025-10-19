<?php

namespace App\Http\Controllers\API;
use Illuminate\Support\Str; // <-- 1. MAKE THIS CHANGE
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    // Redirect user to provider's authentication page
    public function redirectToProvider($provider)
    {
        // Only allow specific social providers. Facebook login has been removed.
        $allowed = ['google'];
        if (! in_array($provider, $allowed)) {
            abort(404);
        }

        return Socialite::driver($provider)->redirect();
    }

    // Handle callback from the provider
    public function handleProviderCallback($provider)
    {
        // Use stateful Socialite (do NOT call ->stateless()) so the provider state is validated
        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            // Log and redirect back to frontend with an error flag
            logger()->error('Socialite callback failed', ['provider' => $provider, 'error' => $e->getMessage()]);
            $frontend = rtrim(env('FRONTEND_URL', config('app.url')), '/');
            return redirect($frontend . '/login?social_error=1');
        }

        // Use the provider email when available; otherwise create a unique fallback
        $email = $socialUser->getEmail() ?? strtolower($provider . '_' . $socialUser->getId() . '@no-email.local');

        // Update existing user or create a new one using the email as unique key
        $user = User::updateOrCreate([
            'email' => $email,
        ], [
            'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'Unknown',
            'provider_name' => $provider,
            'provider_id' => $socialUser->getId(),
        ]);

        Auth::login($user);

        // Redirect to the frontend dashboard
        $frontend = rtrim(env('FRONTEND_URL', config('app.url')), '/');
        return redirect($frontend . '/dashboard');
    }
    // Handle Guest Login
    public function guestLogin(Request $request)
    {
        $user = User::updateOrCreate([
            'email' => $request->ip() . '@guest.com',
        ], [
            'name' => 'Guest User',
            'password' => bcrypt(Str::random(16)), // <-- 2. MAKE THIS CHANGE
        ]);

        Auth::login($user);

        return response()->json(['message' => 'Guest login successful']);
    }

    // Get Authenticated User
    public function user(Request $request)
    {
        return $request->user();
    }

    // Logout
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }
}