import React from "react";
import { Activity, ShieldCheck, Info, ArrowUpRight } from "lucide-react";

const MetricCard = ({ title, children, className = "" }) => (
    <div
        className={`bg-white rounded-md border border-slate-200 p-5 shadow-sm ${className}`}
    >
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
            {title}
            <Info size={10} className="text-slate-300" />
        </h4>
        <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
);

export default function MetricGrids({ stats }) {
    const grids = stats?.grids || {};

    return (
        <div className="space-y-6 pt-4">
            {/* QC Intervention */}
            <div className="bg-slate-50/50 rounded-md p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            System Interventions
                        </h4>
                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                            Quality control oversight metrics
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Activity className="text-white" size={18} />
                    </div>
                </div>

                <div className="bg-white rounded-md p-5 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="text-right border-r border-slate-100 pr-6">
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">
                                {grids.interventions?.total || 0}
                            </span>
                            <span className="block text-[8px] font-bold text-slate-400 uppercase mt-0.5">
                                Total Signals
                            </span>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-500 max-w-[120px] leading-relaxed">
                            Active intervention points identified.
                        </p>
                    </div>

                    <div className="flex gap-6">
                        {[
                            {
                                label: "High Risk",
                                val: grids.interventions?.high_risk || 0,
                                color: "text-rose-600",
                                bg: "bg-rose-50",
                            },
                            {
                                label: "Standard",
                                val: grids.interventions?.standard || 0,
                                color: "text-blue-600",
                                bg: "bg-blue-50",
                            },
                            {
                                label: "Resolved",
                                val: grids.interventions?.resolved || 0,
                                color: "text-emerald-600",
                                bg: "bg-emerald-50",
                            },
                        ].map((stat, i) => (
                            <div key={i} className="text-right">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                    {stat.label}
                                </p>
                                <p
                                    className={`text-lg font-bold ${stat.color}`}
                                >
                                    {stat.val}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Chatter ID Flags", val: "0" },
                        { label: "Temporal Flags", val: "0" },
                        {
                            label: "Manual QC Flags",
                            val: grids.interventions?.total || 0,
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-md p-4 border border-slate-200 shadow-sm group-hover:border-blue-200 transition-colors"
                        >
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                {item.label}
                            </p>
                            <p className="text-lg font-bold text-slate-800">
                                {item.val}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Two Column Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard title="Subscriber Segment">
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                            New Discovery
                        </p>
                        <p className="text-xl font-bold text-slate-800 tracking-tight">
                            {grids.segments?.new_discovery || 0}
                        </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                            Retention Spent
                        </p>
                        <p className="text-xl font-bold text-slate-800 tracking-tight">
                            {grids.segments?.retention_spent || 0}
                        </p>
                    </div>
                </MetricCard>

                <MetricCard title="Operational Performance">
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                            Aftercare (Pillow Talk)
                        </p>
                        <p className="text-xl font-bold text-emerald-600 tracking-tight">
                            {stats?.executive?.aftercare?.yes || 0}
                        </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                            Chatter Help Requests
                        </p>
                        <p className="text-xl font-bold text-amber-600 tracking-tight">
                            {stats?.executive?.qc_help?.yes || 0}
                        </p>
                    </div>
                </MetricCard>

                <MetricCard title="Sales Discipline">
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                            Negotiation Used
                        </p>
                        <p className="text-xl font-bold text-slate-800 tracking-tight">
                            {stats?.executive?.negotiation?.yes || 0}
                        </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                            Casual to Sexual Transition
                        </p>
                        <p className="text-xl font-bold text-slate-800 tracking-tight">
                            {stats?.executive?.casual_to_sexual?.yes || 0}
                        </p>
                    </div>
                </MetricCard>
            </div>

            {/* Binary Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {(grids.binary || []).map((item, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-md border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                                    {item.category}
                                </span>
                            </div>
                            <h5 className="text-[13px] font-bold text-slate-800 leading-tight">
                                {item.title}
                            </h5>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 rounded-md border border-slate-100 px-4 py-2.5 flex items-center justify-between">
                                <span className="text-[9px] font-bold text-slate-400">
                                    YES
                                </span>
                                <span className="text-base font-bold text-slate-800">
                                    {item.yes}
                                </span>
                            </div>
                            <div className="bg-slate-50 rounded-md border border-slate-100 px-4 py-2.5 flex items-center justify-between relative group/item">
                                <span className="text-[9px] font-bold text-slate-400">
                                    NO
                                </span>
                                <span className="text-base font-bold text-slate-800">
                                    {item.no}
                                </span>
                                {item.title === "Rule Violation Incidence" &&
                                    parseInt(item.yes) > 0 && (
                                        <div className="absolute -top-2.5 -right-0.5 bg-rose-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded shadow-lg transform rotate-3">
                                            ACTION
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
