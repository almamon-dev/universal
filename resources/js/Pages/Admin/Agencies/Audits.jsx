import AdminLayout from "@/Layouts/AdminLayout";
import UserLayout from "@/Layouts/UserLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Search,
    FileText,
    Calendar,
    ExternalLink,
    Plus,
    Trash2,
    Settings,
    Layout as LayoutIcon,
    Lock,
    Info,
    CheckCircle2,
    X,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const TEMPLATES = [
    {
        id: "subscriber_type",
        name: "Subscriber Type",
        field_label: "Subscriber Type",
        type: "select",
        required: true,
        options: "New Sub (1 Day),Old Sub (2 days +)",
        help_text: "This is the spine of the system. No skipping allowed.",
        is_locked: true,
    },
    {
        id: "conv_type",
        name: "Conversation Type",
        field_label: "Conversation Interaction",
        type: "select",
        required: true,
        options:
            "Fresh (First Interaction or first Interaction of the day),Continuing (Subscriber previously engaged and returned)",
        help_text:
            "Tracks whether this is a new interaction or a continuing conversation.",
        is_locked: true,
    },
    {
        id: "conv_classification",
        name: "Conversation Classification",
        field_label: "Conversation State",
        type: "select",
        required: true,
        options: "SELLABLE,NON-SELLABLE",
        help_text: "This is the spine of the system. No skipping allowed.",
        is_locked: true,
    },
    {
        id: "non_sellable_reason",
        name: "Non-Sellable Reason",
        field_label: "Non-Sellable Reasoning",
        type: "select",
        required: false,
        options: "already in the notes",
        help_text:
            "This means the previous chatter already spoke to this subscriber and already tried selling but to no avail, so the current chatter doesn't need to continue the conversation anymore because the account is already notated.",
        is_conditional: true,
        required_if: "Conversation State = NON-SELLABLE",
        is_locked: true,
    },
    {
        id: "casual_conv",
        name: "Did the chatter have a casual conversation before transitioning into a sexual conversation?",
        type: "select",
        required: false,
        options: "Yes,No",
        is_locked: true,
    },
    {
        id: "pitched_content",
        name: "Did the chatter pitched a content?",
        field_label: "Did the chatter pitched a content?",
        type: "select",
        required: false,
        options: "Yes,No",
        is_locked: true,
        is_conditional: true,
        special_banner:
            'Conditional: Shows only when "Conversation State" = SELLABLE',
    },
    {
        id: "no_pitch_reason",
        name: "Why was there no pitch?",
        type: "select",
        required: false,
        options: "PITCH NOT POSSIBLE,Pitch POSSIBLE but NOT EXECUTED",
        is_locked: true,
        is_conditional: true,
        required_if: "Did the chatter pitch a content? = No",
    },
    {
        id: "pitch_not_possible",
        name: "PITCH NOT POSSIBLE",
        type: "select",
        required: false,
        options:
            "1. Sub left mid conversation,2. Time constraint stated (sub is about to leave; go to work; etc),3. Other (shows text field)",
        is_locked: true,
        is_conditional: true,
        required_if: "Why was there no pitch? = PITCH NOT POSSIBLE",
    },
    {
        id: "pitch_possible_not_executed",
        name: "Pitch POSSIBLE but NOT EXECUTED",
        type: "textarea",
        required: false,
        help_text:
            "QC can provide their own judgment/analysis for why the pitch was possible but not executed.",
        is_locked: true,
        is_conditional: true,
        required_if:
            "Why was there no pitch? = Pitch POSSIBLE but NOT EXECUTED",
    },
    {
        id: "content_pitched_type",
        name: "Content Type Pitched",
        field_label: "What type of content was pitched?",
        type: "select",
        required: false,
        options: "Sexting,Pre-recorded",
        is_locked: true,
        is_conditional: true,
        required_if: "Did the chatter pitch a content? = Yes",
    },
    {
        id: "negotiated",
        name: "Negotiation",
        field_label: "Did the chatter negotiate?",
        type: "select",
        required: false,
        options: "Yes,No",
        is_locked: true,
        is_conditional: true,
        required_if: "Did the chatter pitch a content? = Yes",
    },
    {
        id: "made_sale",
        name: "Sale Success",
        field_label: "Did the chatter make a sale?",
        type: "select",
        required: false,
        options: "Yes,No",
        is_locked: true,
        is_conditional: true,
        required_if: "Did the chatter pitch a content? = Yes",
    },
    {
        id: "no_sale_reason",
        name: "Why did the sale not happen?",
        type: "select",
        required: false,
        options:
            "1. No Buying Power - Sub wants it but has no funds.,2. Free-Only / Timewaster - Sub avoids spending beyond subscription fee,3. Development Required - Sub needs more rapport / trust,4. Timing issue - Wrong moment; busy; distracted,5. Execution Breakdown - Chatter mishandled pacing/paywall transitioning,6. Other (with text field for short note)",
        help_text:
            "This protects against ignoring real operator faults and helps identify patterns in failed sales.",
        is_locked: true,
        is_conditional: true,
        required_if:
            "Did the chatter pitch a content? = Yes AND Did the chatter make a sale? = No",
    },
    {
        id: "upselling_attempt",
        name: "Upselling Attempt",
        field_label: "Did the chatter try upselling after the first PPV?",
        type: "select",
        required: false,
        options: "Yes,No",
        is_locked: true,
        is_conditional: true,
        required_if: "Did the chatter make a sale? = Yes",
        special_banner:
            'Conditional: Shows only when "Content Type Pitched" = Pre-recorded',
    },
    {
        id: "upsell_bought",
        name: "Upsell Success",
        field_label: "Did the subscriber buy the upsell?",
        type: "select",
        required: false,
        options: "Yes,No",
        is_locked: true,
        is_conditional: true,
        required_if: "Did the chatter try upselling after the first PPV? = Yes",
    },
    {
        id: "no_upsell_reason",
        name: "Why did the sub not buy the upsell?",
        type: "select",
        required: false,
        options:
            "1. Financial Constraint - Sub wants it but has no more funds,2. Sub climaxed,3. Other (with text field)",
        is_locked: true,
        is_conditional: true,
        required_if:
            "Did the chatter try upselling after the first PPV? = Yes AND Did the subscriber buy the upsell? = No",
    },
    {
        id: "sexting_continued",
        name: "Sexting Continuity",
        field_label: "Did the sub continue the sexting sequence?",
        type: "select",
        required: false,
        options: "Yes,No",
        is_locked: true,
        is_conditional: true,
        required_if: "Content Type Pitched = Sexting",
        special_banner:
            'Conditional: Shows only when "Did the chatter make a sale?" = Yes',
    },
    {
        id: "no_sexting_continue_reason",
        name: "Why did the sub not continue?",
        type: "select",
        required: false,
        options:
            "1. Financial Constraint - Sub wants it but has no more funds,2. Sub climaxed,3. Other (with text field)",
        is_locked: true,
        is_conditional: true,
        required_if:
            "Content Type Pitched = Sexting AND Did the chatter make a sale? = Yes AND Did the sub continue the sexting sequence? = No",
    },
    {
        id: "aftercare",
        name: "Aftercare",
        field_label:
            "Did the chatter provide aftercare/pillow talk after the sub finishes?",
        type: "select",
        required: false,
        options: "Yes,No",
        is_locked: true,
        is_conditional: true,
        required_if: "Did the chatter make a sale? = Yes",
    },
    {
        id: "qc_help_request",
        name: "QC Help Request",
        field_label:
            "Did the chatter request for a QCs help? (Script, how to handle, etc.)",
        type: "select",
        required: false,
        options: "Yes,No",
        is_locked: true,
    },
    {
        id: "qc_intervene",
        name: "QC Intervention",
        field_label: "Did QC intervene during this conversation?",
        type: "select",
        required: false,
        options: "Yes,No",
        is_locked: true,
    },
    {
        id: "rule_violation",
        name: "Rule Violation Observed",
        type: "select",
        required: false,
        options: "Yes,No",
        is_locked: true,
    },
    {
        id: "rule_violated_detail",
        name: "Which rule did the chatter violate?",
        field_label: "Which rule did the chatter violate?",
        type: "textarea",
        required: false,
        help_text: "QC can type in which specific rule was violated",
        is_conditional: true,
        required_if: "Rule Violation Observed = Yes",
        is_locked: true,
    },
];
export default function Audits({ auth, agency, audits, audit_fields }) {
    const user = auth?.user;
    const isQC = user?.role === "qc";
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState(isQC ? "audits" : "fields");
    const [isAddingTemplate, setIsAddingTemplate] = useState(false);
    const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
    const [editingFieldIndex, setEditingFieldIndex] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        fields: Array.isArray(audit_fields)
            ? audit_fields
            : Object.values(audit_fields || {}),
    });

    useEffect(() => {
        if (audit_fields) {
            setData(
                "fields",
                Array.isArray(audit_fields)
                    ? audit_fields
                    : Object.values(audit_fields),
            );
        }
    }, [audit_fields]);

    const removeField = (index) => {
        setData(
            "fields",
            data.fields.filter((_, i) => i !== index),
        );
    };

    const updateField = (index, key, value) => {
        const newFields = [...data.fields];
        newFields[index][key] = value;
        setData("fields", newFields);
    };

    const handleSaveFields = (e) => {
        e.preventDefault();
        setShowSuccess(false);
        post(route("admin.agencies.audit-fields.update", agency.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 5000);
            },
        });
    };

    const handleAddSelectedTemplates = () => {
        const selectedFields = TEMPLATES.filter((t) =>
            selectedTemplateIds.includes(t.id),
        );

        setData("fields", [...data.fields, ...selectedFields]);
        setIsAddingTemplate(false);
        setSelectedTemplateIds([]);
    };

    const toggleTemplateSelect = (id) => {
        if (selectedTemplateIds.includes(id)) {
            setSelectedTemplateIds(selectedTemplateIds.filter((i) => i !== id));
        } else {
            setSelectedTemplateIds([...selectedTemplateIds, id]);
        }
    };

    const handleSelectAllTemplates = () => {
        if (selectedTemplateIds.length === TEMPLATES.length) {
            setSelectedTemplateIds([]);
        } else {
            setSelectedTemplateIds(TEMPLATES.map((t) => t.id));
        }
    };

    const filteredAudits = audits.filter(
        (audit) =>
            (audit.url || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (audit.email || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const Layout = isQC ? UserLayout : AdminLayout;

    return (
        <Layout>
            <Head title={`Agency Audits - ${agency.name}`} />

            <div
                className={`max-w-7xl mx-auto px-4 py-8 ${isQC ? "pb-20" : ""}`}
            >
                {/* Header */}
                <div className="mb-10">
                    <Link
                        href={
                            isQC
                                ? route("dashboard")
                                : route("admin.agencies.edit", agency.id)
                        }
                        className={`inline-flex items-center gap-2 text-sm font-medium transition-all px-4 py-2 rounded-xl mb-6 border ${isQC ? "bg-[#18181B] border-[#27272A] text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900 border-gray-200 bg-white"}`}
                    >
                        <ArrowLeft size={16} />
                        Back to {isQC ? "Dashboard" : "Agency"}
                    </Link>
                    <div className="flex flex-col gap-2">
                        <h1
                            className={`text-3xl font-bold tracking-tight ${isQC ? "text-white" : "text-gray-900"}`}
                        >
                            {agency.name}
                        </h1>
                        <p
                            className={`text-sm ${isQC ? "text-gray-500 font-medium" : "text-gray-500"}`}
                        >
                            {isQC
                                ? "Performance history and metrics"
                                : "Manage audit configuration and reviews"}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                {!isAddingTemplate && !isQC && (
                    <div className="border-b border-gray-200 mb-8">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setActiveTab("fields")}
                                className={`pb-3 text-sm font-medium transition-all relative ${
                                    activeTab === "fields"
                                        ? "text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                Audit Configuration
                            </button>
                            <button
                                onClick={() => setActiveTab("audits")}
                                className={`pb-3 text-sm font-medium transition-all relative ${
                                    activeTab === "audits"
                                        ? "text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                Audit History
                            </button>
                        </div>
                    </div>
                )}

                {isAddingTemplate ? (
                    <div className="space-y-6">
                        {/* Template Selection Header */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsAddingTemplate(false)}
                                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                                <p className="text-sm text-gray-600">
                                    Select fields to add to your audit structure
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSelectAllTemplates}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 px-3 py-1.5 font-medium"
                                >
                                    {selectedTemplateIds.length ===
                                    TEMPLATES.length
                                        ? "Deselect All"
                                        : "Select All"}
                                </button>
                                <button
                                    onClick={handleAddSelectedTemplates}
                                    disabled={selectedTemplateIds.length === 0}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Add Selected ({selectedTemplateIds.length})
                                </button>
                            </div>
                        </div>

                        {/* Templates List */}
                        <div className="space-y-3">
                            {TEMPLATES.map((field) => (
                                <div
                                    key={field.id}
                                    onClick={() =>
                                        toggleTemplateSelect(field.id)
                                    }
                                    className={`p-5 border rounded-lg cursor-pointer transition-all ${
                                        selectedTemplateIds.includes(field.id)
                                            ? "border-indigo-200 bg-indigo-50/30"
                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                    }`}
                                >
                                    <div className="flex gap-3">
                                        <div className="pt-0.5">
                                            <div
                                                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                                    selectedTemplateIds.includes(
                                                        field.id,
                                                    )
                                                        ? "bg-indigo-600 border-indigo-600"
                                                        : "border-gray-300"
                                                }`}
                                            >
                                                {selectedTemplateIds.includes(
                                                    field.id,
                                                ) && (
                                                    <CheckCircle2
                                                        size={14}
                                                        className="text-white"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <h3 className="text-base font-medium text-gray-900">
                                                    {field.name}
                                                </h3>
                                                <div className="flex items-center gap-1.5">
                                                    {field.is_locked && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded">
                                                            <Lock size={10} />
                                                            Locked
                                                        </span>
                                                    )}
                                                    {field.is_conditional && (
                                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                                                            Conditional
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <p className="text-sm flex items-baseline gap-2">
                                                        <span className="text-gray-500 min-w-[40px]">
                                                            Field:
                                                        </span>
                                                        <span className="font-medium text-gray-900">
                                                            {field.field_label ||
                                                                field.name}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm flex items-baseline gap-2">
                                                        <span className="text-gray-500 min-w-[40px]">
                                                            Type:
                                                        </span>
                                                        <span className="text-gray-700">
                                                            {field.type ===
                                                            "select"
                                                                ? "Dropdown"
                                                                : field.type ===
                                                                    "textarea"
                                                                  ? "Text Area"
                                                                  : field.type}
                                                            {field.required &&
                                                                " • Required"}
                                                        </span>
                                                    </p>
                                                </div>

                                                {field.required_if && (
                                                    <div className="p-3 rounded bg-gray-50 border border-gray-200 max-w-full">
                                                        <p className="text-xs text-gray-500 mb-0.5">
                                                            Required if:
                                                        </p>
                                                        <p className="text-sm text-gray-700">
                                                            {field.required_if}
                                                        </p>
                                                    </div>
                                                )}

                                                {field.options && (
                                                    <div className="max-w-2xl">
                                                        <p className="text-xs text-gray-500 mb-1">
                                                            Options:
                                                        </p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {field.options
                                                                .split(",")
                                                                .map(
                                                                    (
                                                                        opt,
                                                                        i,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                                                                        >
                                                                            {opt.trim()}
                                                                        </span>
                                                                    ),
                                                                )}
                                                        </div>
                                                    </div>
                                                )}

                                                {field.special_banner && (
                                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded max-w-2xl">
                                                        <p className="text-xs text-amber-800">
                                                            {
                                                                field.special_banner
                                                            }
                                                        </p>
                                                    </div>
                                                )}

                                                {field.help_text && (
                                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded max-w-full">
                                                        <p className="text-xs text-gray-600">
                                                            {field.help_text}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : activeTab === "fields" ? (
                    <div className="space-y-6">
                        {/* Audit Fields Editor */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Audit Fields
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Define the fields used in your audit
                                        forms
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingTemplate(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <Plus size={16} />
                                    Add Template Fields
                                </button>
                            </div>

                            {showSuccess && (
                                <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            size={16}
                                            className="text-emerald-600"
                                        />
                                        <p className="text-sm text-emerald-700">
                                            Audit structure updated successfully
                                        </p>
                                    </div>
                                </div>
                            )}

                            {Object.keys(errors).length > 0 && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <X size={16} className="text-red-600" />
                                        <p className="text-sm text-red-700">
                                            Please fix the errors below
                                        </p>
                                    </div>
                                </div>
                            )}

                            {data.fields.length > 0 ? (
                                <div className="space-y-2">
                                    {data.fields.map((field, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                                        >
                                            {editingFieldIndex === index ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            Edit Field
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setEditingFieldIndex(
                                                                    null,
                                                                )
                                                            }
                                                            className="text-sm text-gray-500 hover:text-gray-700"
                                                        >
                                                            Close
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1">
                                                                Field Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    field.name
                                                                }
                                                                disabled={
                                                                    field.is_locked
                                                                }
                                                                onChange={(e) =>
                                                                    updateField(
                                                                        index,
                                                                        "name",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1">
                                                                Field Type
                                                            </label>
                                                            <select
                                                                value={
                                                                    field.type
                                                                }
                                                                disabled={
                                                                    field.is_locked
                                                                }
                                                                onChange={(e) =>
                                                                    updateField(
                                                                        index,
                                                                        "type",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50"
                                                            >
                                                                <option value="text">
                                                                    Text Input
                                                                </option>
                                                                <option value="textarea">
                                                                    Textarea
                                                                </option>
                                                                <option value="number">
                                                                    Number
                                                                </option>
                                                                <option value="select">
                                                                    Dropdown
                                                                </option>
                                                                <option value="checkbox">
                                                                    Checkbox
                                                                </option>
                                                            </select>
                                                        </div>
                                                        {field.type ===
                                                            "select" && (
                                                            <div className="md:col-span-2">
                                                                <label className="block text-xs text-gray-500 mb-1">
                                                                    Options
                                                                    (comma-separated)
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        field.options ||
                                                                        ""
                                                                    }
                                                                    disabled={
                                                                        field.is_locked
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateField(
                                                                            index,
                                                                            "options",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50"
                                                                    placeholder="Option 1, Option 2, Option 3"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex items-center">
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        field.required
                                                                    }
                                                                    disabled={
                                                                        field.is_locked
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateField(
                                                                            index,
                                                                            "required",
                                                                            e
                                                                                .target
                                                                                .checked,
                                                                        )
                                                                    }
                                                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-200"
                                                                />
                                                                <span className="text-sm text-gray-700">
                                                                    Required
                                                                    field
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {index + 1}.{" "}
                                                                {field.name}
                                                            </span>
                                                            {field.required && (
                                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded">
                                                                    Required
                                                                </span>
                                                            )}
                                                            {field.is_locked && (
                                                                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded flex items-center gap-1">
                                                                    <Lock
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                    Locked
                                                                </span>
                                                            )}
                                                            {field.is_conditional && (
                                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                                                                    Conditional
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            Type: {field.type}
                                                            {field.options &&
                                                                ` • ${field.options.split(",").length} options`}
                                                        </p>
                                                        {field.help_text && (
                                                            <p className="text-xs text-gray-400">
                                                                {
                                                                    field.help_text
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-0.5">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setEditingFieldIndex(
                                                                    index,
                                                                )
                                                            }
                                                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded transition-colors"
                                                        >
                                                            <Settings
                                                                size={14}
                                                            />
                                                        </button>
                                                        {!field.is_locked && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeField(
                                                                        index,
                                                                    )
                                                                }
                                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
                                                            >
                                                                <Trash2
                                                                    size={14}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                                    <Settings
                                        size={32}
                                        className="mx-auto mb-3 text-gray-300"
                                    />
                                    <p className="text-gray-600 font-medium mb-1">
                                        No audit fields yet
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Add template fields to get started
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                                <Link
                                    href={route(
                                        "admin.agencies.edit",
                                        agency.id,
                                    )}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    onClick={handleSaveFields}
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    {processing ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Search */}
                        <div className="relative max-w-md">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search by URL or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Audit List */}
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            URL
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredAudits.length > 0 ? (
                                        filteredAudits.map((audit) => (
                                            <tr
                                                key={audit.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <FileText
                                                            size={14}
                                                            className="text-gray-400"
                                                        />
                                                        <span className="text-sm text-gray-900 truncate max-w-xs">
                                                            {audit.url}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {audit.email || "—"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar
                                                            size={14}
                                                            className="text-gray-400"
                                                        />
                                                        {new Date(
                                                            audit.created_at,
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded hover:bg-indigo-100 transition-colors">
                                                        <ExternalLink
                                                            size={12}
                                                        />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-4 py-8 text-center text-sm text-gray-500"
                                            >
                                                No audits found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
