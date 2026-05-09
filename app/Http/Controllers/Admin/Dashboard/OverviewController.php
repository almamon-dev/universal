<?php

namespace App\Http\Controllers\Admin\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OverviewController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // If hitting generic /dashboard, redirect to proper one
        if (request()->routeIs('dashboard')) {
            if ($user->is_admin || $user->role === 'admin') {
                return redirect()->route('admin.dashboard');
            }
            if ($user->role === 'qc') {
                return redirect()->route('qc.dashboard');
            }
        }

        // Counts for Agencies
        $totalAgencies = \App\Models\Agency::count();
        $activeAgencies = \App\Models\Agency::where('status', 'active')->count();
        $inactiveAgencies = \App\Models\Agency::where('status', 'inactive')->count();

        // Counts for Users
        $totalUsers = User::count();

        if (Auth::user() && Auth::user()->is_admin) {
            $filterDateStr = request('date'); // Don't default to today
            $filterDate = $filterDateStr ? \Carbon\Carbon::parse($filterDateStr) : null;

            $agencies = \App\Models\Agency::withCount([
                'chatters',
                'audits',
                'audits as filtered_audits_count' => function ($query) use ($filterDateStr) {
                    if ($filterDateStr) {
                        $query->whereDate('seo_audits.created_at', $filterDateStr);
                    }
                }
            ])->latest()->get();

            $stats = [
                'total_agencies' => $totalAgencies,
                'active_agencies' => $activeAgencies,
                'inactive_agencies' => $inactiveAgencies,
                'total_users' => $totalUsers,
                'total_audits' => $filterDateStr ? $agencies->sum('filtered_audits_count') : $agencies->sum('audits_count'),
                'filter_date' => $filterDateStr,
            ];

            return Inertia::render('Admin/Dashboard', [
                'stats' => $stats,
                'agencies' => $agencies,
            ]);
        }

        if (Auth::user() && Auth::user()->role === 'qc') {
            $agency = Auth::user()->agency;
            $filterDateStr = request('date'); // Don't default to today
            $filterDate = $filterDateStr ? \Carbon\Carbon::parse($filterDateStr) : now();

            $allTimeAudits = $agency ? $agency->audits()->count() : 0;
            
            if ($filterDateStr) {
                $selectedDateAudits = $agency ? $agency->audits()->whereDate('seo_audits.created_at', $filterDateStr)->count() : 0;
                $totalAudits = $selectedDateAudits;
            } else {
                $selectedDateAudits = $allTimeAudits;
                $totalAudits = $allTimeAudits;
            }

            // Graph Data (7 days up to filter date or today)
            $graphData = [];
            if ($agency) {
                $baseDate = $filterDateStr ? \Carbon\Carbon::parse($filterDateStr) : now();
                for ($i = 6; $i >= 0; $i--) {
                    $d = $baseDate->copy()->subDays($i);
                    $dateKey = $d->format('Y-m-d');
                    $count = $agency->audits()->whereDate('seo_audits.created_at', $dateKey)->count();
                    $graphData[] = [
                        'date' => $d->format('d M'),
                        'count' => $count,
                    ];
                }
            }

            return Inertia::render('QC/Dashboard', [
                'agency' => $agency,
                'stats' => [
                    'total_audits' => $totalAudits,
                    'all_time_audits' => $allTimeAudits,
                    'today_audits' => $selectedDateAudits,
                    'filter_date' => $filterDateStr,
                    'graph_data' => $graphData,
                ],
            ]);
        }

        // Default Dashboard (Generic User)
        $graphData = [];
        for ($i = 6; $i >= 0; $i--) {
            $graphData[] = [
                'date' => now()->subDays($i)->format('d M'),
                'count' => rand(1, 10), // Placeholder activity data
            ];
        }

        return Inertia::render('Dashboard', [
            'dashboard_data' => [
                'stats' => [
                    [
                        'title' => 'Campaign Growth',
                        'value' => '12.5%',
                        'subtitle' => 'Trending Up',
                        'icon' => 'BarChart',
                        'color' => 'bg-indigo-600',
                    ],
                ],
                'graph_data' => $graphData,
            ],
        ]);
    }
}
