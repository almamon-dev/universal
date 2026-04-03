import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";

export default function Revenue({ agency }) {
    return (
        <AdminLayout>
            <Head title="Revenue Report" />
            <div className="p-12 text-center">
                <Link href={route('admin.report.index', agency?.id)} className="text-blue-600 mb-8 inline-block">Back</Link>
                <h1 className="text-2xl font-bold">Revenue Analytics Dashboard</h1>
            </div>
        </AdminLayout>
    );
}
