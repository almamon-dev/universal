import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    ShieldCheck,
    Crown,
    Users,
    ArrowUpRight,
    Search,
} from "lucide-react";

export default function Discovery({ agency }) {
    const DiscoveryActionCard = ({
        label,
        description,
        icon: Icon,
        href,
        isMain,
        colorClass,
    }) => (
        <Link
            href={href}
            className={`flex flex-col p-8 rounded-2xl border ${isMain
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100"
                    : "bg-white border-gray-200 text-gray-600 shadow-sm"
                } hover:scale-[1.02] transition-all`}
        >
            <div className="flex flex-col h-full gap-6">
                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${isMain ? "bg-white/10 text-white" : colorClass
                        }`}
                >
                    <Icon size={24} />
                </div>

                <div className="space-y-1">
                    <h3
                        className={`text-lg font-semibold ${isMain ? "text-white" : "text-gray-900"}`}
                    >
                        {label}
                    </h3>
                    <p
                        className={`text-sm leading-relaxed ${isMain ? "text-gray-400" : "text-gray-500"}`}
                    >
                        {description}
                    </p>
                </div>

                <div className="mt-auto pt-5 flex items-center justify-between border-t border-gray-100/10">
                    <span className="text-xs font-medium  tracking-wider opacity-70">
                        Explore System
                    </span>
                    <ArrowUpRight size={16} />
                </div>
            </div>
        </Link>
    );

    return (
        <AdminLayout>
            <Head title={`Discovery — ${agency.name}`} />

            <div className="min-h-screen bg-white pb-20 px-6 pt-8">
                <div className="max-w-6xl mx-auto space-y-10">
                    {/* Compact Header */}
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("admin.agencies.edit", agency.id)}
                            className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                System Discovery
                            </h1>
                            <p className="text-sm text-gray-500">
                                Agency:{" "}
                                <span className="text-gray-900 font-medium">
                                    {agency.name}
                                </span>
                            </p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Minimal Intro Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-3">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Select Protocol
                            </h2>
                            <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
                                Choose a specialized discovery system to begin
                                your audit. Each module provides specific
                                operational oversight.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px]  font-bold text-gray-400">
                                    Status
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    Active
                                </p>
                            </div>
                            <div className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px]  font-bold text-gray-400">
                                    Nodes
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    3 Units
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Discovery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DiscoveryActionCard
                            label="Chatter System"
                            description="Conversion protocols and response optimization."
                            icon={ShieldCheck}
                            href={route(
                                "admin.agencies.chatter-discovery",
                                agency.id,
                            )}
                            colorClass="bg-blue-50 text-blue-600"
                        />
                        <DiscoveryActionCard
                            label="QC System"
                            description="Quality control and subscriber satisfaction metrics."
                            icon={Crown}
                            isMain={true}
                            href={route(
                                "admin.agencies.qc-discovery",
                                agency.id,
                            )}
                        />
                        <DiscoveryActionCard
                            label="Owner System"
                            description="Administrator oversight and growth strategies."
                            icon={Users}
                            href={route(
                                "admin.agencies.owner-discovery",
                                agency.id,
                            )}
                            colorClass="bg-emerald-50 text-emerald-600"
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
