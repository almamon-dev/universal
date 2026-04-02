import React, { useState } from "react";
import { ChevronDown, Download, Activity, List, Layout, FileText, BarChart3, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportSection({
    title,
    subtitle,
    children,
    defaultOpen = true,
    showExport = true,
    onExport,
    badge,
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    // Dynamic icon based on title keywords
    const getIcon = () => {
        const t = title.toUpperCase();
        if (t.includes("SNAPSHOT")) return Activity;
        if (t.includes("BREAKDOWN")) return List;
        if (t.includes("SIGNAL")) return ShieldCheck;
        if (t.includes("FAULT")) return Layout;
        if (t.includes("TREND")) return BarChart3;
        if (t.includes("OPERATIONS")) return FileText;
        return Activity;
    };

    const Icon = getIcon();

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
            {/* Accordion Header (admin/agencies/edit style) */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 transition-colors ${isOpen ? 'active:bg-white' : ''}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-all duration-500 ${isOpen ? 'bg-black text-white' : 'bg-gray-50 text-gray-400'}`}>
                        <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-[13px] font-black tracking-[0.05em] text-gray-900 uppercase">
                                {title}
                            </h2>
                            {badge && (
                                <span className="text-[9px] font-black px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md border border-gray-200 uppercase tracking-widest">
                                    {badge}
                                </span>
                            )}
                        </div>
                        {subtitle && (
                            <p className="text-[11px] font-medium text-gray-400 mt-1 uppercase tracking-tight">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {showExport && isOpen && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onExport?.();
                            }}
                            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-white border border-gray-200 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                        >
                            <Download size={12} strokeWidth={2.5} />
                            EXPORT
                        </button>
                    )}
                    <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>
            </div>

            {/* Content with Motion Animation */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <div className="border-t border-gray-100 p-8 md:p-12 bg-white">
                            <div className="animate-in fade-in duration-700">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
