import React from "react";
import { Zap, ShieldAlert } from "lucide-react";
import { Activity, Users } from "lucide-react";

export default function QCInterventionActivity({ stats }) {
    const qcStats = stats?.qc_intervention_stats || [];

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-zinc-50/50 p-6 rounded-xl border border-zinc-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
                            <Activity size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 mb-1">
                                System control
                            </p>
                            <h4 className="text-lg font-bold text-zinc-900 tracking-tight">
                                Management interventions
                            </h4>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-zinc-900 tracking-tighter leading-none">
                            {stats?.interventions || 0}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-400 mt-1">
                            Active actions
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Users size={14} className="text-zinc-400" />
                        <span className="text-[11px] font-bold text-zinc-400">
                            Auditor overview
                        </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {qcStats.map((qc, idx) => (
                            <div
                                key={idx}
                                className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-900 transition-all"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[10px] font-bold text-zinc-400 truncate">
                                        {qc.name}
                                    </p>
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                                </div>
                                <p className="text-2xl font-bold text-zinc-900 tracking-tighter">
                                    {qc.count}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
