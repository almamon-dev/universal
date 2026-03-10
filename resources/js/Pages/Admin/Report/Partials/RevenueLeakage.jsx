import React from "react";
import { TrendingDown, ArrowUpRight } from "lucide-react";

export default function RevenueLeakage({ stats }) {
    const leakageItems = stats?.leakage?.items || [];
    const totalLost = stats?.leakage?.total_lost || "$0";

    return (
        <div className="space-y-4 pt-2">
            <div className="bg-slate-50/50 rounded-md border border-slate-200 p-5 mb-4 shadow-sm flex items-center justify-between">
                <div>
                    <h4 className="text-[10px] font-bold text-slate-800  tracking-widest">
                        Revenue Leakage
                    </h4>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                        Identified commercial inefficiencies
                    </p>
                </div>
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                    <TrendingDown className="text-white" size={18} />
                </div>
            </div>

            <div className="bg-slate-50 rounded-md border border-slate-200 overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-200">
                    {leakageItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-4 md:p-5 flex items-center justify-between group transition-colors hover:bg-white"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[13px] font-semibold text-slate-700 tracking-tight">
                                    {item.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] font-medium text-slate-400 italic">
                                        {item.count} {item.countLabel}
                                    </p>
                                    <p className="text-base font-bold text-rose-600">
                                        {item.amount}
                                    </p>
                                </div>
                                <ArrowUpRight
                                    size={14}
                                    className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-100 p-5 flex items-center justify-between border-t border-slate-200">
                    <span className="text-[10px] font-bold text-slate-700  tracking-widest">
                        Total Revenue Lost
                    </span>
                    <span className="text-2xl font-bold text-rose-600 tracking-tight">
                        {totalLost}
                    </span>
                </div>
            </div>
        </div>
    );
}
