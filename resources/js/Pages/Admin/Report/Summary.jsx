import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    LayoutDashboard,
    Activity,
    Target,
    Zap,
} from "lucide-react";

export default function Summary() {
    return (
        <AdminLayout>
            <Head title="Executive Summary — Report" />

            <div className="min-h-screen bg-zinc-50/50 py-12 px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumbs */}
                    <Link
                        href={route("admin.report.index")}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-black transition-colors group mb-8"
                    >
                        <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                        System dashboard
                    </Link>

                    {/* Header */}
                    <div className="bg-white p-10 rounded-xl border border-zinc-200 shadow-sm mb-10 overflow-hidden relative">
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <LayoutDashboard size={24} />
                                </div>
                                <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">
                                    Executive summary
                                </h1>
                            </div>
                            <p className="text-zinc-500 max-w-2xl text-lg leading-relaxed">
                                A comprehensive overview of the agency's operational health, key performance indicators, and critical growth vectors.
                            </p>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Stats Card */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-sm">
                                <h3 className="text-sm font-bold text-zinc-900 mb-8 flex items-center gap-2">
                                    <Activity className="text-zinc-400" size={18} />
                                    Growth overview
                                </h3>
                                <div className="h-64 bg-zinc-50 rounded-lg flex items-center justify-center border border-dashed border-zinc-200">
                                    <p className="text-[10px] font-bold text-zinc-300">
                                        Data visualization pending
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-sm group hover:border-zinc-900 transition-all">
                                    <Zap className="text-zinc-400 mb-6" size={20} />
                                    <h4 className="text-[10px] font-bold text-zinc-400 mb-1 group-hover:text-zinc-900 transition-colors">
                                        Impact velocity
                                    </h4>
                                    <p className="text-[11px] font-medium text-zinc-500 leading-relaxed">
                                        Speed of conversion across all traffic sources.
                                    </p>
                                    <div className="mt-8 text-3xl font-bold text-zinc-900 tracking-tighter">
                                        84.2%
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-sm group hover:border-zinc-900 transition-all">
                                    <Target className="text-zinc-400 mb-6" size={20} />
                                    <h4 className="text-[10px] font-bold text-zinc-400 mb-1 group-hover:text-zinc-900 transition-colors">
                                        Target alignment
                                    </h4>
                                    <p className="text-[11px] font-medium text-zinc-500 leading-relaxed">
                                        Adherence to established system protocols.
                                    </p>
                                    <div className="mt-8 text-3xl font-bold text-zinc-900 tracking-tighter">
                                        91.0%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="bg-zinc-900 text-white p-8 rounded-xl shadow-xl relative overflow-hidden flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-bold mb-8 text-white/50">
                                    Key insights
                                </h3>
                                <ul className="space-y-8">
                                    {[
                                        "Revenue retention is up 12% following QC intervention.",
                                        "Chatter efficiency peaked during peak weekend hours.",
                                        "New subscriber onboarding requires tighter protocol discipline.",
                                    ].map((insight, i) => (
                                        <li key={i} className="flex gap-4">
                                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full mt-2 shrink-0" />
                                            <p className="text-[11px] font-medium text-zinc-300 leading-relaxed">
                                                {insight}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-lg">
                                <p className="text-[9px] font-bold text-zinc-500 mb-2">
                                    Health score
                                </p>
                                <div className="text-4xl font-bold text-white tracking-tighter">
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
