import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Users,
    UserPlus,
    Trash2,
    Search,
    UserCircle,
    Plus,
    Shield,
    Star,
    UserCheck,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Registry({ agency, chatters, creators }) {
    const [chatterSearch, setChatterSearch] = useState("");
    const [creatorSearch, setCreatorSearch] = useState("");

    const chatterForm = useForm({
        name: "",
    });

    const creatorForm = useForm({
        name: "",
    });

    const handleAddChatter = (e) => {
        e.preventDefault();
        chatterForm.post(route("admin.agencies.chatters.store", agency.id), {
            onSuccess: () => {
                chatterForm.reset();
                toast.success("Chatter added to registry");
            },
        });
    };

    const handleAddCreator = (e) => {
        e.preventDefault();
        creatorForm.post(route("admin.agencies.creators.store", agency.id), {
            onSuccess: () => {
                creatorForm.reset();
                toast.success("Creator added to registry");
            },
        });
    };

    const handleDeleteChatter = (id) => {
        if (confirm("Are you sure you want to remove this chatter?")) {
            useForm().delete(route("admin.chatters.destroy", id), {
                onSuccess: () => toast.success("Chatter removed"),
            });
        }
    };

    const handleDeleteCreator = (id) => {
        if (confirm("Are you sure you want to remove this creator?")) {
            useForm().delete(route("admin.creators.destroy", id), {
                onSuccess: () => toast.success("Creator removed"),
            });
        }
    };

    const filteredChatters = chatters.filter((c) =>
        c.name.toLowerCase().includes(chatterSearch.toLowerCase()),
    );

    const filteredCreators = creators.filter((c) =>
        c.name.toLowerCase().includes(creatorSearch.toLowerCase()),
    );

    return (
        <AdminLayout>
            <Head title={`Registry Manager — ${agency.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route("admin.agencies.edit", agency.id)}
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Agency
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Registry Manager
                            </h1>
                            <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium rounded-full shadow-lg shadow-indigo-200">
                                {agency.name}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage chatters and creators associated with this
                            agency
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        {/* Stats Bar */}
                        <div className="grid grid-cols-2 border-b border-gray-200">
                            <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100/50 border-r border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center text-white shadow-md">
                                        <Users size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-indigo-600  tracking-wider">
                                            Total Chatters
                                        </p>
                                        <p className="text-2xl font-semibold text-indigo-900">
                                            {chatters.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white shadow-md">
                                        <Star size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-purple-600  tracking-wider">
                                            Total Creators
                                        </p>
                                        <p className="text-2xl font-semibold text-purple-900">
                                            {creators.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                            {/* Chatter Manager */}
                            <div className="p-6 space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center text-white">
                                        <Users size={16} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Chatter Management
                                    </h2>
                                </div>

                                {/* Add Chatter Form */}
                                <form
                                    onSubmit={handleAddChatter}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                            Add New Chatter
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter chatter name"
                                                value={chatterForm.data.name}
                                                onChange={(e) =>
                                                    chatterForm.setData(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all outline-none"
                                            />
                                            <button
                                                type="submit"
                                                disabled={
                                                    chatterForm.processing ||
                                                    !chatterForm.data.name
                                                }
                                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-800 shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                            >
                                                <Plus size={16} />
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {/* Search */}
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search chatters..."
                                        value={chatterSearch}
                                        onChange={(e) =>
                                            setChatterSearch(e.target.value)
                                        }
                                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                                    />
                                </div>

                                {/* Chatter List */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-700">
                                            Current Chatters
                                        </h3>
                                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                                            {filteredChatters.length} total
                                        </span>
                                    </div>

                                    {filteredChatters.length > 0 ? (
                                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                            {filteredChatters.map((chatter) => (
                                                <div
                                                    key={chatter.id}
                                                    className="group flex items-center justify-between p-3 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-lg transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center text-indigo-600">
                                                            <UserCircle
                                                                size={18}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">
                                                            {chatter.name}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteChatter(
                                                                chatter.id,
                                                            )
                                                        }
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Remove chatter"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <UserCheck
                                                size={32}
                                                className="mx-auto text-gray-300 mb-2"
                                            />
                                            <p className="text-sm text-gray-500">
                                                {chatterSearch
                                                    ? "No matching chatters found"
                                                    : "No chatters added yet"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Creator Manager */}
                            <div className="p-6 space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white">
                                        <Star size={16} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Creator Management
                                    </h2>
                                </div>

                                {/* Add Creator Form */}
                                <form
                                    onSubmit={handleAddCreator}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                            Add New Creator
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter creator name"
                                                value={creatorForm.data.name}
                                                onChange={(e) =>
                                                    creatorForm.setData(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all outline-none"
                                            />
                                            <button
                                                type="submit"
                                                disabled={
                                                    creatorForm.processing ||
                                                    !creatorForm.data.name
                                                }
                                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                            >
                                                <Plus size={16} />
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {/* Search */}
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search creators..."
                                        value={creatorSearch}
                                        onChange={(e) =>
                                            setCreatorSearch(e.target.value)
                                        }
                                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                                    />
                                </div>

                                {/* Creator List */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-700">
                                            Current Creators
                                        </h3>
                                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                            {filteredCreators.length} total
                                        </span>
                                    </div>

                                    {filteredCreators.length > 0 ? (
                                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                            {filteredCreators.map((creator) => (
                                                <div
                                                    key={creator.id}
                                                    className="group flex items-center justify-between p-3 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 rounded-lg transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center text-purple-600">
                                                            <UserCircle
                                                                size={18}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                                                            {creator.name}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteCreator(
                                                                creator.id,
                                                            )
                                                        }
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Remove creator"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <Star
                                                size={32}
                                                className="mx-auto text-gray-300 mb-2"
                                            />
                                            <p className="text-sm text-gray-500">
                                                {creatorSearch
                                                    ? "No matching creators found"
                                                    : "No creators added yet"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Shield
                                size={16}
                                className="text-indigo-600 shrink-0 mt-0.5"
                            />
                            <div>
                                <h4 className="text-sm font-medium text-indigo-900 mb-1">
                                    Registry Management
                                </h4>
                                <p className="text-xs text-indigo-700">
                                    Add and manage chatters and creators
                                    associated with this agency. These users
                                    will be available for assignment in audits
                                    and quality control processes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
