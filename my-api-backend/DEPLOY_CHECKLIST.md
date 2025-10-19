# Deploy checklist (minimal)

This file lists the recommended steps to prepare this Laravel API for production deployment.

1. Environment
   - Ensure `APP_DEBUG=false` in production environment.
   - Do NOT commit sensitive values to the repo. Use provider secrets / environment variables.
   - Review `.env.example` for any sample secrets and keep them empty.

2. Configuration
   - Ensure `APP_KEY` is generated in production (run `php artisan key:generate --show` or provide via platform secrets).
   - Remove any committed `bootstrap/cache/*.php` files. Add `bootstrap/cache/*.php` to `.gitignore` (done).

3. Database
   - Run migrations on deploy: `php artisan migrate --force`.
   - Seed data only if required. Prefer idempotent seeding.
   - Ensure backups and proper user privileges for the production DB user.

4. Assets
   - Build frontend assets (if deploying together) from `my-social-login-app`:
     - cd `my-social-login-app` and run `npm ci` then `npm run build`.
   - Copy built assets to `public` as configured by your deploy target.

5. Caching
   - In production, run `php artisan config:cache`, `php artisan route:cache`, `php artisan view:cache`.
   - Do NOT commit cached config files to the repo.

6. Queues & Jobs
   - If using queues, run appropriate workers (supervisord/systemd) and set `QUEUE_CONNECTION` accordingly.

7. Observability
   - Configure logging, error tracking (Sentry etc), and alerts for high error rates.

8. Security
   - Ensure HTTPS, HSTS, and other headers at platform level.
   - Keep dependencies up-to-date; run periodic `composer audit` / `npm audit`.

9. CI / Tests
   - Unit/feature tests are configured to run with sqlite in-memory by default.
   - To run locally with sqlite (fast):

```
# from repo root (PowerShell)
cd 'f:\Ready Websites\business\Business-Website\New-Business-Deploy\my-api-backend'
# run tests using packaged phpunit
./vendor/bin/phpunit --configuration phpunit.xml
```

   - To run tests against a real MySQL (docker required):

```
# start the test MySQL (docker must be installed)
cd 'f:\Ready Websites\business\Business-Website\New-Business-Deploy\my-api-backend'
# this will start a disposable MySQL on host port 33060
docker-compose -f docker-compose.test.yml up -d

# Run phpunit forcing DB envs for the test run
$env:DB_CONNECTION = 'mysql'; $env:DB_HOST='127.0.0.1'; $env:DB_PORT='33060'; $env:DB_DATABASE='test_db'; $env:DB_USERNAME='test'; $env:DB_PASSWORD='secret'
./vendor/bin/phpunit --configuration phpunit.xml

# When done, tear down
docker-compose -f docker-compose.test.yml down -v
```

10. Post-deploy checks
    - Run smoke tests, health-check endpoints, and verify logs.


If you want, I can add a GitHub Actions workflow that runs tests with sqlite and (optionally) spins up the docker-compose MySQL for integration tests.
