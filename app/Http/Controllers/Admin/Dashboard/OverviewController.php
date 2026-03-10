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
            if ($user->is_admin) {
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
            $totalAudits = $agency ? $agency->audits()->count() : 0;
            $todayAudits = $agency ? $agency->audits()->whereDate('seo_audits.created_at', now())->count() : 0;
            $recentAudits = $agency ? $agency->audits()->with(['user', 'chatter'])->latest('seo_audits.created_at')->limit(5)->get() : [];

            return Inertia::render('QC/Dashboard', [
                'agency' => $agency,
                'stats' => [
                    'total_audits' => $totalAudits,
                    'today_audits' => $todayAudits,
                ],
                'recent_audits' => $recentAudits,
            ]);
        }

        return Inertia::render('Dashboard');
    }
}
