import React from "react";

const MobileSkeleton = () => {
    return (
        <div className="flex flex-col min-h-screen animate-pulse">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 bg-orange-200">
                <div className="h-6 w-24 bg-gray-300 rounded"></div>
                <div className="h-8 w-8 bg-gray-300 rounded"></div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center  bg-orange-100 px-4 py-8 space-x-2">
                <div className="h-10 w-24 bg-gray-300 rounded"></div>
                <div className="flex-1 h-10 bg-gray-300 rounded"></div>
                <div className="h-10 w-10 bg-gray-300 rounded"></div>
            </div>
            {/* Skeleton Loader */}
            <div className="grid bg-white p-2 rounded-2xl grid-cols-4 md:grid-cols-4 gap-4 m-2 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-[100px] bg-gray-100 border border-gray-200 
        flex flex-col items-center justify-center rounded-2xl p-3"
                    >
                        {/* Icon Circle Placeholder */}
                        <div className="p-3 rounded-full bg-gray-200 mb-2 w-10 h-10"></div>

                        {/* Text Placeholder */}
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
            {/* Categories Grid */}
            <div className="grid grid-cols-3 gap-4 px-4 mt-4">
                {Array.from({ length: 15 }).map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-gray-300 rounded-full"></div>
                        <div className="h-3 w-16 bg-gray-300 rounded mt-2"></div>
                    </div>
                ))}
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-around items-center py-3 mt-auto border-t">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="h-6 w-6 bg-gray-300 rounded"></div>
                ))}
            </div>
        </div>
    );
};

export default MobileSkeleton;
