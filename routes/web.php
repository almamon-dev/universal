<?php

use App\Http\Controllers\Admin\AgencyController;
use App\Http\Controllers\Admin\Dashboard\OverviewController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\Settings\SystemSettingsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Authenticated Dashboard Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // Universal Dashboard Redirect
    Route::get('/dashboard', [OverviewController::class, 'index'])->name('dashboard');

    // Admin Specific Dashboard
    Route::middleware('admin')->get('/admin/dashboard', [OverviewController::class, 'index'])->name('admin.dashboard');

    // QC Specific Dashboard
    Route::middleware('qc')->get('/qc/dashboard', [OverviewController::class, 'index'])->name('qc.dashboard');
});

/*
|--------------------------------------------------------------------------
| Profile Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->controller(ProfileController::class)->group(function () {
    Route::get('/profile', 'edit')->name('profile.edit');
    Route::patch('/profile', 'update')->name('profile.update');
    Route::delete('/profile', 'destroy')->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Quality Control (QC) Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'qc'])->prefix('qc')->name('qc.')->group(function () {
    Route::controller(AgencyController::class)->group(function () {
        Route::get('agencies/{agency}/protocols', 'protocols')->name('agencies.protocols');
        Route::get('agencies/{agency}/audits/create', 'createAudit')->name('agencies.audits.create');
        Route::post('agencies/{agency}/audits', 'storeAudit')->name('agencies.audits.store');
    });
});

/*
|--------------------------------------------------------------------------
| Administration Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // System Settings
    Route::controller(SystemSettingsController::class)->group(function () {
        Route::get('/settings/system', 'edit')->name('settings.system');
        Route::post('/settings/system', 'update')->name('settings.system.update');
    });

    // User Management
    Route::resource('users', UserController::class)->only(['index', 'destroy']);

    // Agency & Audit Management
    Route::controller(AgencyController::class)->group(function () {
        Route::resource('agencies', AgencyController::class);
        Route::get('agencies/{agency}/audits', 'audits')->name('agencies.audits');
        Route::post('agencies/{agency}/audit-fields', 'updateAuditFields')->name('agencies.audit-fields.update');
        Route::get('agencies/{agency}/registry', 'registry')->name('agencies.registry');
        Route::post('agencies/{agency}/chatters', 'storeChatter')->name('agencies.chatters.store');
        Route::delete('chatters/{chatter}', 'destroyChatter')->name('chatters.destroy');
        Route::post('agencies/{agency}/creators', 'storeCreator')->name('agencies.creators.store');
        Route::delete('creators/{creator}', 'destroyCreator')->name('creators.destroy');
        Route::get('agencies/{agency}/discovery', 'discovery')->name('agencies.discovery');
        Route::get('agencies/{agency}/chatter-discovery', 'chatterDiscovery')->name('agencies.chatter-discovery');
        Route::get('agencies/{agency}/qc-discovery', 'qcDiscovery')->name('agencies.qc-discovery');
        Route::get('agencies/{agency}/owner-discovery', 'ownerDiscovery')->name('agencies.owner-discovery');
        Route::post('agencies/{agency}/discovery/{type}', 'updateDiscovery')->name('agencies.discovery.update');
        Route::get('agencies/{agency}/view-system/discovery', 'viewSystemDiscovery')->name('agencies.view-system-discovery');
        Route::post('agencies/{agency}/update-metrics', 'updateMetrics')->name('agencies.update-metrics');
        Route::post('agencies/{agency}/protocols', 'updateProtocols')->name('agencies.protocols.update');

        // Protocol View for Admin
        Route::get('agencies/{agency}/protocols', 'protocols')->name('agencies.protocols');

        // Instant QC Management
        Route::post('agencies/{agency}/qcs', 'storeQC')->name('agencies.qcs.store');
        Route::put('qcs/{user}', 'updateQC')->name('agencies.qcs.update');
        Route::delete('qcs/{user}/destroy', 'destroyQC')->name('agencies.qcs.destroy');
    });

    // Reporting Engine
    Route::controller(ReportController::class)->prefix('report')->name('report.')->group(function () {
        Route::get('/{agency?}', 'index')->name('index');
        Route::get('/weekly/{agency}', 'weeklyReport')->name('weekly');
        Route::get('/agency/{agency}', 'agencyAudit')->name('agency');
        Route::get('/summary', 'summary')->name('summary');
        Route::get('/revenue', 'revenue')->name('revenue');
    });
});

require __DIR__.'/auth.php';
