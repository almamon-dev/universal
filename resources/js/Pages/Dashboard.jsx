import UserLayout from "@/Layouts/UserLayout.jsx";
import { Head, usePage } from "@inertiajs/react";
import {
    Briefcase,
    BarChart,
    FileText,
    MessageSquare,
    ArrowUpRight,
    Clock,
    CheckCircle,
} from "lucide-react";

export default function Dashboard({ dashboard_data }) {
    const user = usePage().props.auth.user;

    const iconMap = {
        Briefcase: Briefcase,
        BarChart: BarChart,
        FileText: FileText,
        MessageSquare: MessageSquare,
    };

    const stats = dashboard_data?.stats || [
        {
            title: "Active Services",
            value: "0",
            subtitle: "No Active Services",
            icon: "Briefcase",
            color: "bg-purple-600",
        },
    ];

    const activities = dashboard_data?.activities || [];

    return (
        <UserLayout>
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {user.name}
                    </h1>
                    <p className="text-gray-400">
                        Here's What's Happening With Your Marketing Campaigns
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-[#18181B] border border-[#27272A] p-6 rounded-2xl flex flex-col justify-between h-40 group hover:border-[#3F3F46] transition-colors relative overflow-hidden"
                        >
                            {/* Background Glow */}
                            <div
                                className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 ${stat.color}`}
                            ></div>

                            <div className="flex justify-between items-start z-10">
                                <span className="text-gray-400 font-medium text-sm">
                                    {stat.title}
                                </span>
                                <div
                                    className={`p-2 rounded-lg ${stat.color} bg-opacity-10 text-white`}
                                >
                                    <stat.icon size={18} />
                                </div>
                            </div>

                            <div className="z-10">
                                <h3 className="text-3xl font-bold text-white mb-1">
                                    {stat.value}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium  tracking-wide">
                                    {stat.subtitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">
                        Recent Activity
                    </h2>

                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <div
                                key={index}
                                className="bg-[#0F0F12] border border-[#27272A] p-4 rounded-xl flex items-center justify-between hover:bg-[#1f1f23] transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-3 h-3 rounded-full ${activity.color} shadow-[0_0_10px_rgba(139,92,246,0.5)]`}
                                    ></div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm group-hover:text-gray-200 transition-colors">
                                            {activity.title}
                                        </h4>
                                        <p className="text-gray-500 text-xs mt-0.5">
                                            {activity.description}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-gray-500 text-xs font-medium">
                                    {activity.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
