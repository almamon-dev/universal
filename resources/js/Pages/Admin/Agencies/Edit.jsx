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
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Edit({
    agency,
    stats,
    audits = [],
    chatters = [],
    auth,
}) {
    const user = auth?.user;
    const isAdmin = user?.role === "admin";
    const canEdit = isAdmin;
    const isEditing = !!agency?.id;
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFrom, setDateFrom] = useState("02/07/2026");
    const [dateTo, setDateTo] = useState("02/07/2026");

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
        avg_recorded_ppn: agency?.avg_recorded_ppn || "",
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
    const [showFields, setShowFields] = useState(false);
    const [selectedChatter, setSelectedChatter] = useState("all");

    // Sync form data when agency props change (for instant QC saves)
    useEffect(() => {
        if (agency?.qcs) {
            setData("qcs", agency.qcs);
        }
    }, [agency?.qcs]);

    const handleAddQC = () => {
        if (!qcFields.name || !qcFields.username || !qcFields.password) {
            toast.error("Please fill in all QC details");
            return;
        }

        router.post(route("admin.agencies.qcs.store", agency.id), qcFields, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setQCFields({ name: "", username: "", password: "" });
                toast.success("QC member added and saved successfully");
                // Modal stays open so they can see the new member in the list instantly
            },
            onError: (err) => {
                // Show each validation error in a separate toast
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
                toast.success("Agency saved successfully");
            },
            onError: (errors) => {
                console.error("Request failed with errors:", errors);
                toast.error("Failed to save agency. Check errors.");
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
    const AuditCard = ({ audit }) => {
        const [isExpanded, setIsExpanded] = useState(false);

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
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Header */}
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
                            <Calendar size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {new Date(audit.created_at).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    },
                                )}
                            </p>
                            <p className="text-xs text-gray-500">
                                {audit.user?.name || "System"}
                            </p>
                        </div>
                    </div>
                    <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                        }`}
                    />
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-gray-100"
                        >
                            {/* Info Grid */}
                            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Chatter
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {audit.chatter?.name || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Creator
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {audit.creator?.name || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Subscriber UID
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {audit.subscriber_uid || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-4 space-y-3">
                                {Object.entries(audit.response_data || {}).map(
                                    ([key, value]) => {
                                        if (
                                            !key ||
                                            key.includes('""') ||
                                            key === "null"
                                        )
                                            return null;

                                        let displayValue = value;
                                        if (typeof value === "boolean") {
                                            displayValue = value ? "Yes" : "No";
                                        } else if (
                                            typeof value === "object" &&
                                            value !== null
                                        ) {
                                            displayValue =
                                                JSON.stringify(value);
                                        } else {
                                            displayValue = value || "N/A";
                                        }

                                        return (
                                            <div
                                                key={key}
                                                className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                                            >
                                                <span className="text-xs font-medium text-gray-500 w-32">
                                                    {formatKey(key)}
                                                </span>
                                                <span className="text-sm text-gray-900 flex-1">
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
            {!isEditing ? (
                <>
                    <Head title="Create Agency" />
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4"
                                >
                                    <ArrowLeft size={16} />
                                    Back
                                </Link>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {isEditing
                                        ? "Agency Settings"
                                        : "New Agency"}
                                </h1>
                            </div>
                            {!canEdit && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                                    <Lock size={12} />
                                    View Only
                                </span>
                            )}
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
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">
                                    Agency Information
                                </h2>
                                <div className="space-y-4">
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
                                        <input
                                            type="text"
                                            value={data.timezone}
                                            disabled={!canEdit}
                                            onChange={(e) =>
                                                setData(
                                                    "timezone",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                                            placeholder="e.g., Eastern Time"
                                        />
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
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">
                                    Pricing Configuration
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                                value={data.avg_recorded_ppn}
                                                disabled={!canEdit}
                                                onChange={(e) =>
                                                    setData(
                                                        "avg_recorded_ppn",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* QC Management */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        QC Members
                                    </h2>
                                    {canEdit && (
                                        <button
                                            type="button"
                                            onClick={() => setShowQCForm(true)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all active:scale-95"
                                        >
                                            <Plus size={16} />
                                            Add QC
                                        </button>
                                    )}
                                </div>

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
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
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

                            {/* Form Actions */}
                            <div className="flex justify-end gap-3">
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Cancel
                                </Link>
                                {canEdit && (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-900/10 disabled:opacity-50 transition-all active:scale-95"
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
            ) : (
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Head title={`${agency.name} - Dashboard`} />

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
                                    {agency.name}
                                </h1>
                                {!canEdit && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600/10 border border-purple-600/20 text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                        <Lock size={12} />
                                        Viewer
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-widest">
                                <span>
                                    Established{" "}
                                    {new Date(
                                        agency.created_at,
                                    ).toLocaleDateString()}
                                </span>
                                <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                <span
                                    className={
                                        agency.status === "active"
                                            ? "text-emerald-500"
                                            : "text-rose-500"
                                    }
                                >
                                    {agency.status}
                                </span>
                            </div>
                        </div>
                        {canEdit && (
                            <button
                                onClick={handleDelete}
                                className="p-2.5 text-gray-500 hover:text-red-500 border border-[#27272A] rounded-xl hover:border-red-500/30 transition-all active:scale-95"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Left Column - 3 cols */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Total Audits
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stats?.total_audits || 0}
                                    </p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Sellable
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stats?.sellable || 0}
                                    </p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Non-Sellable
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stats?.non_sellable || 0}
                                    </p>
                                </div>
                            </div>

                            {/* Date Filter */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Date Range
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={dateFrom}
                                            onChange={(e) =>
                                                setDateFrom(e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                        <Calendar
                                            size={16}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        to
                                    </span>
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={dateTo}
                                            onChange={(e) =>
                                                setDateTo(e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                        <Calendar
                                            size={16}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Audit Fields Accordion */}
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setShowFields(!showFields)}
                                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <List
                                            size={18}
                                            className="text-gray-500"
                                        />
                                        <span className="text-sm font-medium text-gray-900">
                                            Audit Fields
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={18}
                                        className={`text-gray-400 transition-transform ${
                                            showFields ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {showFields && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" }}
                                            exit={{ height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-gray-100"
                                        >
                                            <div className="p-4">
                                                {agency.audit_fields?.length >
                                                0 ? (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {agency.audit_fields.map(
                                                            (field, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="p-3 bg-gray-50 rounded-lg"
                                                                >
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {field.field_label ||
                                                                            field.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {
                                                                            field.type
                                                                        }{" "}
                                                                        •{" "}
                                                                        {field.required
                                                                            ? "Required"
                                                                            : "Optional"}
                                                                    </p>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500 text-center py-6">
                                                        No audit fields
                                                        configured
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by Subscriber UID..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                                />
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                            </div>

                            {/* Audits Accordion */}
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setShowAudits(!showAudits)}
                                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <Users
                                            size={18}
                                            className="text-gray-500"
                                        />
                                        <span className="text-sm font-medium text-gray-900">
                                            Audits (
                                            {stats?.total_audits ||
                                                audits.length}
                                            )
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={18}
                                        className={`text-gray-400 transition-transform ${
                                            showAudits ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {showAudits && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" }}
                                            exit={{ height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-gray-100"
                                        >
                                            <div className="p-4 space-y-4">
                                                {/* Chatter Filter */}
                                                <select
                                                    value={selectedChatter}
                                                    onChange={(e) =>
                                                        setSelectedChatter(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                >
                                                    <option value="all">
                                                        All Chatters
                                                    </option>
                                                    {chatters.map((chatter) => (
                                                        <option
                                                            key={chatter.id}
                                                            value={chatter.id}
                                                        >
                                                            {chatter.name}
                                                        </option>
                                                    ))}
                                                </select>

                                                {/* Audit List */}
                                                <div className="space-y-3">
                                                    {audits.length > 0 ? (
                                                        audits
                                                            .filter((a) => {
                                                                const matchesSearch =
                                                                    (
                                                                        a.subscriber_uid ||
                                                                        ""
                                                                    )
                                                                        .toLowerCase()
                                                                        .includes(
                                                                            searchTerm.toLowerCase(),
                                                                        );
                                                                const matchesChatter =
                                                                    selectedChatter ===
                                                                        "all" ||
                                                                    String(
                                                                        a.chatter_id,
                                                                    ) ===
                                                                        String(
                                                                            selectedChatter,
                                                                        );
                                                                return (
                                                                    matchesSearch &&
                                                                    matchesChatter
                                                                );
                                                            })
                                                            .map(
                                                                (
                                                                    audit,
                                                                    idx,
                                                                ) => (
                                                                    <AuditCard
                                                                        key={
                                                                            idx
                                                                        }
                                                                        audit={
                                                                            audit
                                                                        }
                                                                    />
                                                                ),
                                                            )
                                                    ) : (
                                                        <p className="text-sm text-gray-500 text-center py-8">
                                                            No audits found
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right Column - 1 col */}
                        <div className="space-y-4">
                            {/* Action Grid */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <ActionBox
                                        icon={Search}
                                        label="Discovery"
                                        href={route(
                                            "admin.agencies.discovery",
                                            agency.id,
                                        )}
                                        color="text-blue-600"
                                    />
                                    <ActionBox
                                        icon={Eye}
                                        label="View"
                                        href={route(
                                            "admin.agencies.view-system-discovery",
                                            agency.id,
                                        )}
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
                                        href={route(
                                            "admin.agencies.audits",
                                            agency.id,
                                        )}
                                        color="text-purple-600"
                                    />
                                    <ActionBox
                                        icon={FileText}
                                        label="Report"
                                        href={route(
                                            "admin.report.weekly",
                                            agency.id,
                                        )}
                                        color="text-pink-600"
                                    />
                                    <ActionBox
                                        icon={BookOpen}
                                        label="Protocols"
                                        href={route(
                                            "admin.agencies.protocols",
                                            agency.id,
                                        )}
                                        color="text-blue-600"
                                    />
                                </div>
                            </div>

                            {/* Manager Button */}
                            <Link
                                href={route(
                                    "admin.agencies.registry",
                                    agency.id,
                                )}
                                className="block w-full bg-gray-900 text-white text-center px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-800"
                            >
                                Chatter & Creator Manager
                            </Link>
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
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Current Members
                                    </p>
                                    {(agency.qcs || []).map((qc) => (
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
                                    {agency.qcs?.length === 0 && (
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
