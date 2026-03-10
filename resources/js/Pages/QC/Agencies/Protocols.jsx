import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Info, Eye, CheckCircle2 } from "lucide-react";
import React from "react";

export default function Protocols({ agency }) {
    return (
        <UserLayout>
            <Head title={`Agency Protocols - ${agency.name}`} />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header Side - Mirroring Admin Design */}
                <div className="mb-8 flex justify-between items-center flex-col sm:flex-row gap-6">
                    <div className="flex flex-col gap-4">
                        <Link
                            href={route("dashboard")}
                            className="inline-flex items-center gap-2 text-sm transition-colors px-4 py-2 rounded-xl border w-fit font-medium text-gray-500 hover:text-gray-900 border-gray-200 bg-white"
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Agency Protocols
                            </h1>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                <Eye size={12} />
                                View Mode
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                            {agency.name}
                        </p>
                    </div>

                    <a
                        href="https://quillbot.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold rounded-xl hover:from-emerald-600 hover:to-emerald-700 shadow-xl shadow-emerald-900/10 transition-all active:scale-95"
                    >
                        <CheckCircle2 size={16} />
                        Refine Protocols
                    </a>
                </div>

                {/* Main Content Card - Mirroring Admin Design */}
                <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-300">
                    <div className="p-8 space-y-8">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Guidelines & Strategy
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Official agency-specific rules, guidelines,
                                    and operating procedures.
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none min-h-[400px]">
                            {agency.protocols ? (
                                <div
                                    className="text-gray-600 text-[15px] leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: agency.protocols,
                                    }}
                                />
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 mx-auto mb-4 text-gray-300">
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
                <div className="mt-8 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 transition-all duration-300">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-900/20 shrink-0">
                            <Info size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold mb-4 uppercase tracking-widest text-indigo-900">
                                Protocol Best Practices
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 transition-transform group-hover:scale-150"></div>
                                        <span className="text-sm font-medium text-indigo-700">
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
