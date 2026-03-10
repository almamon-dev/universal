import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const discoveryData = [
    {
        id: "section-a",
        title: "SECTION A — BUSINESS GOALS",
        subtitle: "Choose the situation that fits best.",
        questions: [
            {
                id: "q1",
                text: "Identify your primary reason for seeking discovery for your agency's internal system?",
                options: [
                    "Wanted to increase Scaling",
                    "AC Systemized",
                    "Trying Exit",
                    "Optimization",
                ],
            },
            {
                id: "q2",
                text: "Which business goal are you currently struggling with most?",
                options: [
                    "Team effort: managing communication and task",
                    "Lack of systemization to work efficiently",
                    "Finding the right people for the team",
                ],
            },
        ],
    },
    {
        id: "section-b",
        title: "SECTION B — ROLE PERCEPTION",
        subtitle: "Operational involvement.",
        questions: [
            {
                id: "q3",
                text: "Who is actually doing the daily operations of the agency right now?",
                options: [
                    "My Agency Partner",
                    "Me, Personally",
                    "Advisors",
                    "C-Level",
                ],
            },
            {
                id: "q4",
                text: "If you were removed from your current daily work system implementation, would it keep going the same or better?",
                options: ["Yes", "No"],
            },
            {
                id: "q5",
                text: "How often are you doing daily admin tasks or repetitive work currently?",
                options: ["Always", "Daily", "Occasionally"],
            },
        ],
    },
    {
        id: "section-c",
        title: "SECTION C — INVESTMENT",
        subtitle: "Priorities & Awareness.",
        questions: [
            {
                id: "q6",
                text: "What are your priorities right now when it comes to time & money focus?",
                options: [
                    "Sales/Staffing business",
                    "Internal systemsized work",
                    "Product/Service research",
                ],
            },
            {
                id: "q7",
                text: "Are you aware of why your internal processes are not scalable yet?",
                options: ["Yes, I am aware", "No, I am still figuring it out"],
            },
        ],
    },
    {
        id: "section-d",
        title: "SECTION D — QC EXPECTATION",
        subtitle: "Fixing the internal framework.",
        questions: [
            {
                id: "q8",
                text: "What are you currently hoping to fix in your agency?",
                options: [
                    "Internal coordination",
                    "Team management",
                    "Monitoring",
                    "Data analysis",
                    "Exit strategy",
                ],
            },
            {
                id: "q9",
                text: "QC role Major responsibilities?",
                options: [
                    "Quality check",
                    "Monitoring & follow ups",
                    "Reviewing tasks",
                    "General Coordination",
                ],
            },
        ],
    },
    {
        id: "section-e",
        title: "SECTION E — PATH & CONTROL",
        subtitle: "Final Assessment.",
        questions: [
            {
                id: "q10",
                text: "How much time do you spend monthly on your current business?",
                options: [
                    "Full time (Focused)",
                    "Part time (Multiple projects)",
                    "Passive management",
                ],
            },
            {
                id: "q11",
                text: "If you had to choose one focus, which one would you select as priority?",
                options: [
                    "Revenue increase",
                    "System optimization",
                    "Team building",
                    "Exit plan",
                ],
            },
            {
                id: "q12",
                text: "Level of trust in the agency after all recent struggle?",
                options: [
                    "Highly confident",
                    "Starting to doubt",
                    "Needs to change",
                    "Ready to fix",
                ],
            },
        ],
    },
];

const SectionBox = ({ title, subtitle, footerNote, children }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="space-y-1 pb-4 border-b border-gray-100">
            <h2 className="text-xs font-medium text-gray-900 uppercase tracking-wider">
                {title}
            </h2>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>

        <div className="space-y-6">{children}</div>

        {footerNote && (
            <div
                className={`pt-4 ${footerNote.includes("Diagnostic signal") ? "" : "border-t border-gray-100"}`}
            >
                {footerNote.includes("Diagnostic signal") ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                        <span className="text-sm text-amber-900 leading-relaxed">
                            <strong>Diagnostic signal:</strong>{" "}
                            {footerNote
                                .replace("Diagnostic signal:", "")
                                .replace("Diagnostic signal", "")}
                        </span>
                    </div>
                ) : (
                    <p className="text-xs text-gray-500 italic">{footerNote}</p>
                )}
            </div>
        )}
    </div>
);

const QuestionField = React.memo(
    ({ question, options, qId, type = "radio", data, onChange }) => (
        <div className="space-y-3">
            <label className="text-sm text-gray-700 block font-medium">
                {question}
            </label>

            <div className="space-y-2">
                {options.map((option, idx) => (
                    <label
                        key={`${qId}-${idx}`}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <input
                            type={type || "radio"}
                            name={qId}
                            checked={
                                type === "checkbox"
                                    ? Array.isArray(data[qId]) &&
                                      data[qId].includes(option)
                                    : data[qId] === option
                            }
                            onChange={() =>
                                onChange(qId, option, type || "radio")
                            }
                            className={`w-4 h-4 border-gray-300 text-gray-900 focus:ring-0 focus:ring-offset-0 ${type === "radio" || !type ? "rounded-full" : "rounded"}`}
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">
                            {option}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    ),
);

export default function OwnerDiscovery({ agency, discovery }) {
    const { data, setData, post, processing } = useForm({
        data: discovery || {},
    });

    const handleSave = () => {
        post(route("admin.agencies.discovery.update", [agency.id, "owner"]), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Progress saved successfully!");
            },
        });
    };

    const handleOptionChange = React.useCallback(
        (qId, value, type = "radio") => {
            setData((prevData) => {
                if (type === "checkbox") {
                    const currentValues = Array.isArray(prevData.data[qId])
                        ? prevData.data[qId]
                        : [];
                    const newValues = currentValues.includes(value)
                        ? currentValues.filter((v) => v !== value)
                        : [...currentValues, value];

                    return {
                        ...prevData,
                        data: {
                            ...prevData.data,
                            [qId]: newValues,
                        },
                    };
                } else {
                    return {
                        ...prevData,
                        data: {
                            ...prevData.data,
                            [qId]: value,
                        },
                    };
                }
            });
        },
        [setData],
    );

    return (
        <AdminLayout>
            <Head title={`Owner System Discovery - ${agency.name}`} />

            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Link
                                href={route(
                                    "admin.agencies.discovery",
                                    agency.id,
                                )}
                                className="p-2 text-gray-400 hover:text-gray-600"
                            >
                                <ArrowLeft size={18} />
                            </Link>
                            <div>
                                <h1 className="text-xl font-medium text-gray-900">
                                    Owner System Discovery
                                </h1>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {agency.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-4">
                        {discoveryData.map((section) => (
                            <SectionBox
                                key={section.id}
                                title={section.title}
                                subtitle={section.subtitle}
                                footerNote={section.footerNote}
                            >
                                {section.questions.map((q) => (
                                    <QuestionField
                                        key={q.id}
                                        qId={q.id}
                                        question={q.text}
                                        options={q.options}
                                        type={q.type || "radio"}
                                        data={data.data}
                                        onChange={handleOptionChange}
                                    />
                                ))}
                            </SectionBox>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={processing}
                            className="px-8 py-3 bg-black text-white text-[13px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50 active:scale-95"
                        >
                            {processing ? "Saving..." : "Save Progress"}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
