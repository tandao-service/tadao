// app/packages/page.tsx

import PackagesPageClient from "@/components/home/PackagesPageClient";


export const metadata = {
    title: "Packages | Tadao Market",
    description: "Choose a package to post and promote your ads on Tadao Market.",
};

export default function PackagesPage() {
    return <PackagesPageClient />;
}