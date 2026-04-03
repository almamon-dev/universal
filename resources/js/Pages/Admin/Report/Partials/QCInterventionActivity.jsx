import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";
import { cn } from "@/lib/utils";

const AuditorCard = ({ name, count }) => (
    <div className="flex-1 bg-white p-5 rounded-lg border border-slate-100 shadow-sm transition-all hover:shadow-md group">
        <p className="text-[10px] font-bold text-slate-400 capitalize mb-1 group-hover:text-slate-600 transition-colors">{name}</p>
        <span className="text-2xl font-black text-slate-900 tabular-nums tracking-tighter">{count}</span>
    </div>
);

export default function QCInterventionActivity({ stats }) {
    return (
        <div className="space-y-3">
            <p className="text-xs font-bold text-slate-700">QC intervention activity</p>
            
            <div className="bg-white border border-slate-100 rounded-xl p-8 space-y-8 shadow-sm">
                <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">35</span>
                    <span className="text-xs font-bold text-slate-400 lowercase first-letter:uppercase">Total interventions</span>
                </div>

                <div className="flex gap-4">
                    <AuditorCard name="rosemarie" count={0} />
                    <AuditorCard name="oscar" count={0} />
                    <AuditorCard name="ojay" count={0} />
                </div>
            </div>
        </div>
    );
}
