import React from "react";

export default function MetricGrids() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-12 rounded-xl text-center border border-slate-100">
                <p className="text-[10px] font-black text-slate-400  tracking-[0.4em]">Trend Analysis Awaiting Sync</p>
            </div>
            <div className="bg-slate-50 p-12 rounded-xl text-center border border-slate-100">
                <p className="text-[10px] font-black text-slate-400  tracking-[0.4em]">Historical Variance Scan</p>
            </div>
        </div>
    );
}
