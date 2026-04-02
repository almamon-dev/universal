import React from "react";
import { Activity, ShieldCheck, Info, ArrowUpRight } from "lucide-react";


const MetricCard = ({ title, children, className = "" }) => (
    <div
        className={`bg-white rounded-xl border border-zinc-200 p-6 flex flex-col ${className}`}
    >
        <h4 className="text-[10px] font-bold text-zinc-400 mb-6 border-b border-zinc-100 pb-3 flex items-center justify-between">
            {title}
            <Info size={12} className="text-zinc-300" />
        </h4>
        <div className="grid grid-cols-2 gap-6">{children}</div>
    </div>
);

export default function MetricGrids({ stats }) {
    const grids = stats?.grids || {};

    return (
        <div className="space-y-8">
            {/* QC Intervention Dashboard */}
            <div className="bg-zinc-50/50 rounded-xl p-8 border border-zinc-100">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 mb-1">
                            System control
                        </p>
                        <h4 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                            Quality control interventions
                        </h4>
                    </div>
                    <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                        <Activity size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="text-right border-r border-zinc-100 pr-8">
                            <span className="text-4xl font-black text-zinc-900 tracking-tighter">
                                {grids.interventions?.total || 0}
                            </span>
                            <span className="block text-[10px] font-bold text-zinc-400 mt-1">
                                High significance
                            </span>
                        </div>
                        <p className="text-[11px] font-bold text-zinc-500 max-w-[160px] leading-relaxed">
                            Total prioritized intervention points identified during this reporting cycle.
                        </p>
                    </div>

                        <div className="flex gap-8">
                        {[
                            {
                                label: "Critical",
                                val: grids.interventions?.high_risk || 0,
                                color: "text-zinc-900",
                            },
                            {
                                label: "Normal",
                                val: grids.interventions?.standard || 0,
                                color: "text-zinc-500",
                            },
                            {
                                label: "Mitigated",
                                val: grids.interventions?.resolved || 0,
                                color: "text-zinc-900 underline decoration-zinc-200 decoration-2 underline-offset-4",
                            },
                        ].map((stat, i) => (
                            <div key={i} className="text-right">
                                <p className="text-[10px] font-bold text-zinc-400 mb-1">
                                    {stat.label}
                                </p>
                                <p
                                    className={`text-2xl font-black ${stat.color} tracking-tighter`}
                                >
                                    {stat.val}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: "Entity resolution flags", val: "N/A" },
                        { label: "Temporal anomalies", val: "N/A" },
                        {
                            label: "Manual verification",
                            val: grids.interventions?.total || 0,
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm transition-all hover:border-zinc-900"
                        >
                            <p className="text-[10px] font-bold text-zinc-400 mb-2">
                                {item.label}
                            </p>
                            <p className="text-2xl font-black text-zinc-900 tracking-tighter">
                                {item.val}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Hierarchy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="Market segment">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400">
                            New discovery
                        </p>
                        <p className="text-3xl font-black text-zinc-900 tracking-tighter">
                            {grids.segments?.new_discovery || 0}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400">
                            Retention
                        </p>
                        <p className="text-3xl font-black text-zinc-900 tracking-tighter">
                            {grids.segments?.retention_spent || 0}
                        </p>
                    </div>
                </MetricCard>

                <MetricCard title="Operational discipline">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400">
                            Aftercare rate
                        </p>
                        <p className="text-3xl font-black text-zinc-900 tracking-tighter">
                            {stats?.executive?.aftercare?.yes || 0}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400">
                            Assistance requests
                        </p>
                        <p className="text-3xl font-black text-zinc-900 tracking-tighter">
                            {stats?.executive?.qc_help?.yes || 0}
                        </p>
                    </div>
                </MetricCard>

                <MetricCard title="Cycle transition">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400">
                            Negotiation
                        </p>
                        <p className="text-3xl font-black text-zinc-900 tracking-tighter">
                            {stats?.executive?.negotiation?.yes || 0}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400">
                            Sexual transition
                        </p>
                        <p className="text-3xl font-black text-zinc-900 tracking-tighter">
                            {stats?.executive?.casual_to_sexual?.yes || 0}
                        </p>
                    </div>
                </MetricCard>
            </div>

            {/* Binary Performance Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(grids.binary || []).map((item, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col justify-between hover:border-zinc-900 transition-all group"
                    >
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded border border-zinc-200">
                                    {item.category}
                                </span>
                            </div>
                            <h5 className="text-sm font-bold text-zinc-900 leading-tight tracking-tight capitalize">
                                {item.title}
                            </h5>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-50 rounded-lg p-4 flex items-center justify-between border border-transparent group-hover:border-zinc-100 transition-all">
                                <span className="text-[10px] font-bold text-zinc-400">
                                    Affirmative
                                </span>
                                <span className="text-xl font-black text-zinc-900 tracking-tighter">
                                    {item.yes}
                                </span>
                            </div>
                            <div className="bg-zinc-50 rounded-lg p-4 flex items-center justify-between border border-transparent group-hover:border-zinc-100 transition-all relative">
                                <span className="text-[10px] font-bold text-zinc-400">
                                    Negative
                                </span>
                                <span className="text-xl font-black text-zinc-900 tracking-tighter">
                                    {item.no}
                                </span>
                                {item.title === "Rule Violation Incidence" &&
                                    parseInt(item.yes) > 0 && (
                                        <div className="absolute -top-1.5 -right-1.5 bg-zinc-900 text-white text-[8px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            Action required
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
