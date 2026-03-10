import React, { useState } from "react";
import { ChevronDown, Download } from "lucide-react";

export default function ReportSection({
    title,
    children,
    defaultOpen = true,
    showExport = true,
    onExport,
    badge,
    badgeColor = "bg-blue-50 text-blue-600 border-blue-100",
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] overflow-hidden mb-6 last:mb-0">
            {/* Header / Accordion Trigger */}
            <div
                className="px-6 py-4.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-all group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div
                        className={`p-1 rounded-md transition-colors ${isOpen ? "bg-slate-100 text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`}
                    >
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${isOpen ? "" : "-rotate-90"}`}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-bold text-slate-800 tracking-tight">
                            {title}
                        </h2>
                        {badge && (
                            <span
                                className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${badgeColor}`}
                            >
                                {badge}
                            </span>
                        )}
                    </div>
                </div>

                {showExport && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onExport?.();
                        }}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-black transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        <Download size={13} className="opacity-90" />
                        Export Data
                    </button>
                )}
            </div>

            {/* Content */}
            <div
                className={`transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
            >
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-white">
                    {children}
                </div>
            </div>
        </div>
    );
}
