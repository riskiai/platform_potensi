<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('docs:sync-api', function () {
    $docPath = base_path('../docs_platform_potensi/POTENSI_API_DOCUMENTATION.md');

    if (! file_exists($docPath)) {
        $this->error("File dokumentasi tidak ditemukan di: {$docPath}");

        return 1;
    }

    $routes = collect(Route::getRoutes()->getRoutes())
        ->filter(fn ($route) => str_starts_with($route->uri(), 'api/'))
        ->values();

    $rows = [];
    foreach ($routes as $index => $route) {
        $no = $index + 1;
        $methods = implode('|', array_diff($route->methods(), ['HEAD']));
        $uri = '/'.$route->uri();
        $middlewares = $route->gatherMiddleware();
        $auth = in_array('auth:sanctum', $middlewares, true) ? 'Bearer (`auth:sanctum`)' : 'Publik';
        $actionName = $route->getActionName();
        $handler = str_contains($actionName, '@')
            ? class_basename(explode('@', $actionName)[0]).'@'.explode('@', $actionName)[1]
            : 'Closure (`routes/api.php`)';

        $rows[] = "| {$no} | `{$methods}` | `{BASE_URL}".substr($uri, 4)."` | {$auth} | `{$handler}` |";
    }

    $table = "| No | Method | Endpoint URL | Autentikasi | Handler Controller |\n"
        ."|:---:|:---:|---|---|---|\n"
        .implode("\n", $rows);

    $content = file_get_contents($docPath);
    $startMarker = '<!-- AUTO-GENERATED-ROUTES:START -->';
    $endMarker = '<!-- AUTO-GENERATED-ROUTES:END -->';

    if (str_contains($content, $startMarker) && str_contains($content, $endMarker)) {
        $pattern = '/'.preg_quote($startMarker, '/').'.*?'.preg_quote($endMarker, '/').'/s';
        $replacement = $startMarker."\n".$table."\n".$endMarker;
        $content = preg_replace($pattern, $replacement, $content);
        file_put_contents($docPath, $content);
        $this->info('Dokumentasi API berhasil disinkronisasi dengan route aktif ('.$routes->count().' endpoints).');
    } else {
        $this->warn('Marker AUTO-GENERATED-ROUTES tidak ditemukan di file dokumentasi.');
    }

    return 0;
})->purpose('Sinkronisasi tabel daftar endpoint aktif ke docs_platform_potensi/POTENSI_API_DOCUMENTATION.md');

