import React from "react";
import { Zap, ShieldAlert } from "lucide-react";

export default function QCInterventionActivity({ stats }) {
    const qcStats = stats?.qc_intervention_stats || [];

    return (
        <div className="space-y-6">
            {/* Total Header */}
            <div className="flex items-center justify-between bg-rose-50/30 p-5 rounded-2xl border border-rose-100/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm transition-transform hover:scale-105">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-rose-600 mb-0.5">
                            <ShieldAlert size={12} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">
                                Critical Enforcement
                            </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-800">
                            Intervention Activity Dashboard
                        </h4>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black text-rose-600 tracking-tighter leading-none">
                        {stats?.interventions || 0}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Total Interventions
                    </p>
                </div>
            </div>

            {/* Grid Breakdown */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-3 bg-slate-300 rounded-full" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Auditor Level Breakdown
                    </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {qcStats.map((qc, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-rose-200 transition-all group"
                        >
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 group-hover:text-rose-600 transition-colors">
                                {qc.name}
                            </p>
                            <p className="text-3xl font-black text-slate-900 tracking-tight">
                                {qc.count}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
