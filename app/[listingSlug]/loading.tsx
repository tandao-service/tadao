// app/[listingSlug]/loading.tsx
export default function Loading() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
                <p className="text-sm font-semibold text-orange-600">Loading...</p>
            </div>
        </main>
    );
}