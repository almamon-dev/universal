import React from "react";
import { TrendingDown, ArrowRight, AlertCircle, Info, Database } from "lucide-react";

export default function RevenueLeakage({ stats }) {
    const leakageItems = stats?.leakage?.items || [
        { label: "INFERRED VALUE LOST", count: "11 UNITS", amount: "$500", type: 'loss' },
        { label: "VALUE LOST TO PITCHING", count: "9 PERFORMERS", amount: "- $1270", type: 'loss' },
        { label: "REPAIRED FOR INVOICING", count: "21 UNITS", amount: "+ $350", type: 'gain' },
        { label: "UPSELL POTENTIAL", count: "39 OPPORTUNITIES", amount: "+ $1080", type: 'potential' },
        { label: "VERIFIED CONVERSION RATE", count: "89 CASES", amount: "+ $920", type: 'gain' },
        { label: "MISC. LOSS FACTORS", count: "3 SUB-CATEGORIES", amount: "- $180", type: 'loss' }
    ];
    const totalLost = stats?.leakage?.total_lost || "- $5505";

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Red Themed Table Container */}
            <div className="bg-[#FFF1F2] rounded-[3rem] border border-rose-100 overflow-hidden shadow-2xl shadow-rose-500/5 transition-all hover:shadow-rose-500/10 group">
                <div className="p-10 md:p-16">
                   <div className="flex items-center justify-between mb-12 border-b border-rose-200/50 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center shadow-xl shadow-rose-500/30 ring-4 ring-rose-50 transition-transform group-hover:rotate-6">
                                <TrendingDown size={24} className="text-white" strokeWidth={3} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-2xl font-black text-rose-900 tracking-tight leading-none uppercase tracking-tighter">SIGNAL AUDIT ANALYTICS</h4>
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] h-3">REVENUE VARIANCE ANALYSIS</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
                            <Database size={16} className="text-rose-300" />
                        </div>
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                        {leakageItems.map((item, idx) => (
                            <div 
                                key={idx}
                                className="group/item flex items-center justify-between p-6 rounded-[2rem] bg-white/40 hover:bg-white transition-all duration-500 border border-transparent hover:border-rose-200 shadow-sm"
                            >
                                <div className="flex items-center gap-5">
                                     <div className={`w-3 h-3 rounded-full ${item.type === 'loss' ? 'bg-rose-400' : item.type === 'gain' ? 'bg-emerald-400' : 'bg-blue-400'} shadow-md shadow-current/20`} />
                                     <span className="text-sm font-black text-rose-950 uppercase tracking-[0.1em] leading-none">
                                        {item.label}
                                     </span>
                                </div>
                                <div className="flex items-center gap-12">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest mb-1.5 h-3">
                                            {item.count}
                                        </p>
                                        <p className={`text-2xl font-black tracking-tighter leading-none tabular-nums ${item.type === 'loss' ? 'text-rose-600' : 'text-slate-800'}`}>
                                            {item.amount}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-rose-50/50 flex items-center justify-center transition-all group-hover/item:translate-x-1 group-hover/item:bg-rose-500 group-hover/item:text-white">
                                        <ArrowRight size={18} strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                        ))}
                   </div>
                </div>

                {/* Total Summary Footer */}
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-10 md:p-16 flex flex-col md:flex-row md:items-center justify-between shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <TrendingDown size={400} className="text-white transform -translate-x-24 translate-y-24" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center md:items-start gap-4 mb-8 md:mb-0">
                        <div className="flex items-center gap-3">
                            <AlertCircle size={20} className="text-white opacity-60" strokeWidth={3} />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] leading-none">NET AGGREGATE VARIANCE</span>
                        </div>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest max-w-[280px] leading-relaxed text-center md:text-left">COMPUTED LEAKAGE VALUE ACROSS ALL SIGNAL AUDIT VERTICALS FOR CURRENT CYCLE.</p>
                    </div>
                    <div className="relative z-10 text-center md:text-right">
                        <span className="text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
                            {totalLost}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
