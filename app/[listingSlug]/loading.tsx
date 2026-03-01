// app/[listingSlug]/loading.tsx
export default function Loading() {
    return (
        <main className="mx-auto max-w-6xl p-4">
            <div className="h-7 w-80 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-[280px] animate-pulse rounded-xl border bg-gray-100" />
                ))}
            </div>
        </main>
    );
}