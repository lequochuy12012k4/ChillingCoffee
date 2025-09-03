"use client";

import Navbar from "@/app/components/client/Navbar";
import Footer from "@/app/components/client/Footer";
import { useMemo, useState } from "react";

export default function CharityPage() {

    const bank = process.env.NEXT_PUBLIC_VIETQR_BANK; // e.g. "vcb"
    const account = process.env.NEXT_PUBLIC_VIETQR_ACCOUNT; // e.g. "0123456789"
    const accountName = process.env.NEXT_PUBLIC_VIETQR_ACCOUNT_NAME || ""; // optional
    const template = process.env.NEXT_PUBLIC_VIETQR_TEMPLATE || "qr_only"; // qr_only | compact | etc.
    const description = process.env.NEXT_PUBLIC_VIETQR_DESCRIPTION || "";
    const qrSrc = `https://img.vietqr.io/image/${bank}-${account}-${template}.jpg?&addInfo=${description}&accountName=${accountName}`;
    return (
        <>
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                <section className="text-center space-y-3">
                    <h1 className="text-3xl font-semibold">Support Our Charity Efforts</h1>
                    <p className="text-gray-600">
                        We believe in giving back. Your contribution helps us sponsor community programs, education,
                        and local initiatives. Every donation—big or small—makes a difference.
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border rounded p-5 shadow-sm">
                        <h2 className="font-medium text-lg">Community Meals</h2>
                        <p className="text-gray-600 mt-2">Provide meals to those in need through local kitchens.</p>
                    </div>
                    <div className="bg-white border rounded p-5 shadow-sm">
                        <h2 className="font-medium text-lg">Education Grants</h2>
                        <p className="text-gray-600 mt-2">Fund after-school tutoring and learning materials.</p>
                    </div>
                    <div className="bg-white border rounded p-5 shadow-sm">
                        <h2 className="font-medium text-lg">Community Spaces</h2>
                        <p className="text-gray-600 mt-2">Maintain clean, safe spaces for events and gatherings.</p>
                    </div>
                </section>

                <section className="bg-white border rounded p-6 shadow-sm">
                    <h2 className="text-xl font-medium">How You Can Help</h2>
                    <ul className="mt-3 list-disc list-inside text-gray-700 space-y-1">
                        <li>Donate once or set up a recurring donation</li>
                        <li>Share this page with friends and family</li>
                        <li>Volunteer in our community events</li>
                    </ul>
                </section>

                <section className="text-center bg-gray-50 border rounded p-6">
                    <h2 className="text-xl font-medium">Donate via QR Code</h2>
                    <p className="text-gray-600 mt-2">Scan the QR code below to complete your donation securely.</p>
                    <div className="mt-5 flex justify-center">
                        <div className="w-full max-w-[36rem] aspect-square border rounded bg-white p-3">
                            <img
                                src={qrSrc}
                                alt="Charity QR Code"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                        Mỗi đóng góp 50.000 VNĐ của bạn sẽ tương đương với một gói đồ ăn hằng tuần cho những người nghèo. Hãy đóng góp để không còn ai phải đói.
                    </p>
                </section>
            </main>
            <Footer />
        </>
    );
}

