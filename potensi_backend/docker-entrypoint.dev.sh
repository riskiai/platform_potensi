#!/bin/sh
set -e

# Wait for MySQL to be ready if DB_HOST is set
if [ -n "$DB_HOST" ]; then
    echo "Waiting for database connection at $DB_HOST:${DB_PORT:-3306}..."
    until nc -z -v -w30 "$DB_HOST" "${DB_PORT:-3306}" 2>/dev/null; do
        echo "Waiting for database ($DB_HOST)..."
        sleep 2
    done
    echo "Database is ready!"
fi

# Ensure .env exists
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Install dependencies if vendor missing
if [ ! -d "vendor" ]; then
    echo "Installing Composer dependencies..."
    composer install --no-interaction --prefer-dist
fi

# Generate application key if not set
if ! grep -q "^APP_KEY=base64:" .env; then
    echo "Generating Laravel application key..."
    php artisan key:generate --force
fi

# Fix storage and cache permissions
chmod -R 777 storage bootstrap/cache 2>/dev/null || true

# Run database migrations automatically
php artisan migrate --force 2>/dev/null || true

exec "$@"

