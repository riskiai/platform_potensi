# -------------------------------------------------------------
# Stage 1: Build & Optimize Vendor Dependencies
# -------------------------------------------------------------
FROM composer:2 AS composer_builder

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --no-scripts \
    --no-autoloader

COPY . .

RUN composer dump-autoload --optimize --no-dev

# -------------------------------------------------------------
# Stage 2: Production Runtime with PHP 8.3 FPM + Nginx + Supervisor
# -------------------------------------------------------------
FROM php:8.3-fpm-alpine

# Install system runtime dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    icu-dev \
    oniguruma-dev \
    libxml2-dev \
    netcat-openbsd

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl \
    opcache

# Configure PHP for production (opcache)
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.revalidate_freq=2'; \
    echo 'opcache.fast_shutdown=1'; \
} > /usr/local/etc/php/conf.d/opcache-recommended.ini

WORKDIR /var/www/html

# Copy application files
COPY . .

# Copy optimized vendor from composer_builder
COPY --from=composer_builder /app/vendor ./vendor

# Configure Nginx & Supervisor
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Setup Entrypoint
COPY docker/docker-entrypoint.prod.sh /usr/local/bin/docker-entrypoint.prod.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.prod.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.prod.sh

# Setup permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.prod.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

