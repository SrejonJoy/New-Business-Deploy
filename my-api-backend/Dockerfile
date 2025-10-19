# Production-ready Dockerfile for Laravel (PHP 8.1 + Apache)
FROM php:8.1-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy Laravel files
COPY . /var/www/html

# Install Composer
COPY --from=composer:2.5 /usr/bin/composer /usr/bin/composer

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Set Apache DocumentRoot to Laravel public folder
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && sed -i 's|<Directory /var/www/html>|<Directory /var/www/html/public>|g' /etc/apache2/sites-available/000-default.conf

# Create startup script to handle APP_KEY generation, database setup, and cache
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Generate APP_KEY if missing\n\
if [ -z "$APP_KEY" ]; then\n\
    echo "⚠️  APP_KEY not set. Generating new key..."\n\
    php artisan key:generate --force\n\
fi\n\
\n\
# Create SQLite database if using SQLite and file does not exist\n\
if [ "$DB_CONNECTION" = "sqlite" ] && [ ! -f "$DB_DATABASE" ]; then\n\
    echo "📦 Creating SQLite database..."\n\
    touch "$DB_DATABASE"\n\
    chmod 664 "$DB_DATABASE"\n\
    chown www-data:www-data "$DB_DATABASE"\n\
fi\n\
\n\
# Run migrations (optional - comment out if you want to run manually)\n\
echo "🔄 Running database migrations..."\n\
php artisan migrate --force || echo "⚠️  Migration failed or no database configured"\n\
\n\
# Clear and cache configs\n\
echo "🚀 Optimizing Laravel..."\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
\n\
echo "✅ Laravel app ready!"\n\
exec apache2-foreground' > /usr/local/bin/start.sh \
    && chmod +x /usr/local/bin/start.sh

# Expose port 80
EXPOSE 80

# Start Apache with our custom script
CMD ["/usr/local/bin/start.sh"]
