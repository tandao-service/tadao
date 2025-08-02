import React from 'react';

const TadaoServicesLogo: React.FC<{ size?: number; color1?: string; color2?: string }> = ({
    size = 100,
    color1 = '#004466', // Dark blue
    color2 = '#00B2D4', // Light cyan
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Background (optional transparent) */}
            {/* <circle cx="256" cy="256" r="256" fill="white" /> */}

            {/* Stylized "T" */}
            <rect x="240" y="96" width="32" height="320" rx="4" fill="#015873" />
            <rect x="128" y="192" width="112" height="32" rx="4" fill="#015873" />

            {/* Stylized "S" like arc */}
            <path
                d="M384 192h-80v32h48c17.6 0 32 14.4 32 32v0c0 17.6-14.4 32-32 32h-80v32h80c35.3 0 64-28.7 64-64s-28.7-64-64-64z"
                fill="#48C5C0"
            />
            <path
                d="M144 320c28 64 92.8 112 168 112s140-48 168-112h-40c-24.9 44.8-72.8 80-128 80s-103.1-35.2-128-80h-40z"
                fill="#48C5C0"
            />
        </svg>
    );
};

export default TadaoServicesLogo;
