// app/[listingSlug]/[productSlug]/lo
export default function Loading() {
    return (
        <main className="mx-auto max-w-6xl px-4 pt-[calc(var(--topbar-h,64px)+12px)] pb-8">
            <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
                <p className="text-sm font-semibold text-orange-600">Loading...</p>
            </div>
        </main>
    );
}