import UserLayout from "@/Layouts/UserLayout.jsx";
import { Head, usePage } from "@inertiajs/react";
import {
    Briefcase,
    BarChart as LucideBarChart,
    FileText,
    MessageSquare,
    ArrowUpRight,
    Clock,
    CheckCircle,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function Dashboard({ dashboard_data }) {
    const user = usePage().props.auth.user;

    const iconMap = {
        Briefcase: Briefcase,
        BarChart: LucideBarChart,
        FileText: FileText,
        MessageSquare: MessageSquare,
    };

    const stats = dashboard_data?.stats || [];
    const graphData = dashboard_data?.graph_data || [];
    const activities = dashboard_data?.activities || [];

    return (
        <UserLayout>
            <Head title="Dashboard" />

            <div className="space-y-8 pb-10">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        Welcome back, {user.name}
                    </h1>
                    <p className="text-gray-400 font-medium">
                        Here's what's happening with your marketing campaigns
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = iconMap[stat.icon] || Briefcase;
                        return (
                            <div
                                key={index}
                                className="bg-[#18181B] border border-[#27272A] p-6 rounded-2xl flex flex-col justify-between h-40 group hover:border-[#3F3F46] transition-all relative overflow-hidden shadow-xl"
                            >
                                {/* Background Glow */}
                                <div
                                    className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${stat.color}`}
                                ></div>

                                <div className="flex justify-between items-start z-10">
                                    <span className="text-gray-400 font-black text-[11px]  tracking-[0.2em]">
                                        {stat.title}
                                    </span>
                                    <div
                                        className={`p-2.5 rounded-xl ${stat.color} bg-opacity-20 text-white group-hover:scale-110 transition-transform`}
                                    >
                                        <Icon size={18} />
                                    </div>
                                </div>

                                <div className="z-10">
                                    <h3 className="text-4xl font-black text-white mb-1 tracking-tighter">
                                        {stat.value}
                                    </h3>
                                    <p className="text-[11px] text-gray-500 font-bold  tracking-widest flex items-center gap-1.5">
                                        <ArrowUpRight size={12} className="text-emerald-500" />
                                        {stat.subtitle}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Graph Section */}
                <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8 z-10 relative">
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">Growth Analytics</h2>
                            <p className="text-xs text-gray-500 font-semibold mt-1  tracking-widest opacity-60">Performance Trends • Last 7 Days</p>
                        </div>
                        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-[10px] font-black  tracking-widest">
                            Real-time
                        </div>
                    </div>

                    <div className="h-[220px] w-full z-10 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272A" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#71717A', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#71717A', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181B',
                                        borderRadius: '16px',
                                        border: '1px solid #27272A',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        padding: '12px'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#8B5CF6"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 0 }}
                                    activeDot={{ r: 8, fill: '#8B5CF6', strokeWidth: 4, stroke: '#18181B' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-black text-white mb-8 tracking-tight">Recent Activity</h2>

                    <div className="space-y-4">
                        {activities.length > 0 ? (
                            activities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="bg-[#0F0F12] border border-[#27272A] p-5 rounded-2xl flex items-center justify-between hover:bg-black/50 transition-all group border-l-4 border-l-indigo-600"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/5">
                                            <LucideBarChart size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black text-sm group-hover:text-indigo-400 transition-colors  tracking-tight">
                                                {activity.title}
                                            </h4>
                                            <p className="text-gray-500 text-xs mt-1 font-semibold">
                                                {activity.description}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-black  tracking-widest opacity-60">
                                        {activity.time}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-10 text-gray-600 font-black  tracking-widest opacity-20">No Recent Activity Found</p>
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
