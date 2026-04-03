import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { 
    ArrowLeft, 
    FileText, 
    Activity, 
    TrendingUp, 
    ShieldCheck, 
    BarChart3,
    ArrowRight
} from "lucide-react";

const ReportCard = ({ title, description, href, icon: Icon, color = "text-zinc-600", isMain = false }) => (
    <Link 
        href={href} 
        className={`group relative flex flex-col p-6 rounded-xl border transition-all duration-200 ${
            isMain 
            ? "bg-zinc-900 border-zinc-900 text-white shadow-lg hover:bg-zinc-800" 
            : "bg-white border-zinc-100 hover:border-zinc-300 shadow-sm"
        }`}
    >
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
            isMain ? "bg-white/10" : "bg-zinc-50"
        }`}>
            <Icon size={24} strokeWidth={1.5} className={isMain ? "text-white" : color} />
        </div>
        
        <div className="space-y-2 flex-grow">
            <h3 className={`font-bold text-lg tracking-tight ${isMain ? "text-white" : "text-zinc-900"}`}>
                {title}
            </h3>
            <p className={`text-sm leading-relaxed ${isMain ? "text-zinc-400" : "text-zinc-500"}`}>
                {description}
            </p>
        </div>

        <div className={`mt-8 pt-6 border-t flex items-center justify-between ${
            isMain ? "border-white/10" : "border-zinc-50"
        }`}>
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
                isMain ? "text-zinc-500" : "text-zinc-400"
            }`}>
                View Diagnostic
            </span>
            <ArrowRight size={16} className={`transition-transform group-hover:translate-x-1 ${
                isMain ? "text-white" : "text-zinc-400"
            }`} />
        </div>
    </Link>
);

export default function Index({ agency }) {
    const reports = [
        {
            title: "Weekly Protocol Audit",
            description: "Full diagnostic breakdown of chatter performance, conversion dialectics, and revenue leakage mapping.",
            href: route("admin.report.weekly", agency.id),
            icon: Activity,
            color: "text-blue-600",
            main: true
        },
        {
            title: "Trend Analysis",
            description: "Historical performance data visualizing agency growth, auditor oversight, and accuracy benchmarks.",
            href: "#",
            icon: TrendingUp,
            color: "text-emerald-600"
        },
        {
            title: "Compliance Registry",
            description: "Verification logs for protocol adherence and automated violation detection reporting.",
            href: "#",
            icon: ShieldCheck,
            color: "text-purple-600"
        },
        {
            title: "Executive Summary",
            description: "High-level snapshot of total agency health, operational capacity, and auditor frequency.",
            href: "#",
            icon: BarChart3,
            color: "text-amber-600"
        },
        {
            title: "Signal Flow Audit",
            description: "Deep-dive conversation analysis tracking sellable opportunities and conversion quality.",
            href: "#",
            icon: FileText,
            color: "text-pink-600"
        }
    ];

    return (
        <AdminLayout>
            <Head title={`Reporting Suite — ${agency.name}`} />

            <div className="bg-white border-b border-zinc-100 py-6">
                <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
                    <Link
                        href={route("admin.agencies.edit", agency.id)}
                        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Agency
                    </Link>
                    
                    <div className="flex flex-col items-center">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 italic">Reporting Suite</p>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">{agency.name}</h1>
                    </div>

                    <div className="w-24" /> {/* Spacer */}
                </div>
            </div>

            <div className="min-h-screen bg-zinc-50/30 py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map((report, idx) => (
                            <ReportCard 
                                key={idx}
                                title={report.title}
                                description={report.description}
                                href={report.href}
                                icon={report.icon}
                                color={report.color}
                                isMain={report.main}
                            />
                        ))}
                    </div>

                    <div className="mt-20 pt-12 border-t border-zinc-100 text-center">
                        <p className="text-xs font-medium text-zinc-400">
                            Diagnostic Reporting Engine v2.4 • Invariant Consulting
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
