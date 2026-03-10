// components/home/QuickChips.tsx
export default function QuickChips() {
    const items = [
        { label: "Post Ad", href: "/sell", icon: "🏷️", tone: "from-orange-50 to-orange-100 border-orange-200 text-orange-700" },
        { label: "Donated Items", href: "/donations", icon: "💚", tone: "from-green-50 to-green-100 border-green-200 text-green-700" },
        { label: "Auction", href: "/auction", icon: "⚖️", tone: "from-blue-50 to-blue-100 border-blue-200 text-blue-700" },
        { label: "Lost & Found", href: "/lost-and-found", icon: "🔎", tone: "from-purple-50 to-purple-100 border-purple-200 text-purple-700" },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map((x) => (
                <a
                    key={x.label}
                    href={x.href}
                    className={`rounded-2xl border bg-gradient-to-br ${x.tone} p-4 hover:shadow-md transition`}
                >
                    <div className="text-2xl">{x.icon}</div>
                    <div className="mt-2 text-sm font-extrabold">{x.label}</div>
                    <div className="text-xs opacity-70">Quick action</div>
                </a>
            ))}
        </div>
    );
}