import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const discoveryData = [
    {
        id: "section-a",
        title: "SECTION A — NEW SUB OPENING BEHAVIOR",
        subtitle:
            "Purpose: Detect whether openings are process-driven or instinct-driven.",
        questions: [
            {
                id: "q_a1",
                text: "Walk me through your first 5–10 messages with a brand new subscriber.",
                type: "textarea",
                placeholder: "Explain your process...",
            },
            {
                id: "q_a2",
                text: "What is your first goal?",
                type: "textarea",
                placeholder: "Your goal...",
            },
            {
                id: "q_a3",
                text: "Which best describes your default approach?",
                type: "radio",
                options: [
                    "Fact-finding / getting to know the sub",
                    "Building arousal first",
                    "Selling immediately",
                    "Depends on the sub",
                ],
            },
            {
                id: "q_a4",
                text: "If a new sub is 'hot', what do you do first?",
                type: "radio",
                options: [
                    "Slow down and fact-find",
                    "Escalate arousal",
                    "Offer content quickly",
                    "Ask QC first",
                ],
            },
            {
                id: "q_a5",
                text: "Is there a written guideline that tells you when it's acceptable to sell to a new sub?",
                type: "radio",
                options: ["Yes", "No", "Not sure"],
            },
        ],
        footerNote:
            "Diagnostic signal: If answers vary widely → no enforced opening process.",
    },
    {
        id: "section-b",
        title: "SECTION B — RETURNING / OLD SUB HANDLING",
        subtitle: "Purpose: Expose continuity gaps.",
        questions: [
            {
                id: "q_b1",
                text: "How do you usually re-engage a sub who: Chatted before, Didn't buy, Comes back days later",
                type: "textarea",
                placeholder: "Describe your flow...",
            },
            {
                id: "q_b2",
                text: "Do you reference:",
                type: "checkbox",
                options: [
                    "Past conversations",
                    "Preferences",
                    "Previous objections",
                ],
            },
            {
                id: "q_b3",
                text: "Is there a documented process for handling: Returning non-buyers? Returning buyers?",
                type: "radio",
                options: ["Yes", "No", "I just remember"],
            },
        ],
        footerNote: "Diagnostic signal: 'Remembering' = no system.",
    },
    {
        id: "section-c",
        title: "SECTION C — TIMING & ESCALATION TO SELLING",
        subtitle: "Purpose: Detect arbitrary timing.",
        questions: [
            {
                id: "q_c1",
                text: "Before initiating sexual talk or selling, do you follow:",
                type: "checkbox",
                options: [
                    "A set number of messages",
                    "A set amount of time",
                    "Your judgment",
                    "QC guidance",
                ],
            },
            {
                id: "q_c2",
                text: "Can you point to a written rule that defines when selling is allowed?",
                type: "radio",
                options: ["Yes", "No"],
            },
            {
                id: "q_c3",
                text: "What usually causes you to start selling?",
                type: "radio",
                options: [
                    "Sub cues",
                    "Time passed",
                    "Pressure to convert",
                    "QC instruction",
                ],
            },
        ],
        footerNote:
            "Diagnostic signal: 'Judgment' + 'pressure' = traffic-dependent execution.",
    },
    {
        id: "section-d",
        title: "SECTION D — TIMEWASTER IDENTIFICATION",
        subtitle: "Purpose: Expose undefined categorization.",
        questions: [
            {
                id: "q_d1",
                text: "How do you personally define a timewaster?",
                type: "textarea",
                placeholder: "Definition...",
            },
            {
                id: "q_d2",
                text: "What behaviors qualify a sub as a timewaster? (List)",
                type: "textarea",
                placeholder: "List behaviors...",
            },
            {
                id: "q_d3",
                text: "Is there a documented definition of a timewaster?",
                type: "radio",
                options: ["Yes", "No", "I think so"],
            },
            {
                id: "q_d4",
                text: "Once you believe someone is a timewaster, what do you do?",
                type: "radio",
                options: [
                    "Keep chatting",
                    "Change strategy",
                    "Escalate",
                    "Ask QC",
                    "Ignore",
                ],
            },
        ],
        footerNote:
            "Diagnostic signal: Different definitions = inconsistent enforcement.",
    },
    {
        id: "section-e",
        title: "SECTION E — PRICING & NEGOTIATION",
        subtitle: "Purpose: Detect pricing discipline vs improvisation.",
        questions: [
            {
                id: "q_e1",
                text: "Are content prices clearly documented?",
                type: "radio",
                options: ["Yes", "No"],
            },
            {
                id: "q_e2",
                text: "Are you allowed to negotiate pricing?",
                type: "radio",
                options: ["Yes", "No", "Depends"],
            },
            {
                id: "q_e3",
                text: "Have you ever offered a price you weren't sure was allowed?",
                type: "radio",
                options: ["Yes", "No"],
            },
        ],
        footerNote:
            "Diagnostic signal: 'Depends' without documentation = Rule #5 failure.",
    },
    {
        id: "section-f",
        title: "SECTION F — STYLE & COMMUNICATION GUIDELINES",
        subtitle: "Purpose: Separate brand rules from personal habit.",
        questions: [
            {
                id: "q_f1",
                text: "Are there written guidelines for:",
                type: "checkbox",
                options: [
                    "Emoji usage",
                    "Capitalization",
                    "Nicknames (baby, love, etc.)",
                    "Tone",
                ],
            },
            {
                id: "q_f2",
                text: "If guidelines exist, how often do you reference them?",
                type: "radio",
                options: ["Always", "Sometimes", "Never"],
            },
            {
                id: "q_f3",
                text: "If two chatters chat differently, is that:",
                type: "radio",
                options: ["Allowed", "Discouraged", "Undefined"],
            },
        ],
        footerNote:
            "Diagnostic signal: Undefined style = inconsistent brand experience.",
    },
    {
        id: "section-g",
        title: "SECTION G — QC DEPENDENCY (CRITICAL)",
        subtitle: "Purpose: Measure reliance on rescue.",
        questions: [
            {
                id: "q_g1",
                text: "How often do you ask QCs for:",
                type: "checkbox",
                options: ["Scripts", "Negotiation help", "What to say next"],
            },
            {
                id: "q_g2",
                text: "When a QC helps you, what usually happens after?",
                type: "radio",
                options: [
                    "I apply it next time",
                    "I forget",
                    "I ask again later",
                ],
            },
            {
                id: "q_g3",
                text: "If QCs were unavailable for a full shift, would you feel confident executing alone?",
                type: "radio",
                options: ["Yes", "No"],
            },
        ],
        footerNote:
            "Diagnostic signal: This question alone is devastatingly diagnostic.",
    },
];

const SectionBox = ({ title, subtitle, footerNote, children }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="space-y-1 pb-4 border-b border-gray-100">
            <h2 className="text-xs font-medium text-gray-900  tracking-wider">
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
    ({
        question,
        options,
        type = "radio",
        placeholder,
        qId,
        data,
        onChange,
    }) => (
        <div className="space-y-3">
            <label className="text-sm text-gray-700 block font-medium">
                {question}
            </label>

            {type === "textarea" ? (
                <textarea
                    placeholder={placeholder}
                    rows={4}
                    value={data[qId] || ""}
                    onChange={(e) => onChange(qId, e.target.value, "textarea")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all resize-none shadow-sm"
                />
            ) : (
                <div className="space-y-2">
                    {options.map((option, idx) => (
                        <label
                            key={`${qId}-${idx}`}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type={type}
                                name={qId}
                                checked={
                                    type === "checkbox"
                                        ? Array.isArray(data[qId]) &&
                                        data[qId].includes(option)
                                        : data[qId] === option
                                }
                                onChange={() => onChange(qId, option, type)}
                                className={`w-4 h-4 border-gray-300 text-gray-900 focus:ring-0 focus:ring-offset-0 ${type === "radio" ? "rounded-full" : "rounded"}`}
                            />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                {option}
                            </span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    ),
);

export default function ChatterDiscovery({ agency, discovery }) {
    const { data, setData, post, processing } = useForm({
        data: discovery || {},
    });

    const handleSave = () => {
        post(route("admin.agencies.discovery.update", [agency.id, "chatter"]), {
            preserveScroll: true,
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
            <Head title={`Chatter System Discovery - ${agency.name}`} />

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
                                    Chatter System Discovery
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
                                        type={q.type}
                                        placeholder={q.placeholder}
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
                            className="px-8 py-3 bg-black text-white text-[13px] font-black  tracking-widest rounded-sm hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50 active:scale-95"
                        >
                            {processing ? "Saving..." : "Save Progress"}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
