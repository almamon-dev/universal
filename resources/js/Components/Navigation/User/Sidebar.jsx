import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    LogOut,
    BookOpen,
    FileSpreadsheet,
    Plus,
    Inbox,
    FileText,
} from "lucide-react";

export default function UserSidebar({ isSidebarOpen, setIsSidebarOpen }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const navigation = [
        {
            name: "Dashboard",
            href: route("qc.dashboard"),
            icon: LayoutDashboard,
            active: route().current("qc.dashboard"),
        },
    ];

    if (user?.agency_id && user?.role !== "admin") {
        navigation.push({
            name: "Audit Forms",
            href: route("qc.agencies.audits.create", user.agency_id),
            icon: Inbox,
            active: route().current("qc.agencies.audits.create"),
        });
        navigation.push({
            name: "Agency Protocols",
            href: route("qc.agencies.protocols", user.agency_id),
            icon: FileText,
            active: route().current("qc.agencies.protocols"),
        });
    }

    return (
        <aside
            className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 z-50 transition-transform duration-300 ${isSidebarOpen
                    ? "translate-x-0 shadow-2xl"
                    : "-translate-x-full lg:translate-x-0"
                }`}
        >
            <div className="h-full flex flex-col">
                {/* Logo Section */}
                <div className="h-16 flex items-center px-8 border-b border-gray-50 mb-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 bg-[#18181b] rounded-md flex items-center justify-center text-white shadow-lg shadow-black/5 transition-all group-hover:scale-105 active:scale-95">
                            <LayoutDashboard size={22} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-black text-[13px] leading-tight tracking-[0.15em] ">
                                QC
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold  tracking-[0.2em]">
                                Dashboard
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-md text-[14px] font-bold transition-all duration-200 group relative
                                ${item.active
                                    ? "bg-[#18181b] text-white shadow-lg shadow-black/5"
                                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                                }
                            `}
                        >
                            <div
                                className={
                                    item.active
                                        ? "text-white"
                                        : "text-gray-400 group-hover:text-black transition-colors"
                                }
                            >
                                <item.icon size={20} />
                            </div>
                            <span className="tracking-tight">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-6 border-t border-gray-50 mb-2">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-bold text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
