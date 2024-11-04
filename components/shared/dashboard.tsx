"use client";
import EventForm from "@/components/shared/EventForm";
import { IAd } from "@/lib/database/models/ad.model";
type Package = {
  imageUrl: string;
  name: string;
  _id: string;
  description: string;
  price: string[];
  features: string[];
  color: string;
};
type dashboardProps = {
  userId: string;
  planId: string;
  daysRemaining: number;
  packname: string;
  userName: string;
  type: string;
  ad?: IAd;
  adId?: string;
  packagesList: any;
  listed: number;
  priority: number;
  expirationDate: Date;
  adstatus: string;
};
const dashboard = ({
  userId,
  planId,
  packname,
  userName,
  daysRemaining,
  type,
  ad,
  adId,
  packagesList,
  listed,
  priority,
  expirationDate,
  adstatus,
}: dashboardProps) => {
  return (
    <>
      <div className="max-w-6xl mx-auto flex mt-2 p-1">
        <div className="flex-1">
          <div className="rounded-sm max-w-6xl mx-auto lg:flex-row mt-0 p-0 justify-center">
            <EventForm
              userId={userId}
              type={type}
              ad={ad}
              adId={adId}
              planId={planId}
              userName={userName}
              daysRemaining={daysRemaining}
              packname={packname}
              listed={listed}
              priority={priority}
              expirationDate={expirationDate}
              adstatus={adstatus}
              packagesList={packagesList}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default dashboard;
