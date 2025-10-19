<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login/*', 'logout'],

    'allowed_methods' => ['*'],

    // Allowed origins; in production set CORS_ALLOWED_ORIGINS in .env as a comma-separated list
    'allowed_origins' => array_filter(array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3001')))),

    // allow localhost and 127.0.0.1 on any port during development
    'allowed_origins_patterns' => [
        '/^https?:\/\/localhost(:[0-9]+)?$/',
        '/^https?:\/\/127\.0\.0\.1(:[0-9]+)?$/'
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
