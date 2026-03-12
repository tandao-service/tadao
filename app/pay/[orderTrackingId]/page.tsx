// app/pay/[orderTrackingId]/page.tsx

import PayPageClient from "@/components/home/PayPageClient";


type Props = {
    params: {
        orderTrackingId: string;
    };
};

export default function Page({ params }: Props) {
    return <PayPageClient orderTrackingId={params.orderTrackingId} />;
}