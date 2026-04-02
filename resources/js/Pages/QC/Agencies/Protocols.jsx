import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Info, Eye, CheckCircle2 } from "lucide-react";
import React from "react";

export default function Protocols({ agency }) {
    return (
        <UserLayout>
            <Head title={`Agency Protocols - ${agency.name}`} />

            <div className="max-w-7xl mx-auto px-10 py-4">
                {/* Header Side - Mirroring Admin Design */}
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <Link
                            href={route("dashboard")}
                            className="inline-flex items-center gap-2 text-[11px] transition-colors px-3 py-1.5 rounded-sm border w-fit font-bold text-gray-500 hover:text-gray-900 border-gray-200 bg-white shadow-sm"
                        >
                            <ArrowLeft size={12} />
                            Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold tracking-tight text-gray-900">
                                Agency Protocols
                            </h1>
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-medium rounded-full">
                                <Eye size={10} />
                                View Mode
                            </span>
                        </div>
                        <p className="text-xs font-bold text-gray-400">
                            {agency.name}
                        </p>
                    </div>

                    <a
                        href="https://quillbot.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[13px] font-bold rounded-sm hover:from-emerald-600 hover:to-emerald-700 shadow-xl shadow-emerald-900/10 transition-all active:scale-95"
                    >
                        <CheckCircle2 size={14} />
                        Refine Protocols
                    </a>
                </div>

                {/* Main Content Card - Mirroring Admin Design */}
                <div className="overflow-hidden bg-white border border-gray-200 rounded-sm shadow-sm transition-all duration-300">
                    <div className="p-6 md:p-8 space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h2 className="text-md font-bold text-gray-900">
                                    Guidelines & Strategy
                                </h2>
                                <p className="text-xs font-medium text-gray-400">
                                    Official agency-specific rules, guidelines,
                                    and operating procedures.
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none min-h-[300px] overflow-x-hidden">
                            {agency.protocols ? (
                                <div
                                    className="text-gray-600 text-[14px] leading-relaxed break-words whitespace-normal font-medium"
                                    dangerouslySetInnerHTML={{
                                        __html: agency.protocols,
                                    }}
                                />
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="w-12 h-12 bg-gray-50 rounded-sm flex items-center justify-center border border-gray-100 mx-auto mb-4 text-gray-300">
                                        <Info size={24} />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        No Protocols Found
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">
                                        This agency hasn't published any
                                        protocols yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reference Tips - Exactly like Admin */}
                <div className="mt-4 p-6 bg-gray-200 rounded-sm border border-gray-100 transition-all duration-300">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-10 h-10 bg-zinc-900 rounded-md flex items-center justify-center text-white shadow-2xl shadow-black/10 shrink-0">
                            <Info size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[10px] font-black mb-3 text-zinc-400">
                                Protocol Best Practices
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    "Clarity over complexity",
                                    "Strict adherence to rules",
                                    "Reference real examples",
                                    "Regular audit checks",
                                    "Contact leads for updates",
                                    "Quality above all else",
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 group"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-zinc-300 transition-transform group-hover:scale-150"></div>
                                        <span className="text-[13px] font-bold text-zinc-600">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
