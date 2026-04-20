import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { LayoutGrid, Plus, LogOut, Shield, FileText } from "lucide-react";

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
    const { url } = usePage();
    const currentPath = url.split("?")[0];

    const { auth } = usePage().props;
    const user = auth.user;

    // Admin-only menu items
    const menuItems = [
        {
            label: "Dashboard",
            path: route("admin.dashboard"),
            icon: <LayoutGrid size={20} />,
            active: route().current("admin.dashboard"),
        },
        {
            label: "Create Agency",
            path: route("admin.agencies.create"),
            icon: <Plus size={20} />,
            active: route().current("admin.agencies.create"),
        },
    ];

    return (
        <div className={`flex flex-col h-full bg-white relative border-r border-gray-100 transition-all duration-300 ${isCollapsed ? "w-[80px]" : "w-[260px]"}`}>
            {/* Logo Section */}
            <div className={`pt-3 pb-1 transition-all duration-300 flex flex-col items-center ${isCollapsed ? "px-2" : "px-4"}`}>
                <Link
                    href={route("admin.dashboard")}
                    className="flex flex-col items-center group transition-all duration-300"
                >
                    <div className={`transition-all duration-500 group-hover:scale-110 ${isCollapsed ? "mb-0" : "mb-5"}`}>
                        <img
                            src="/img/2.png"
                            alt="Logo"
                            className={`w-auto object-contain transition-all duration-300 ${isCollapsed ? "h-10" : "h-20 mb-2"}`}
                        />
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-3">
                {menuItems.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.path}
                        className={`
                            flex items-center gap-3 py-3.5 px-6 rounded-2xl transition-all duration-200 group
                            ${item.active
                                ? "bg-black text-white shadow-xl shadow-black/10"
                                : "text-gray-500 hover:bg-gray-50 hover:text-black"
                            }
                        `}
                    >
                        <div
                            className={
                                item.active
                                    ? "text-white"
                                    : "text-gray-400 group-hover:text-black"
                            }
                        >
                            {item.icon}
                        </div>
                        {!isCollapsed && (
                            <span className="font-bold text-[15px] tracking-tight animate-in fade-in slide-in-from-left-2 duration-300">
                                {item.label}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Logout - Fixed at bottom */}
            <div className="mt-auto p-6 mb-2">
                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="flex items-center gap-3 py-3 px-4 rounded-xl text-[#FF6B6B] hover:bg-red-50 transition-all duration-200 font-bold text-[15px]"
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">Log Out</span>}
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
