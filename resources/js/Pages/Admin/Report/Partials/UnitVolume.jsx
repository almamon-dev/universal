import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function UnitVolume({ stats }) {
    const sellable = stats?.sellable || 0;
    const nonSellable = stats?.non_sellable || 0;

    return (
        <div className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sellable Card */}
                <div className="relative overflow-hidden bg-emerald-50/20 border border-emerald-100 rounded-2xl p-6 transition-all hover:bg-emerald-50/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 size={20} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                            Direct Revenue Stream
                        </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 mb-1">
                        Sellable Analysis
                    </p>
                    <span className="text-5xl font-black text-emerald-700 tracking-tighter">
                        {sellable}
                    </span>
                    <p className="text-[10px] font-medium text-emerald-600/70 mt-2 uppercase tracking-widest">
                        Qualified Conversations Identified
                    </p>
                </div>

                {/* Non-Sellable Card */}
                <div className="relative overflow-hidden bg-rose-50/20 border border-rose-100 rounded-2xl p-6 transition-all hover:bg-rose-50/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                            <XCircle size={20} />
                        </div>
                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">
                            Observation Restricted
                        </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 mb-1">
                        Non-Sellable Analysis
                    </p>
                    <span className="text-5xl font-black text-rose-700 tracking-tighter">
                        {nonSellable}
                    </span>
                    <p className="text-[10px] font-medium text-rose-600/70 mt-2 uppercase tracking-widest">
                        Disqualified Conversation Units
                    </p>
                </div>
            </div>
        </div>
    );
}
