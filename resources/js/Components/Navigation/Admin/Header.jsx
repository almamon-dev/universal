import React, { useState, useRef, useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import {
    Menu,
    ChevronDown,
    LogOut,
    User,
    Settings,
    Bell,
    Search,
} from "lucide-react";

const Header = ({ onMenuClick }) => {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        router.post(route("logout"));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-6 sticky top-0 z-[100] transition-all duration-300">
            {/* Mobile Toggle */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
            >
                <Menu size={20} />
            </button>

            {/* Breadcrumbs or Title - Hidden on small screens */}
            <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-gray-400 font-medium">Pages</span>
                <span className="text-gray-300">/</span>
                <span className="text-gray-900 font-bold">Dashboard</span>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 ml-auto">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                    <Bell size={18} />
                </button>

                <div className="h-6 w-px bg-gray-100 mx-1"></div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2.5 p-1 px-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                    >
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 shadow-sm transition-transform active:scale-95">
                            <img
                                src={
                                    auth?.user?.profile_photo_url ||
                                    `https://ui-avatars.com/api/?name=${auth?.user?.name}&background=18181b&color=fff&bold=true`
                                }
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="hidden sm:block text-left leading-tight">
                            <p className="text-xs font-bold text-gray-900">
                                {auth?.user?.name}
                            </p>
                            <p className="text-[10px] text-gray-400 font-semibold">
                                Admin
                            </p>
                        </div>
                        <ChevronDown
                            size={14}
                            className={`text-gray-300 transition-transform duration-300 ${open ? "rotate-180 text-gray-900" : ""}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {open && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 z-[200] animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="px-3 py-2 border-b border-gray-50 mb-1">
                                <p className="text-[10px] font-bold text-gray-400 mb-1">
                                    Signed in as
                                </p>
                                <p className="text-xs font-semibold text-gray-900 truncate">
                                    {auth?.user?.email}
                                </p>
                            </div>



                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-all"
                            >
                                <LogOut size={14} />
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
