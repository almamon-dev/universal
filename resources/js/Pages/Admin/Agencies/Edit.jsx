import AdminLayout from "@/Layouts/AdminLayout";
import UserLayout from "@/Layouts/UserLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import {
    ArrowLeft,
    Save,
    Plus,
    X,
    ArrowUpRight,
    User as UserIcon,
    FileText,
    Trash2,
    Search,
    Eye,
    Calendar,
    Settings,
    BookOpen,
    Users,
    ChevronDown,
    Activity,
    List,
    Monitor,
    Hash,
    Edit2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const TIMEZONES = {
    "United States & Canada": [
        "Eastern Time (New York, Toronto)",
        "Central Time (Chicago, Mexico City)",
        "Mountain Time (Denver, Phoenix)",
        "Pacific Time (Los Angeles, Vancouver)",
        "Alaska Time (Anchorage)",
        "Hawaii Time (Honolulu)",
    ],
    "Europe - Western": ["UK (London, Dublin)", "Portugal (Lisbon)", "Iceland (Reykjavik)"],
    "Europe - Central": [
        "France (Paris)",
        "Germany (Berlin, Frankfurt)",
        "Italy (Rome, Milan)",
        "Spain (Madrid, Barcelona)",
        "Netherlands (Amsterdam)",
        "Belgium (Brussels)",
        "Austria (Vienna)",
        "Czech Republic (Prague)",
        "Sweden (Stockholm)",
        "Norway (Oslo)",
        "Denmark (Copenhagen)",
        "Switzerland (Zurich)",
        "Poland (Warsaw)",
    ],
    "Europe - Eastern": [
        "Greece (Athens)",
        "Romania (Bucharest)",
        "Finland (Helsinki)",
        "Ukraine (Kyiv)",
        "Turkey (Istanbul)",
        "Russia (Moscow)",
    ],
    "Middle East & Africa": [
        "UAE (Dubai, Abu Dhabi)",
        "Saudi Arabia (Riyadh)",
        "Qatar (Doha)",
        "Kuwait",
        "Bahrain",
        "Iran (Tehran)",
        "Israel (Jerusalem)",
        "South Africa (Johannesburg)",
        "Nigeria (Lagos)",
        "Kenya (Nairobi)",
        "Morocco (Casablanca)",
    ],
    "Asia - East": [
        "Japan (Tokyo, Osaka)",
        "South Korea (Seoul)",
        "China (Beijing, Shanghai)",
        "Hong Kong",
        "Taiwan (Taipei)",
    ],
    "Asia - Southeast": [
        "Singapore",
        "Philippines (Manila)",
        "Thailand (Bangkok)",
        "Indonesia (Jakarta)",
        "Malaysia (Kuala Lumpur)",
        "Vietnam (Ho Chi Minh)",
    ],
    "Asia - South": [
        "India (Mumbai, Delhi, Bangalore)",
        "Pakistan (Karachi)",
        "Bangladesh (Dhaka)",
        "Sri Lanka (Colombo)",
    ],
    Oceania: [
        "Australia East (Sydney, Melbourne)",
        "Australia Queensland (Brisbane)",
        "Australia Central (Adelaide)",
        "Australia West (Perth)",
        "New Zealand (Auckland)",
        "Fiji",
    ],
    "South America": [
        "Brazil (São Paulo, Rio)",
        "Argentina (Buenos Aires)",
        "Chile (Santiago)",
        "Colombia (Bogotá)",
        "Peru (Lima)",
        "Venezuela (Caracas)",
    ],
    Other: ["UTC (Coordinated Universal Time)", "GMT (Greenwich Mean Time)"],
};

export default function Edit({
    agency,
    stats,
    audits = [],
    chatters = [],
    auth,
    filters = {},
}) {
    const user = auth?.user;
    const isAdmin = user?.role === "admin";
    const canEdit = isAdmin;
    const isEditing = !!agency?.id;
    const [view, setView] = useState(isEditing ? "hub" : "form");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFrom, setDateFrom] = useState(filters.date_from || "");
    const [dateTo, setDateTo] = useState(filters.date_to || "");

    const [expandedAuditId, setExpandedAuditId] = useState(null);

    const handleFilter = () => {
        router.get(
            route("admin.agencies.edit", agency.id),
            { date_from: dateFrom, date_to: dateTo },
            { preserveState: true, preserveScroll: true },
        );
    };

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        delete: destroy,
    } = useForm({
        name: agency?.name || "",
        timezone: agency?.timezone || "",
        first_paywall_sexting: agency?.first_paywall_sexting || "",
        avg_completed_sexting_sequence:
            agency?.avg_completed_sexting_sequence || "",
        avg_recorded_ppv: agency?.avg_recorded_ppv || "",
        status: agency?.status || "active",
        qcs: agency?.qcs || [],
    });

    const [showQCForm, setShowQCForm] = useState(false);
    const [editingQCId, setEditingQCId] = useState(null);
    const [qcFields, setQCFields] = useState({
        name: "",
        username: "",
        password: "",
    });
    const [showAudits, setShowAudits] = useState(false);

    const [selectedChatter, setSelectedChatter] = useState("all");

    // Sync form data when agency props change (for instant QC saves)
    useEffect(() => {
        if (agency?.qcs) {
            setData("qcs", agency.qcs);
        }
    }, [agency?.qcs]);

    const handleAddQC = () => {
        if (!agency?.id) {
            toast.error("Please save the agency first before adding QC members.");
            return;
        }

        if (!qcFields.name || !qcFields.username || !qcFields.password) {
            toast.error("Please fill in all QC details");
            return;
        }

        router.post(route("admin.agencies.qcs.store", agency.id), qcFields, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setQCFields({ name: "", username: "", password: "" });
            },
            onError: (err) => {
                Object.values(err).forEach((msg) => toast.error(msg));
            },
        });
    };

    const handleEditQC = (qc) => {
        setQCFields({
            name: qc.name,
            username: qc.username,
            password: "", // Leave blank if not changing
        });
        setEditingQCId(qc.id);
        // Modal is already open to show the list, but we ensure form is visible
    };

    const handleUpdateQC = () => {
        if (!qcFields.name || !qcFields.username) {
            toast.error("Name and Username are required");
            return;
        }

        router.put(route("admin.agencies.qcs.update", editingQCId), qcFields, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setQCFields({ name: "", username: "", password: "" });
                setEditingQCId(null);
                toast.success("QC member updated successfully");
            },
            onError: (err) => {
                Object.values(err).forEach((msg) => toast.error(msg));
            },
        });
    };

    const handleRemoveQC = (id) => {
        if (confirm("Are you sure you want to remove this QC member?")) {
            router.delete(route("admin.agencies.qcs.destroy", id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success("QC member removed successfully");
                },
                onError: (err) => {
                    Object.values(err).forEach((msg) => toast.error(msg));
                },
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("SUBMITTING AGENCY DATA:", data);

        const options = {
            onBefore: () => console.log("Request starting..."),
            onStart: () => console.log("Request in progress..."),
            onProgress: (progress) => console.log("Upload progress:", progress),
            onSuccess: (page) => {
                console.log("Request successful:", page);
            },
            onError: (errors) => {
                console.error("Request failed with errors:", errors);
            },
            onFinish: () => console.log("Request finished"),
        };

        if (isEditing) {
            console.log(
                "SENDING PUT REQUEST TO:",
                route("admin.agencies.update", agency.id),
            );
            put(route("admin.agencies.update", agency.id), options);
        } else {
            console.log(
                "SENDING POST REQUEST TO:",
                route("admin.agencies.store"),
            );
            post(route("admin.agencies.store"), options);
        }
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this agency?")) {
            destroy(route("admin.agencies.destroy", agency.id));
        }
    };

    // Minimal Action Box Component
    const ActionBox = ({
        icon: Icon,
        label,
        href,
        onClick,
        color = "text-gray-600",
    }) => {
        const content = (
            <div className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-300 transition-all duration-200 cursor-pointer">
                <div
                    className={`w-10 h-10 flex items-center justify-center ${color}`}
                >
                    <Icon size={20} strokeWidth={1.5} />
                </div>
                <span className="text-[12px] font-medium text-gray-700 text-center">
                    {label}
                </span>
            </div>
        );

        if (href)
            return (
                <Link href={href} className="w-full">
                    {content}
                </Link>
            );
        return (
            <div onClick={onClick} className="w-full">
                {content}
            </div>
        );
    };

    // Minimal Audit Card Component
    const AuditCard = ({ audit, isExpanded, onToggle }) => {
        const formatKey = (key) => {
            if (!key) return "";
            let cleanKey = key.replace(/[^a-zA-Z0-9_-]/g, " ").trim();
            return cleanKey
                .split(/[-_\s]/)
                .map(
                    (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase(),
                )
                .join(" ");
        };

        return (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200">
                {/* Header */}
                <div
                    onClick={onToggle}
                    className="p-5 flex flex-wrap items-start justify-between gap-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                    <div className="flex-1 min-w-[200px]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">#subscriber UI</p>
                        <p className="text-sm font-semibold text-indigo-600">{audit.subscriber_uid || "N/A"}</p>
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{audit.user?.name || "qc3"}</p>
                                <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                                    {new Date(audit.created_at).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </p>
                            </div>
                            <ChevronDown
                                size={18}
                                className={`text-gray-300 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Info Boxes */}
                <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                        <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center text-indigo-500 border border-gray-100">
                            <UserIcon size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Chatter Name</p>
                            <p className="text-sm font-semibold text-gray-900">{audit.chatter?.name || "David Martinez"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                        <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center text-indigo-500 border border-gray-100">
                            <Monitor size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Creator Name</p>
                            <p className="text-sm font-semibold text-gray-900">{audit.creator?.name || "John Smith"}</p>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="border-t border-gray-100 bg-gray-50/30"
                        >
                            <div className="p-5 space-y-2">
                                {Object.entries(audit.response_data || {}).map(
                                    ([key, value]) => {
                                        if (!key || key.includes('""') || key === "null") return null;

                                        let displayValue = value;
                                        if (typeof value === "boolean") {
                                            displayValue = value ? "Yes" : "No";
                                        } else if (typeof value === "object" && value !== null) {
                                            displayValue = JSON.stringify(value);
                                        } else {
                                            displayValue = value || "N/A";
                                        }

                                        return (
                                            <div
                                                key={key}
                                                className="flex items-start gap-4 py-2.5 border-b border-gray-100/50 last:border-0"
                                            >
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 w-36 shrink-0 pt-0.5">
                                                    {formatKey(key)}
                                                </span>
                                                <span className="text-[13px] font-medium text-gray-700 flex-1 leading-relaxed">
                                                    {displayValue}
                                                </span>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const Layout = isAdmin ? AdminLayout : UserLayout;

    return (
        <Layout>
            {view === "form" ? (
                <>
                    <Head title={isEditing ? `Edit ${agency.name}` : "Create Agency"} />
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <div className="mb-8">
                            <Link
                                href={route("admin.dashboard")}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-black transition-colors mb-4 group"
                            >
                                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                                Back to Dashboard
                            </Link>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        {isEditing ? `Edit ${agency.name}` : "Create New Agency"}
                                    </h1>
                                    <p className="text-sm text-zinc-500 mt-1">
                                        {isEditing ? "Update agency profile and operational parameters" : "Initialize a new agency profile and configure operational parameters"}
                                    </p>
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={() => setView("hub")}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-all"
                                    >
                                        <ArrowLeft size={16} />
                                        Back to Hub
                                    </button>
                                )}
                                {!canEdit && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black  tracking-widest rounded-lg border border-amber-100">
                                        <Shield size={12} />
                                        Read Only
                                    </span>
                                )}
                            </div>
                        </div>

                        {errors.error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-sm text-red-600 font-medium">
                                    {errors.error}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-sm font-semibold text-gray-900">
                                        Core Profile
                                    </h2>
                                    <p className="text-xs text-gray-400">Basic identification and regional settings</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Agency Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            disabled={!canEdit}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                                            placeholder="Enter agency name"
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Timezone
                                        </label>
                                        <select
                                            value={data.timezone}
                                            disabled={!canEdit}
                                            onChange={(e) =>
                                                setData(
                                                    "timezone",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-500 bg-white"
                                        >
                                            <option value="">Select Timezone</option>
                                            {Object.entries(TIMEZONES).map(([region, zones]) => (
                                                <optgroup key={region} label={region}>
                                                    {zones.map(zone => (
                                                        <option key={zone} value={zone}>{zone}</option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            value={data.status}
                                            disabled={!canEdit}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                                        >
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-sm font-semibold text-gray-900">
                                        Revenue Configuration
                                    </h2>
                                    <p className="text-xs text-gray-400">Set standardized pricing for automated reporting</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-500  tracking-wider mb-2">
                                            First Paywall Sexting
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                value={
                                                    data.first_paywall_sexting
                                                }
                                                disabled={!canEdit}
                                                onChange={(e) =>
                                                    setData(
                                                        "first_paywall_sexting",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Avg Completed Sexting Sequence
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                value={
                                                    data.avg_completed_sexting_sequence
                                                }
                                                disabled={!canEdit}
                                                onChange={(e) =>
                                                    setData(
                                                        "avg_completed_sexting_sequence",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Avg Recorded PPV
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                value={data.avg_recorded_ppv}
                                                disabled={!canEdit}
                                                onChange={(e) =>
                                                    setData(
                                                        "avg_recorded_ppv",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>                            {/* QC Management - Only show when editing an existing agency */}
                            {isEditing && (
                                <div className="bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-sm font-semibold text-gray-900">
                                                Quality Control Team
                                            </h2>
                                            <p className="text-xs text-gray-400">Manage specialized members for this agency</p>
                                        </div>
                                        {canEdit && (
                                            <button
                                                type="button"
                                                onClick={() => setShowQCForm(true)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-900 text-xs font-semibold rounded-md hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                                            >
                                                <Plus size={14} />
                                                Add Member
                                            </button>
                                        )}
                                    </div>
                                    <div className="p-6">

                                        {data.qcs.length > 0 ? (
                                            <div className="space-y-2">
                                                {data.qcs.map((qc, index) => (
                                                    <div
                                                        key={qc.id}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                    >
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {index + 1}. {qc.name}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            {canEdit && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleEditQC(
                                                                                qc,
                                                                            )
                                                                        }
                                                                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                                    >
                                                                        <Settings
                                                                            size={16}
                                                                        />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleRemoveQC(
                                                                                qc.id,
                                                                            )
                                                                        }
                                                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                                    >
                                                                        <Trash2
                                                                            size={16}
                                                                        />
                                                                    </button>
                                                                </>
                                                            )}
                                                            {!canEdit && (
                                                                <span className="text-[10px] font-bold text-gray-400  tracking-tight">
                                                                    Active Member
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center py-6 border border-dashed border-gray-200 rounded-lg">
                                                No QC members added yet
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="flex justify-end gap-3">
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:text-gray-900"
                                >
                                    Cancel
                                </Link>
                                {canEdit && (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-2 bg-indigo-600 text-white text-sm font-bold rounded-sm hover:bg-indigo-700 shadow-lg shadow-indigo-900/10 disabled:opacity-50 transition-all active:scale-95"
                                    >
                                        {processing
                                            ? "Saving..."
                                            : isEditing
                                                ? "Save Changes"
                                                : "Create Agency"}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </>
            ) : (                <div className="max-w-7xl mx-auto px-4 py-8">
                    <Head title={`${agency.name} - Agency Hub`} />

                    {/* Dashboard Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Link
                                    href={route("admin.dashboard")}
                                    className="text-xs font-semibold text-zinc-400 hover:text-black transition-colors"
                                >
                                    Agencies
                                </Link>
                                <span className="text-zinc-300 text-xs">/</span>
                                <span className="text-xs font-bold text-gray-900">{agency.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                    {agency.name}
                                </h1>
                                <span
                                    className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border ${agency.status === "active"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        : "bg-gray-50 text-gray-500 border-gray-200"
                                        }`}
                                >
                                    {agency.status === "active" ? "Operational" : "Paused"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setView("form")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-all"
                            >
                                <Edit2 size={16} />
                                Edit Profile
                            </button>
                            <Link
                                href={route("admin.agencies.audits", agency.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-900 text-sm font-semibold rounded-md hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <Settings size={16} className="text-gray-400" />
                                Configure Fields
                            </Link>
                            {canEdit && (
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-md transition-all active:scale-95"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Left Column - 3 cols */}
                        <div className="lg:col-span-3 space-y-6">
                            
                            {/* Date Filter Card */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                    Date Filter
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            onBlur={() => handleFilter()}
                                            className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            placeholder="From"
                                        />
                                        <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase">to</span>
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            onBlur={() => handleFilter()}
                                            className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            placeholder="To"
                                        />
                                        <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Stats */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                    Dashboard Stats
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-gray-50/50 border border-gray-200 rounded-lg">
                                        <p className="text-xs font-medium text-gray-500 mb-1">
                                            Total Audits
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats?.total_audits || 0}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50/50 border border-gray-200 rounded-lg">
                                        <p className="text-xs font-medium text-gray-500 mb-1">
                                            Sellable
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats?.sellable || 0}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50/50 border border-gray-200 rounded-lg">
                                        <p className="text-xs font-medium text-gray-500 mb-1">
                                            Non-Sellable
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats?.non_sellable || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Search size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by subscriber UID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                />
                            </div>

                            {/* Audits Accordion Section */}
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setShowAudits(!showAudits)}
                                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                            <Users size={20} />
                                        </div>
                                        <div className="text-left">
                                            <h2 className="text-base font-bold text-gray-900">
                                                Submitted Audits ({stats?.total_audits || audits.length})
                                            </h2>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                                Audit History Log
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={selectedChatter}
                                                onChange={(e) => setSelectedChatter(e.target.value)}
                                                className="pl-3 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-sm focus:outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="all">All Chatters</option>
                                                {chatters.map((chatter) => (
                                                    <option key={chatter.id} value={chatter.id}>
                                                        {chatter.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                        <ChevronDown
                                            size={20}
                                            className={`text-gray-300 transition-transform duration-300 ${showAudits ? "rotate-180" : ""}`}
                                        />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {showAudits && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="border-t border-gray-100"
                                        >
                                            <div className="p-5 space-y-4">
                                                {audits.length > 0 ? (
                                                    audits
                                                        .filter((a) => {
                                                            const matchesSearch = (a.subscriber_uid || "").toLowerCase().includes(searchTerm.toLowerCase());
                                                            const matchesChatter = selectedChatter === "all" || String(a.chatter_id) === String(selectedChatter);
                                                            return matchesSearch && matchesChatter;
                                                        })
                                                        .map((audit, idx) => (
                                                            <AuditCard
                                                                key={audit.id || idx}
                                                                audit={audit}
                                                                isExpanded={expandedAuditId === (audit.id || idx)}
                                                                onToggle={() => setExpandedAuditId(expandedAuditId === (audit.id || idx) ? null : (audit.id || idx))}
                                                            />
                                                        ))
                                                ) : (
                                                    <div className="text-center py-12 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                                                        <p className="text-gray-500 font-medium text-sm">No audits found</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right Column - Action Cards */}
                        <div className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <ActionBox
                                        icon={Search}
                                        label="Discovery"
                                        href={route("admin.agencies.discovery", agency.id)}
                                        color="text-blue-600"
                                    />
                                    <ActionBox
                                        icon={Eye}
                                        label="View"
                                        href={route("admin.agencies.view-system-discovery", agency.id)}
                                        color="text-emerald-600"
                                    />
                                    <ActionBox
                                        icon={Plus}
                                        label="Add QC"
                                        onClick={() => setShowQCForm(true)}
                                        color="text-amber-600"
                                    />
                                    <ActionBox
                                        icon={Settings}
                                        label="Fields"
                                        href={route("admin.agencies.audits", agency.id)}
                                        color="text-purple-600"
                                    />
                                    <ActionBox
                                        icon={FileText}
                                        label="Report"
                                        href={route("admin.report.weekly", agency.id)}
                                        color="text-pink-600"
                                    />
                                    <ActionBox
                                        icon={BookOpen}
                                        label="Protocols"
                                        href={route("admin.agencies.protocols", agency.id)}
                                        color="text-blue-600"
                                    />
                                </div>

                                <Link
                                    href={route("admin.agencies.registry", agency.id)}
                                    className="block w-full bg-black text-white text-center px-4 py-3 rounded-md text-sm font-bold hover:bg-zinc-800 transition-all shadow-sm mt-2"
                                >
                                    Chatter & Creator Manager
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* QC Modal */}
            <AnimatePresence>
                {showQCForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/20"
                            onClick={() => {
                                setShowQCForm(false);
                                setEditingQCId(null);
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white w-full max-w-2xl rounded-xl overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">
                                    {editingQCId
                                        ? "Edit QC Member"
                                        : "Add QC Member"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowQCForm(false);
                                        setEditingQCId(null);
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* Current QC List */}
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    <p className="text-xs font-medium text-gray-500  tracking-wider">
                                        Current Members
                                    </p>
                                    {(agency?.qcs || []).map((qc) => (
                                        <div
                                            key={qc.id}
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                        >
                                            <span className="text-sm text-gray-900">
                                                {qc.name} ({qc.username})
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() =>
                                                        handleEditQC(qc)
                                                    }
                                                    className="p-1 text-gray-500 hover:text-gray-700"
                                                >
                                                    <Settings size={14} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveQC(qc.id)
                                                    }
                                                    className="p-1 text-gray-500 hover:text-red-600"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {(agency?.qcs || []).length === 0 && (
                                        <p className="text-sm text-gray-400 italic">
                                            No members added yet.
                                        </p>
                                    )}
                                </div>

                                {/* Form */}
                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {editingQCId
                                            ? "Edit Member Details"
                                            : "Add New Member"}
                                    </h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={qcFields.name}
                                            onChange={(e) =>
                                                setQCFields({
                                                    ...qcFields,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="Enter name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={qcFields.username}
                                            onChange={(e) =>
                                                setQCFields({
                                                    ...qcFields,
                                                    username: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="Enter username"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={qcFields.password}
                                            onChange={(e) =>
                                                setQCFields({
                                                    ...qcFields,
                                                    password: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder={
                                                editingQCId
                                                    ? "Leave blank to keep current"
                                                    : "Min 8 characters"
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={
                                            editingQCId
                                                ? handleUpdateQC
                                                : handleAddQC
                                        }
                                        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
                                    >
                                        {editingQCId
                                            ? "Update & Save Changes"
                                            : "Add & Save Member"}
                                    </button>
                                    {editingQCId && (
                                        <button
                                            onClick={() => {
                                                setEditingQCId(null);
                                                setQCFields({
                                                    name: "",
                                                    username: "",
                                                    password: "",
                                                });
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setShowQCForm(false);
                                        setEditingQCId(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
}
