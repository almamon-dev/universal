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
            </div>
        </UserLayout>
    );
}
