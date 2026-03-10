import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    LayoutDashboard,
    Activity,
    Users,
    Target,
    Zap,
} from "lucide-react";

export default function Summary() {
    return (
        <AdminLayout>
            <Head title="Executive Summary — Report" />

            <div className="min-h-screen bg-gray-50 py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumbs */}
                    <Link
                        href={route("admin.report.index")}
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Reports
                    </Link>

                    {/* Header */}
                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm mb-10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-blue-600 rounded-sm flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <LayoutDashboard size={24} />
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                                    Executive Summary
                                </h1>
                            </div>
                            <p className="text-gray-600 max-w-2xl text-lg leading-relaxed">
                                A comprehensive overview of the agency's
                                operational health, key performance indicators,
                                and critical growth vectors.
                            </p>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Stats Card */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Activity
                                        className="text-blue-500"
                                        size={20}
                                    />
                                    Growth Overview
                                </h3>
                                <div className="h-64 bg-gray-50 rounded-sm flex items-center justify-center border border-dashed border-gray-200">
                                    <p className="text-sm text-gray-400">
                                        Growth Chart Visualization Placeholder
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <Zap
                                        className="text-amber-500 mb-4"
                                        size={24}
                                    />
                                    <h4 className="font-bold text-gray-900 mb-1">
                                        Impact Velocity
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        Speed of conversion across all traffic
                                        sources.
                                    </p>
                                    <div className="mt-4 text-2xl font-black text-gray-900">
                                        84.2%
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <Target
                                        className="text-emerald-500 mb-4"
                                        size={24}
                                    />
                                    <h4 className="font-bold text-gray-900 mb-1">
                                        Target Alignment
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        Adherence to established system
                                        protocols.
                                    </p>
                                    <div className="mt-4 text-2xl font-black text-gray-900">
                                        91.0%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="bg-gray-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mb-16 -mr-16 blur-2xl" />
                            <h3 className="text-xl font-bold mb-6">
                                Key Insights
                            </h3>
                            <ul className="space-y-6">
                                {[
                                    "Revenue retention is up 12% following QC intervention.",
                                    "Chatter efficiency peaked during peak weekend hours.",
                                    "New subscriber onboarding requires tighter protocol discipline.",
                                ].map((insight, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            {insight}
                                        </p>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-sm">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
                                    Health Score
                                </p>
                                <div className="text-4xl font-black text-white">
                                    A+
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
