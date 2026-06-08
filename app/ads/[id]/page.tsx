import { notFound, redirect } from "next/navigation";
import { getAdById, incrementAdMetric } from "@/lib/actions/dynamicAd.actions";
import { buildAdPath } from "@/app/_ad/ad-url";


type Props = {
    params: {
        id: string;
    };
};

export default async function Page({ params }: Props) {
    const ad = await getAdById(params.id).catch(() => null);

    if (!ad) return notFound();

    await incrementAdMetric(String(ad._id), "views");

    redirect(buildAdPath(ad));
}