import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    CircleDollarSign,
    ArrowRightLeft,
    MonitorPlay,
    ShieldCheck,
    Users,
    Crown,
    ArrowUpRight,
    TrendingUp,
    Sparkles,
    Zap,
    Target,
    Activity,
} from "lucide-react";

export default function ViewSystemDiscovery({ agency }) {
    const StatsCard = ({ label, value, icon: Icon, gradient, color }) => (
        <div className="relative group">
            {/* Animated background gradient */}
            <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500`}
            />

            <div className="relative bg-white p-6 rounded-xl border border-gray-200 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-xl">
                <div className="flex items-start justify-between">
                    <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-10 flex items-center justify-center text-white shadow-lg`}
                    >
                        <Icon size={24} className={color} />
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                        <Activity size={12} className="text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">
                            Live
                        </span>
                    </div>
                </div>

                <div className="mt-4 space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {label}
                    </p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                            ${Number(value || 0).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400">avg</span>
                    </div>
                </div>

                {/* Mini trend indicator */}
                <div className="mt-4 flex items-center gap-1 text-emerald-600">
                    <TrendingUp size={14} />
                    <span className="text-xs font-medium">
                        +12.5% vs last month
                    </span>
                </div>
            </div>
        </div>
    );

    const DiscoveryActionCard = ({
        label,
        description,
        icon: Icon,
        href,
        gradient,
        badge,
        isMain,
    }) => (
        <Link
            href={href}
            className={`relative group block h-full ${
                isMain
                    ? "transform hover:-translate-y-1"
                    : "hover:-translate-y-0.5"
            } transition-all duration-300`}
        >
            {/* Main Card */}
            <div
                className={`relative h-full p-6 rounded-xl border transition-all duration-300 overflow-hidden
                    ${
                        isMain
                            ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-transparent shadow-xl hover:shadow-2xl"
                            : "bg-white border-gray-200 hover:border-transparent hover:shadow-xl"
                    }`}
            >
                {/* Animated background pattern for main card */}
                {isMain && (
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent transform rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                    {/* Icon and Badge */}
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                isMain
                                    ? "bg-white/20 text-white"
                                    : `bg-gradient-to-br ${gradient} bg-opacity-10 text-gray-900`
                            }`}
                        >
                            <Icon
                                size={24}
                                className={isMain ? "text-white" : ""}
                            />
                        </div>
                        {badge && (
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    isMain
                                        ? "bg-white/20 text-white"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {badge}
                            </span>
                        )}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                        <h3
                            className={`text-lg font-semibold mb-2 ${
                                isMain ? "text-white" : "text-gray-900"
                            }`}
                        >
                            {label}
                        </h3>
                        <p
                            className={`text-sm leading-relaxed ${
                                isMain ? "text-white/80" : "text-gray-500"
                            }`}
                        >
                            {description}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-current border-opacity-10 flex items-center justify-between">
                        <span
                            className={`text-xs font-medium ${
                                isMain ? "text-white/90" : "text-gray-600"
                            }`}
                        >
                            Explore Protocol
                        </span>
                        <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1 ${
                                isMain
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-100 text-gray-700 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white"
                            }`}
                        >
                            <ArrowUpRight size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <AdminLayout>
            <Head title={`System Discovery — ${agency.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route("admin.agencies.edit", agency.id)}
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Agency
                        </Link>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        System Discovery
                                    </h1>
                                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium rounded-full shadow-lg shadow-emerald-200">
                                        Live Strategy
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {agency.name} • Real-time performance
                                    metrics
                                </p>
                            </div>

                            <Link
                                href={route("admin.agencies.edit", agency.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all"
                            >
                                <Zap size={16} />
                                Update Settings
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <StatsCard
                            label="Initial Paywall"
                            value={agency.first_paywall_sexting}
                            icon={CircleDollarSign}
                            gradient="from-blue-600 to-cyan-600"
                            color="text-blue-600"
                        />
                        <StatsCard
                            label="Sequence Average"
                            value={agency.avg_completed_sexting_sequence}
                            icon={ArrowRightLeft}
                            gradient="from-purple-600 to-pink-600"
                            color="text-purple-600"
                        />
                        <StatsCard
                            label="Pre-recorded PPV"
                            value={agency.avg_recorded_ppn}
                            icon={MonitorPlay}
                            gradient="from-orange-600 to-red-600"
                            color="text-orange-600"
                        />
                    </div>

                    {/* Discovery Sections */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Protocol Explorations
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DiscoveryActionCard
                                label="Chatter System"
                                description="Deep dive into chatter conversion protocols and response optimization workflows."
                                icon={ShieldCheck}
                                href={route(
                                    "admin.agencies.chatter-discovery",
                                    agency.id,
                                )}
                                gradient="from-blue-600 to-cyan-600"
                                badge="Performance"
                            />

                            <DiscoveryActionCard
                                label="QC System"
                                description="Audit high-level quality control mechanics and subscriber satisfaction metrics."
                                icon={Crown}
                                isMain={true}
                                href={route(
                                    "admin.agencies.qc-discovery",
                                    agency.id,
                                )}
                                gradient="from-indigo-600 via-purple-600 to-pink-600"
                                badge="Featured"
                            />

                            <DiscoveryActionCard
                                label="Owner System"
                                description="Review administrator oversight controls and high-level agency growth strategies."
                                icon={Users}
                                href={route(
                                    "admin.agencies.owner-discovery",
                                    agency.id,
                                )}
                                gradient="from-emerald-600 to-teal-600"
                                badge="Strategic"
                            />
                        </div>
                    </div>

                    {/* Quick Stats Footer */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                <Target size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Conversion Rate
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    68.5%
                                </p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center text-white">
                                <Activity size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Active Chatters
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    24
                                </p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center text-white">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Quality Score
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    92
                                </p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white">
                                <TrendingUp size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Monthly Growth
                                </p>
                                <p className="text-sm font-semibold text-emerald-600">
                                    +15.3%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
