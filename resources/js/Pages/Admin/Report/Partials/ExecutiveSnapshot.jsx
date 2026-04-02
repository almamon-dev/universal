import React from "react";
import { Activity, ShieldCheck, ShieldAlert, TrendingUp, BarChart3, PieChart } from "lucide-react";

const SnapshotCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition-all duration-500 group hover:-translate-y-2">
        <div className={`w-16 h-16 rounded-[1.5rem] ${color} flex items-center justify-center mb-8 shadow-2xl shadow-current/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
            <Icon size={32} className="text-white" strokeWidth={2.5} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 leading-none h-4">
            {title}
        </p>
        <h4 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4 tabular-nums">
            {value}
        </h4>
        {subtitle && (
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400/80 flex items-center gap-2 px-5 py-2 bg-slate-50/50 rounded-full border border-slate-100/50 transition-colors group-hover:bg-slate-100">
                {subtitle}
            </p>
        )}
    </div>
);

export default function ExecutiveSnapshot({ stats }) {
    const total = stats?.total_audits || 0;
    const passed = stats?.total_passed || 0;
    const failed = stats?.total_failed || 0;

    return (
        <div className="space-y-12">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                <SnapshotCard 
                    title="TOTAL AUDITS" 
                    value={total} 
                    icon={Activity} 
                    color="bg-blue-600"
                    subtitle={stats?.period?.full_range || 'ACTIVE CYCLE'}
                />
                <SnapshotCard 
                    title="AUDIT PASS" 
                    value={passed} 
                    icon={ShieldCheck} 
                    color="bg-emerald-500" 
                    subtitle="COMPLIANT RECORDS"
                />
                <SnapshotCard 
                    title="AUDIT FAILED" 
                    value={failed} 
                    icon={ShieldAlert} 
                    color="bg-rose-500" 
                    subtitle="HIGH SIGNIFICANCE FLAGS"
                />
            </div>

            {/* Sub-distribution or Quality Metrics */}
            <div className="bg-slate-50/30 rounded-[3rem] p-1.5 border border-slate-200/40">
                <div className="bg-white rounded-[2.8rem] p-10 md:p-16 border border-slate-100 shadow-sm relative overflow-hidden group/panel">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] transform group-hover/panel:scale-110 transition-transform duration-1000 pointer-events-none">
                        <TrendingUp size={240} strokeWidth={1} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center border border-orange-200/50">
                                    <PieChart size={20} className="text-orange-600" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase tracking-tight">QUALITY PERFORMANCE</h3>
                            </div>
                            <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed">
                                PERCENTAGE DISTRIBUTION OF TOTAL AUDITED UNITS THAT PASSED THE INITIAL SIGNAL VERIFICATION PROCESS DURING THIS CYCLE.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-16 md:border-l border-slate-100 md:pl-16">
                            <div className="text-center md:text-right">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4 leading-none">OVERALL RATE</p>
                                <span className="text-8xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                                    {total > 0 ? Math.round((passed / total) * 100) : 0}<span className="text-4xl text-slate-300 ml-1">%</span>
                                </span>
                            </div>
                            <div className="space-y-5 text-[11px] font-black min-w-[200px]">
                                {[
                                    { label: 'PASSED ITEMS', val: passed, color: 'bg-emerald-500', rate: total > 0 ? ((passed/total)*100).toFixed(1) : 0 },
                                    { label: 'FAILED ITEMS', val: failed, color: 'bg-rose-500', rate: total > 0 ? ((failed/total)*100).toFixed(1) : 0 }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between gap-4 uppercase tracking-[0.15em] text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-lg shadow-current/30`}></div>
                                                <span>{item.label}</span>
                                            </div>
                                            <span className="text-slate-900">{item.val}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div className={`h-full ${item.color} transition-all duration-1000 delay-300`} style={{ width: `${item.rate}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
