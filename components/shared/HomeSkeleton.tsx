// components/HomeSkeleton.tsx
import React from "react";

export default function HomeSkeleton() {
    return (
        <div className="flex flex-col">
            {/* Top Banner Skeleton */}
            <div className="w-full h-48 bg-gray-200 animate-pulse" />

            <div className="flex max-w-7xl mx-auto w-full mt-6 px-4 gap-6">
                {/* Sidebar */}
                <div className="w-1/5 hidden md:block">
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-6 w-3/4 bg-gray-200 animate-pulse rounded" />
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Section Title */}
                    <div className="h-7 w-40 bg-gray-200 animate-pulse rounded mb-4" />

                    {/* Grid of Ads */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white border rounded-md p-2 shadow-sm"
                            >
                                <div className="h-32 bg-gray-200 animate-pulse rounded mb-3" />
                                <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
                                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
