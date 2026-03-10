<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Services\ReportService;
use Inertia\Inertia;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index(?Agency $agency = null)
    {
        return Inertia::render('Admin/Report/Index', [
            'agency' => $agency ?? Agency::first(),
        ]);
    }

    public function weeklyReport(Agency $agency)
    {
        $agency->load(['chatters', 'creators', 'qcs']);

        $stats = $this->reportService->getWeeklyStats($agency);

        return Inertia::render('Admin/Report/WeeklyReport', [
            'agency' => $agency,
            'stats' => $stats,
        ]);
    }

    public function agencyAudit(Agency $agency)
    {
        $agency->load(['chatters', 'creators', 'qcs']);
        $stats = $this->reportService->getAgencyAuditStats($agency);

        return Inertia::render('Admin/Report/AgencyAudit', [
            'agency' => $agency,
            'stats' => $stats,
        ]);
    }

    public function summary()
    {
        return Inertia::render('Admin/Report/Summary');
    }

    public function revenue()
    {
        return Inertia::render('Admin/Report/Revenue');
    }
}
