import React from "react";

export default function ReportSection({ title, children, label, action }) {
    return (
        <div className="space-y-6 border-b border-slate-200/60 ">
            <div className="flex items-center justify-between  pb-4 transition-all duration-500">
                <div className="flex items-center gap-4">
                    <div className="space-y-1">
                        <h2 className="text-md font-bold text-slate-700 tracking-tight leading-none">{title}</h2>
                        {label && <p className="text-[10px] font-medium text-slate-400">{label}</p>}
                    </div>
                </div>
                {action && <div className="animate-in fade-in slide-in-from-right-4 duration-700">{action}</div>}
            </div>
            <div className="animate-in fade-in duration-1000">
                {children}
            </div>
        </div>
    );
}
