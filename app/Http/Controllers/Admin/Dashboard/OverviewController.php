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
            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'total_agencies' => $totalAgencies,
                    'active_agencies' => $activeAgencies,
                    'inactive_agencies' => $inactiveAgencies,
                    'total_users' => $totalUsers,
                ],
                'agencies' => \App\Models\Agency::latest()->get(),
            ]);
        }

        if (Auth::user() && Auth::user()->role === 'qc') {
            $agency = Auth::user()->agency;
            $filterDateStr = request('date', now()->format('Y-m-d'));
            $filterDate = \Carbon\Carbon::parse($filterDateStr);
            
            $totalAudits = $agency ? $agency->audits()->count() : 0;
            $selectedDateAudits = $agency ? $agency->audits()->whereDate('seo_audits.created_at', $filterDateStr)->count() : 0;
            
            // Graph Data (7 days up to filter date)
            $graphData = [];
            if ($agency) {
                for ($i = 6; $i >= 0; $i--) {
                    $d = $filterDate->copy()->subDays($i);
                    $dateKey = $d->format('Y-m-d');
                    $count = $agency->audits()->whereDate('seo_audits.created_at', $dateKey)->count();
                    $graphData[] = [
                        'date' => $d->format('d M'),
                        'count' => $count
                    ];
                }
            }

            return Inertia::render('QC/Dashboard', [
                'agency' => $agency,
                'stats' => [
                    'total_audits' => $totalAudits,
                    'today_audits' => $selectedDateAudits,
                    'filter_date' => $filterDateStr,
                    'graph_data' => $graphData
                ]
            ]);
        }

        // Default Dashboard (Generic User)
        $graphData = [];
        for ($i = 6; $i >= 0; $i--) {
            $graphData[] = [
                'date' => now()->subDays($i)->format('d M'),
                'count' => rand(1, 10) // Placeholder activity data
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
                'graph_data' => $graphData
            ]
        ]);
    }
}
