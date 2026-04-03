import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function Summary({ agency }) {
    return (
        <AdminLayout>
            <Head title="Summary Report" />
            <div className="p-12 text-center">
                <Link href={route('admin.report.index', agency?.id)} className="text-blue-600 mb-8 inline-block">Back</Link>
                <h1 className="text-2xl font-bold">Summary Report Content</h1>
            </div>
        </AdminLayout>
    );
}
