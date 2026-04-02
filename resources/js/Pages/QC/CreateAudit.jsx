import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, router } from "@inertiajs/react";
import {
    Calendar,
    ChevronDown,
    Plus,
    X,
    ChevronLeft,
    ChevronRight,
    Check,
    ArrowLeft,
    User,
    Mail,
    Hash,
    FileText,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import toast from "react-hot-toast";

export default function CreateAudit({ agency, chatters = [], creators = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const auditFields = agency.audit_fields || [];
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const tabContainerRef = useRef(null);
    const [showScrollButtons, setShowScrollButtons] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const generateFieldKey = (field) => {
        if (field.id) return field.id.toString();
        return (field.field_label || field.name || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");
    };

    const emptyAudit = {
        chatter_id: "",
        creator_id: "",
        subscriber_uid: "",
        responses: {},
        status: "completed",
    };

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            audits: [emptyAudit],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "audits",
    });

    const auditsData = watch("audits");

    // Auto-scroll active tab
    useEffect(() => {
        if (tabContainerRef.current) {
            const container = tabContainerRef.current;
            const activeTab = container.children[activeTabIndex];
            if (activeTab) {
                const containerRect = container.getBoundingClientRect();
                const tabRect = activeTab.getBoundingClientRect();
                if (tabRect.left < containerRect.left) {
                    container.scrollTo({
                        left:
                            container.scrollLeft +
                            (tabRect.left - containerRect.left) -
                            20,
                        behavior: "smooth",
                    });
                } else if (tabRect.right > containerRect.right) {
                    container.scrollTo({
                        left:
                            container.scrollLeft +
                            (tabRect.right - containerRect.right) +
                            20,
                        behavior: "smooth",
                    });
                }
            }
        }
    }, [activeTabIndex]);

    useEffect(() => {
        const checkOverflow = () => {
            if (tabContainerRef.current) {
                const { scrollWidth, clientWidth } = tabContainerRef.current;
                setShowScrollButtons(scrollWidth > clientWidth);
            }
        };
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [fields.length]);

    const scrollTabs = (direction) => {
        if (tabContainerRef.current) {
            const scrollAmount = 200;
            tabContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const handleWheel = (e) => {
        if (tabContainerRef.current)
            tabContainerRef.current.scrollLeft += e.deltaY;
    };

    const addAudit = () => {
        append({ ...emptyAudit });
        setActiveTabIndex(fields.length);
    };

    const removeAuditItem = (e, index) => {
        e.stopPropagation();
        if (fields.length > 1) {
            remove(index);
            if (activeTabIndex >= fields.length - 1)
                setActiveTabIndex(Math.max(0, fields.length - 2));
        } else {
            toast.error("At least one audit is required.");
        }
    };

    const onSubmit = (formData) => {
        setIsProcessing(true);
        router.post(route("qc.agencies.audits.store", agency.id), formData, {
            onSuccess: () => {
                toast.success("All audits submitted successfully!");
                setIsProcessing(false);
            },
            onError: (err) => {
                console.error(err);
                toast.error("Please fill all required fields.");
                setIsProcessing(false);
            },
        });
    };

    const todayDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const getCompletionPercentage = (responses) => {
        if (!auditFields.length) return 0;
        const answered = Object.keys(responses).filter(
            (k) => responses[k] && responses[k].toString().trim() !== "",
        ).length;
        return Math.round((answered / auditFields.length) * 100);
    };

    return (
        <UserLayout>
            <Head title={`New Audit - ${agency.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20 px-10 pt-2">
                <main className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <div className="mb-3">
                        <button
                            onClick={() => router.get(route("dashboard"))}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all"
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </button>
                    </div>

                    {/* Modern Tab Bar */}
                    <div className="mb-2 bg-white border border-gray-200 rounded-md shadow-sm p-1 flex items-center gap-1">
                        {showScrollButtons && (
                            <button
                                type="button"
                                onClick={() => scrollTabs("left")}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}

                        <div
                            ref={tabContainerRef}
                            onWheel={handleWheel}
                            className="flex items-center flex-1 min-w-0 overflow-x-auto no-scrollbar scroll-smooth gap-1"
                        >
                            {fields.map((field, index) => {
                                const isActive = activeTabIndex === index;
                                const currentAuditValue = auditsData[index];
                                const selectedChatter = chatters.find(
                                    (c) =>
                                        c.id.toString() ===
                                        currentAuditValue?.chatter_id?.toString(),
                                );
                                const tabLabel = selectedChatter
                                    ? selectedChatter.name
                                    : `Audit ${index + 1}`;

                                const hasErrors = errors.audits?.[index];
                                const completion = getCompletionPercentage(
                                    currentAuditValue?.responses || {},
                                );

                                return (
                                    <button
                                        key={field.id}
                                        onClick={() => setActiveTabIndex(index)}
                                        type="button"
                                        className={`relative flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-md transition-all ${
                                            isActive
                                                ? "bg-black text-white shadow-lg shadow-black/10"
                                                : "text-gray-500 hover:text-black hover:bg-gray-100"
                                        }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                isActive
                                                    ? "bg-white"
                                                    : hasErrors
                                                      ? "bg-red-500"
                                                      : completion === 100
                                                        ? "bg-emerald-500"
                                                        : "bg-gray-300"
                                            }`}
                                        />
                                        <span className="truncate max-w-[120px]">
                                            {tabLabel}
                                        </span>
                                        {completion > 0 &&
                                            completion < 100 &&
                                            !isActive && (
                                                <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                                                    {completion}%
                                                </span>
                                            )}
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={(e) =>
                                                    removeAuditItem(e, index)
                                                }
                                                className={`p-1 rounded-full transition-all ${
                                                    isActive
                                                        ? "hover:bg-white/20 text-white/80 hover:text-white"
                                                        : "hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                                                }`}
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {showScrollButtons && (
                            <button
                                type="button"
                                onClick={() => scrollTabs("right")}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        )}

                        <div className="w-px h-8 bg-gray-100 mx-1" />

                        <button
                            type="button"
                            onClick={addAudit}
                            className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all shrink-0"
                            title="Add New Audit"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-3"
                    >
                        {fields.map((field, index) => {
                            if (activeTabIndex !== index) return null;

                            const activeAuditValues = auditsData[index] || {};
                            const responses = activeAuditValues.responses || {};
                            const completion =
                                getCompletionPercentage(responses);
                            const hasErrors = errors.audits?.[index];

                            return (
                                <div key={field.id} className="space-y-3">
                                    {/* Progress Bar */}
                                    <div className="bg-white border border-gray-200 rounded-md p-2.5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                Audit Progress
                                            </span>
                                            <span className="text-sm font-semibold text-indigo-600">
                                                {completion}% Complete
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                style={{
                                                    width: `${completion}%`,
                                                }}
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    completion === 100
                                                        ? "bg-emerald-500"
                                                        : "bg-gradient-to-r from-indigo-500 to-indigo-600"
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    {/* General Information Card */}
                                    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                                        <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 via-white to-white border-b border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-indigo-100 flex items-center justify-center">
                                                    <FileText
                                                        size={20}
                                                        className="text-indigo-600"
                                                    />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-semibold text-gray-900">
                                                        General Information
                                                    </h2>
                                                    <p className="text-sm text-indigo-600 mt-0.5">
                                                        Basic details about the
                                                        audit
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Date
                                                    </label>
                                                    <div className="relative group">
                                                        <input
                                                            type="text"
                                                            disabled
                                                            value={todayDate}
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-600 cursor-not-allowed group-hover:border-gray-300 transition-colors"
                                                        />
                                                        <Calendar
                                                            size={18}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        QC Name
                                                    </label>
                                                    <div className="relative group">
                                                        <input
                                                            type="text"
                                                            disabled
                                                            value={user.name}
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-600 cursor-not-allowed group-hover:border-gray-300 transition-colors"
                                                        />
                                                        <User
                                                            size={18}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Chatter Name
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        {...register(
                                                            `audits.${index}.chatter_id`,
                                                            {
                                                                required: true,
                                                            },
                                                        )}
                                                        className={`w-full bg-white border rounded-md px-4 py-3 text-sm focus:outline-none transition-all ${
                                                            errors.audits?.[
                                                                index
                                                            ]?.chatter_id
                                                                ? "border-red-500 ring-2 ring-red-500/20"
                                                                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                        }`}
                                                    >
                                                        <option value="">
                                                            Select Chatter
                                                        </option>
                                                        {chatters.map((c) => (
                                                            <option
                                                                key={c.id}
                                                                value={c.id}
                                                            >
                                                                {c.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Creator Name
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        {...register(
                                                            `audits.${index}.creator_id`,
                                                            {
                                                                required: true,
                                                            },
                                                        )}
                                                        className={`w-full bg-white border rounded-md px-4 py-3 text-sm focus:outline-none transition-all ${
                                                            errors.audits?.[
                                                                index
                                                            ]?.creator_id
                                                                ? "border-red-500 ring-2 ring-red-500/20"
                                                                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                        }`}
                                                    >
                                                        <option value="">
                                                            Select Creator
                                                        </option>
                                                        {creators.map((c) => (
                                                            <option
                                                                key={c.id}
                                                                value={c.id}
                                                            >
                                                                {c.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mt-6 space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Subscriber UID
                                                    <span className="text-red-500 ml-1">
                                                        *
                                                    </span>
                                                </label>
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        {...register(
                                                            `audits.${index}.subscriber_uid`,
                                                            {
                                                                required: true,
                                                            },
                                                        )}
                                                        placeholder="Enter Subscriber UID"
                                                        className={`w-full bg-white border rounded-md px-4 py-3 text-sm pl-10 focus:outline-none transition-all ${
                                                            errors.audits?.[
                                                                index
                                                            ]?.subscriber_uid
                                                                ? "border-red-500 ring-2 ring-red-500/20"
                                                                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                        }`}
                                                    />
                                                    <Hash
                                                        size={16}
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-500 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Audit Fields Card */}
                                    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                                        <div className="px-6 py-3 bg-gradient-to-r from-emerald-50 via-white to-white border-b border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-emerald-100 flex items-center justify-center">
                                                    <CheckCircle
                                                        size={20}
                                                        className="text-emerald-600"
                                                    />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-semibold text-gray-900">
                                                        Audit Questions
                                                    </h2>
                                                    <p className="text-sm text-emerald-600 mt-0.5">
                                                        {auditFields.length}{" "}
                                                        fields to complete •{" "}
                                                        {
                                                            Object.keys(
                                                                responses,
                                                            ).filter(
                                                                (k) =>
                                                                    responses[
                                                                        k
                                                                    ],
                                                            ).length
                                                        }{" "}
                                                        answered
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="space-y-3">
                                                {auditFields.length > 0 ? (
                                                    auditFields.map(
                                                        (fieldItem, fIdx) => {
                                                            const fieldKey =
                                                                generateFieldKey(
                                                                    fieldItem,
                                                                );

                                                            // Waterfall logic
                                                            const isFirst =
                                                                fIdx === 0;
                                                            const prevField =
                                                                auditFields[
                                                                    fIdx - 1
                                                                ];
                                                            const prevKey =
                                                                prevField
                                                                    ? generateFieldKey(
                                                                          prevField,
                                                                      )
                                                                    : null;
                                                            const prevValue =
                                                                prevKey
                                                                    ? responses[
                                                                          prevKey
                                                                      ]
                                                                    : null;
                                                            const isVisible =
                                                                isFirst ||
                                                                (prevValue !==
                                                                    undefined &&
                                                                    prevValue !==
                                                                        null &&
                                                                    prevValue
                                                                        .toString()
                                                                        .trim() !==
                                                                        "");

                                                            if (!isVisible)
                                                                return null;

                                                            const isSelect =
                                                                fieldItem.type ===
                                                                    "select" ||
                                                                fieldItem.options ||
                                                                (
                                                                    fieldItem.field_label ||
                                                                    ""
                                                                )
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        "subscriber type",
                                                                    );

                                                            const hasError =
                                                                errors.audits?.[
                                                                    index
                                                                ]?.responses?.[
                                                                    fieldKey
                                                                ];
                                                            const currentValue =
                                                                responses[
                                                                    fieldKey
                                                                ];

                                                            return (
                                                                <div
                                                                    key={
                                                                        fieldKey
                                                                    }
                                                                    className="space-y-1.5 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                                                                >
                                                                    <div className="flex items-start justify-between">
                                                                        <label className="text-sm font-medium text-gray-700">
                                                                            {fieldItem.field_label ||
                                                                                fieldItem.name}
                                                                            {fieldItem.required && (
                                                                                <span className="text-red-500 ml-1">
                                                                                    *
                                                                                </span>
                                                                            )}
                                                                        </label>
                                                                        {currentValue && (
                                                                            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                                                                Answered
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {fieldItem.help_text && (
                                                                        <p className="text-xs text-gray-500 mb-3">
                                                                            {
                                                                                fieldItem.help_text
                                                                            }
                                                                        </p>
                                                                    )}

                                                                    {isSelect ? (
                                                                        (() => {
                                                                            const options =
                                                                                fieldItem.options
                                                                                    ?.split(
                                                                                        ",",
                                                                                    )
                                                                                    .map(
                                                                                        (
                                                                                            o,
                                                                                        ) =>
                                                                                            o.trim(),
                                                                                    ) ||
                                                                                [];
                                                                            const isYesNo =
                                                                                options.length ===
                                                                                    2 &&
                                                                                options.some(
                                                                                    (
                                                                                        o,
                                                                                    ) =>
                                                                                        o.toLowerCase() ===
                                                                                        "yes",
                                                                                ) &&
                                                                                options.some(
                                                                                    (
                                                                                        o,
                                                                                    ) =>
                                                                                        o.toLowerCase() ===
                                                                                        "no",
                                                                                );

                                                                            if (
                                                                                isYesNo
                                                                            ) {
                                                                                return (
                                                                                    <div className="flex gap-3">
                                                                                        {options.map(
                                                                                            (
                                                                                                opt,
                                                                                            ) => {
                                                                                                const isSelected =
                                                                                                    responses[
                                                                                                        fieldKey
                                                                                                    ] ===
                                                                                                    opt;
                                                                                                return (
                                                                                                    <button
                                                                                                        key={
                                                                                                            opt
                                                                                                        }
                                                                                                        type="button"
                                                                                                        onClick={() => {
                                                                                                            setValue(
                                                                                                                `audits.${index}.responses.${fieldKey}`,
                                                                                                                opt,
                                                                                                                {
                                                                                                                    shouldValidate: true,
                                                                                                                    shouldDirty: true,
                                                                                                                },
                                                                                                            );
                                                                                                            auditFields
                                                                                                                .slice(
                                                                                                                    fIdx +
                                                                                                                        1,
                                                                                                                )
                                                                                                                .forEach(
                                                                                                                    (
                                                                                                                        subField,
                                                                                                                    ) => {
                                                                                                                        const subKey =
                                                                                                                            generateFieldKey(
                                                                                                                                subField,
                                                                                                                            );
                                                                                                                        setValue(
                                                                                                                            `audits.${index}.responses.${subKey}`,
                                                                                                                            "",
                                                                                                                            {
                                                                                                                                shouldValidate: true,
                                                                                                                                shouldDirty: true,
                                                                                                                            },
                                                                                                                        );
                                                                                                                    },
                                                                                                                );
                                                                                                        }}
                                                                                                        className={`flex-1 h-11 rounded-md border-2 flex items-center justify-center gap-2 transition-all ${
                                                                                                            isSelected
                                                                                                                ? opt.toLowerCase() ===
                                                                                                                  "yes"
                                                                                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                                                                                    : "border-red-500 bg-red-50 text-red-700"
                                                                                                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                                                                                        }`}
                                                                                                    >
                                                                                                        {isSelected && (
                                                                                                            <div
                                                                                                                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                                                                                                    opt.toLowerCase() ===
                                                                                                                    "yes"
                                                                                                                        ? "bg-emerald-500"
                                                                                                                        : "bg-red-500"
                                                                                                                }`}
                                                                                                            >
                                                                                                                <Check
                                                                                                                    size={
                                                                                                                        12
                                                                                                                    }
                                                                                                                    className="text-white"
                                                                                                                    strokeWidth={
                                                                                                                        3
                                                                                                                    }
                                                                                                                />
                                                                                                            </div>
                                                                                                        )}
                                                                                                        <span className="text-sm font-medium">
                                                                                                            {
                                                                                                                opt
                                                                                                            }
                                                                                                        </span>
                                                                                                    </button>
                                                                                                );
                                                                                            },
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            }

                                                                            return (
                                                                                <div className="space-y-2">
                                                                                    {options.map(
                                                                                        (
                                                                                            opt,
                                                                                        ) => {
                                                                                            const isSelected =
                                                                                                responses[
                                                                                                    fieldKey
                                                                                                ] ===
                                                                                                opt;
                                                                                            return (
                                                                                                <button
                                                                                                    key={
                                                                                                        opt
                                                                                                    }
                                                                                                    type="button"
                                                                                                    onClick={() => {
                                                                                                        setValue(
                                                                                                            `audits.${index}.responses.${fieldKey}`,
                                                                                                            opt,
                                                                                                            {
                                                                                                                shouldValidate: true,
                                                                                                                shouldDirty: true,
                                                                                                            },
                                                                                                        );
                                                                                                        auditFields
                                                                                                            .slice(
                                                                                                                fIdx +
                                                                                                                    1,
                                                                                                            )
                                                                                                            .forEach(
                                                                                                                (
                                                                                                                    subField,
                                                                                                                ) => {
                                                                                                                    const subKey =
                                                                                                                        generateFieldKey(
                                                                                                                            subField,
                                                                                                                        );
                                                                                                                    setValue(
                                                                                                                        `audits.${index}.responses.${subKey}`,
                                                                                                                        "",
                                                                                                                        {
                                                                                                                            shouldValidate: true,
                                                                                                                            shouldDirty: true,
                                                                                                                        },
                                                                                                                    );
                                                                                                                },
                                                                                                            );
                                                                                                    }}
                                                                                                    className={`w-full px-4 py-2.5 rounded-md border-2 text-left flex items-center gap-3 transition-all ${
                                                                                                        isSelected
                                                                                                            ? "border-black bg-gray-50 shadow-sm"
                                                                                                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                                                                                    }`}
                                                                                                >
                                                                                                    <div
                                                                                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                                                                            isSelected
                                                                                                                ? "border-indigo-500"
                                                                                                                : "border-gray-300"
                                                                                                        }`}
                                                                                                    >
                                                                                                        {isSelected && (
                                                                                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <span
                                                                                                        className={`text-sm ${
                                                                                                            isSelected
                                                                                                                ? "text-indigo-700 font-medium"
                                                                                                                : "text-gray-700"
                                                                                                        }`}
                                                                                                    >
                                                                                                        {
                                                                                                            opt
                                                                                                        }
                                                                                                    </span>
                                                                                                </button>
                                                                                            );
                                                                                        },
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })()
                                                                    ) : (
                                                                        <input
                                                                            type="text"
                                                                            {...register(
                                                                                `audits.${index}.responses.${fieldKey}`,
                                                                                {
                                                                                    required:
                                                                                        fieldItem.required,
                                                                                    onChange:
                                                                                        (
                                                                                            e,
                                                                                        ) => {
                                                                                            if (
                                                                                                !e
                                                                                                    .target
                                                                                                    .value
                                                                                            ) {
                                                                                                auditFields
                                                                                                    .slice(
                                                                                                        fIdx +
                                                                                                            1,
                                                                                                    )
                                                                                                    .forEach(
                                                                                                        (
                                                                                                            subField,
                                                                                                        ) => {
                                                                                                            const subKey =
                                                                                                                generateFieldKey(
                                                                                                                    subField,
                                                                                                                );
                                                                                                            setValue(
                                                                                                                `audits.${index}.responses.${subKey}`,
                                                                                                                "",
                                                                                                                {
                                                                                                                    shouldValidate: true,
                                                                                                                    shouldDirty: true,
                                                                                                                },
                                                                                                            );
                                                                                                        },
                                                                                                    );
                                                                                            }
                                                                                        },
                                                                                },
                                                                            )}
                                                                            className={`w-full bg-white border rounded-md px-4 py-3 text-sm focus:outline-none transition-all ${
                                                                                hasError
                                                                                    ? "border-red-500 ring-2 ring-red-500/20"
                                                                                    : currentValue
                                                                                      ? "border-emerald-500 ring-2 ring-emerald-500/20"
                                                                                      : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                                            }`}
                                                                            placeholder={`Enter ${fieldItem.field_label || fieldItem.name}`}
                                                                        />
                                                                    )}
                                                                    {hasError && (
                                                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                                            <AlertCircle
                                                                                size={
                                                                                    12
                                                                                }
                                                                            />
                                                                            This
                                                                            field
                                                                            is
                                                                            required
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            );
                                                        },
                                                    )
                                                ) : (
                                                    <div className="text-center py-16">
                                                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                                                            <AlertCircle
                                                                size={32}
                                                                className="text-gray-400"
                                                            />
                                                        </div>
                                                        <p className="text-gray-600 font-medium text-lg">
                                                            No audit fields
                                                            configured
                                                        </p>
                                                        <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
                                                            Please contact your
                                                            administrator to set
                                                            up audit fields for
                                                            this agency
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Instructions & Submit Section */}
                                    <div className="space-y-6">
                                        {/* Instructions Box */}
                                        <div className="bg-zinc-200 border border-zinc-100 rounded-md p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                                        Audit Instructions
                                                    </h3>
                                                    <ul className="space-y-2">
                                                        {[
                                                            "All fields marked with * are required",
                                                            "Please review information before submitting",
                                                            "Cancelled audits cannot be recovered",
                                                            "Submitted audits cannot be edited",
                                                        ].map((step, i) => (
                                                            <li
                                                                key={i}
                                                                className="flex items-center gap-3 text-sm font-medium text-zinc-600"
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                                                {step}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Error/Success Feedbacks (Small/Clean) */}
                                        {hasErrors && (
                                            <div className="bg-red-50 border border-red-100 rounded-md p-4 flex items-center gap-3 text-red-700">
                                                <AlertCircle size={18} />
                                                <span className="text-sm font-medium">
                                                    Please correct the errors
                                                    before submitting.
                                                </span>
                                            </div>
                                        )}

                                        {/* Main Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full bg-[#18181b] text-white py-4 rounded-md font-bold hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-black/5 text-lg"
                                        >
                                            {isProcessing
                                                ? "Submitting..."
                                                : "Submit Audit"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </form>
                </main>
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: `.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; overflow-x: auto; }`,
                }}
            />
        </UserLayout>
    );
}
