import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    ChevronDown,
} from "lucide-react";

export default function UserLayout({ children }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navigation = [
        {
            name: "Dashboard",
            href: route("dashboard"),
            icon: LayoutDashboard,
            active: route().current("dashboard"),
        },
        // Add more user-specific routes here
    ];

    return (
        <div className="min-h-screen bg-[#09090B] text-gray-100 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-[#0F0F12] border-r border-[#1F1F23] z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo Section */}
                    <div className="h-16 flex items-center px-6 border-b border-[#1F1F23]">
                        <Link
                            href="/"
                            className="flex items-center gap-2 group"
                        >
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] group-hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all">
                                <LayoutDashboard size={20} />
                            </div>
                            <span className="font-bold text-lg tracking-tight">
                                PPHJobDone
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                                    item.active
                                        ? "bg-purple-600/10 text-purple-400 border border-purple-600/20"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <item.icon
                                    size={18}
                                    className={
                                        item.active
                                            ? "text-purple-400"
                                            : "group-hover:text-white"
                                    }
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-[#1F1F23]">
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-[#0F0F12]/80 backdrop-blur-md border-b border-[#1F1F23] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
                    <button
                        className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="ml-auto flex items-center gap-4">
                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-all"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold border border-white/10">
                                    {auth.user.name.charAt(0)}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium leading-none text-white">
                                        {auth.user.name}
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        {auth.user.email}
                                    </p>
                                </div>
                                <ChevronDown
                                    size={14}
                                    className={`text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl py-2 z-20 overflow-hidden">
                                        <Link
                                            href={route("profile.edit")}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5"
                                            onClick={() =>
                                                setIsProfileOpen(false)
                                            }
                                        >
                                            <User size={16} /> Profile Settings
                                        </Link>
                                        <div className="h-px bg-[#27272A] my-1" />
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/5 text-left"
                                        >
                                            <LogOut size={16} /> Sign Out
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
