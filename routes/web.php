<?php

use App\Http\Controllers\Admin\AgencyController;
use App\Http\Controllers\Admin\Settings\SystemSettingsController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
use App\Http\Controllers\Admin\Dashboard\OverviewController;

Route::get('/dashboard', [OverviewController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/admin/dashboard', [OverviewController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('admin.dashboard');

Route::get('/qc/dashboard', [OverviewController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('qc.dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // QC Routes
    Route::prefix('qc')->name('qc.')->group(function () {
        Route::get('agencies/{agency}/protocols', [AgencyController::class, 'protocols'])->name('agencies.protocols');
        Route::get('agencies/{agency}/audits/create', [AgencyController::class, 'createAudit'])->name('agencies.audits.create');
        Route::post('agencies/{agency}/audits', [AgencyController::class, 'storeAudit'])->name('agencies.audits.store');
    });

    // Admin Settings
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/settings/system', [SystemSettingsController::class, 'edit'])->name('settings.system');
        Route::post('/settings/system', [SystemSettingsController::class, 'update'])->name('settings.system.update');
        // Users
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->only(['index', 'destroy']);
        // Agencies
        Route::resource('agencies', \App\Http\Controllers\Admin\AgencyController::class);
        Route::get('agencies/{agency}/audits', [\App\Http\Controllers\Admin\AgencyController::class, 'audits'])->name('agencies.audits');
        Route::post('agencies/{agency}/audit-fields', [\App\Http\Controllers\Admin\AgencyController::class, 'updateAuditFields'])->name('agencies.audit-fields.update');
        Route::get('agencies/{agency}/registry', [\App\Http\Controllers\Admin\AgencyController::class, 'registry'])->name('agencies.registry');
        Route::post('agencies/{agency}/chatters', [\App\Http\Controllers\Admin\AgencyController::class, 'storeChatter'])->name('agencies.chatters.store');
        Route::delete('chatters/{chatter}', [\App\Http\Controllers\Admin\AgencyController::class, 'destroyChatter'])->name('chatters.destroy');
        Route::post('agencies/{agency}/creators', [\App\Http\Controllers\Admin\AgencyController::class, 'storeCreator'])->name('agencies.creators.store');
        Route::delete('creators/{creator}', [\App\Http\Controllers\Admin\AgencyController::class, 'destroyCreator'])->name('creators.destroy');
        Route::get('agencies/{agency}/discovery', [\App\Http\Controllers\Admin\AgencyController::class, 'discovery'])->name('agencies.discovery');
        Route::get('agencies/{agency}/chatter-discovery', [\App\Http\Controllers\Admin\AgencyController::class, 'chatterDiscovery'])->name('agencies.chatter-discovery');
        Route::get('agencies/{agency}/qc-discovery', [\App\Http\Controllers\Admin\AgencyController::class, 'qcDiscovery'])->name('agencies.qc-discovery');
        Route::get('agencies/{agency}/owner-discovery', [\App\Http\Controllers\Admin\AgencyController::class, 'ownerDiscovery'])->name('agencies.owner-discovery');
        Route::post('agencies/{agency}/discovery/{type}', [\App\Http\Controllers\Admin\AgencyController::class, 'updateDiscovery'])->name('agencies.discovery.update');

        // Admin Routes
        Route::get('agencies/{agency}/view-system/discovery', [AgencyController::class, 'viewSystemDiscovery'])->name('agencies.view-system-discovery');
        Route::post('agencies/{agency}/protocols', [AgencyController::class, 'updateProtocols'])->name('agencies.protocols.update');

        // Maintain Admin's ability to view/edit protocols if needed
        Route::get('agencies/{agency}/protocols', [AgencyController::class, 'protocols'])->name('agencies.protocols');
        
        // Instant QC Management
        Route::post('agencies/{agency}/qcs', [AgencyController::class, 'storeQC'])->name('agencies.qcs.store');
        Route::put('qcs/{user}', [AgencyController::class, 'updateQC'])->name('agencies.qcs.update');
        Route::delete('qcs/{user}/destroy', [AgencyController::class, 'destroyQC'])->name('agencies.qcs.destroy');
        // Reports
        Route::get('report/{agency?}', [ReportController::class, 'index'])->name('report.index');
        Route::prefix('report')->name('report.')->group(function () {
            Route::get('/weekly/{agency}', [ReportController::class, 'weeklyReport'])->name('weekly');
            Route::get('/agency/{agency}', [ReportController::class, 'agencyAudit'])->name('agency');
            Route::get('/summary', [ReportController::class, 'summary'])->name('summary');
            Route::get('/revenue', [ReportController::class, 'revenue'])->name('revenue');
        });
    });
});

require __DIR__.'/auth.php';
