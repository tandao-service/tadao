import PayPageClient from "./PayPageClient";

type Props = {
    params: {
        orderTrackingId: string;
    };
    searchParams?: Promise<{
        returnTo?: string;
    }>;
};

export default async function Page({ params, searchParams }: Props) {
    const sp = (await searchParams) || {};
    return (
        <PayPageClient
            orderTrackingId={params.orderTrackingId}
            returnTo={sp.returnTo || "/sell?resumePost=1"}
        />
    );
}