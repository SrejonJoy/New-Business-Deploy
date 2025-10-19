<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;

trait CreatesApplication
{
    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        // Ensure tests use sqlite in-memory regardless of local .env or cached config
        // This only affects the test runtime and keeps changes scoped to tests.
        putenv('APP_ENV=testing');
        putenv('DB_CONNECTION=sqlite');
        putenv('DB_DATABASE=:memory:');
        $_ENV['APP_ENV'] = 'testing';
        $_ENV['DB_CONNECTION'] = 'sqlite';
        $_ENV['DB_DATABASE'] = ':memory:';

        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Kernel::class)->bootstrap();

        // Force the config to use sqlite in-memory for tests. Some parts of
        // the framework read the config after the environment is loaded, so
        // ensure the runtime config is updated as well.
        try {
            $app['config']->set('database.default', 'sqlite');
            $app['config']->set('database.connections.sqlite.database', ':memory:');
        } catch (\Exception $e) {
            // If config service isn't available yet, ignore; tests will still
            // pick up env overrides in most cases.
        }

        return $app;
    }
}
