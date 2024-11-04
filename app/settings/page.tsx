import Navbar from "@/components/shared/navbar";
import SettingsEdit from "@/components/shared/SettingsEdit";
import { getUserById } from "@/lib/actions/user.actions";
import { Toaster } from "@/components/ui/toaster";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { auth } from "@clerk/nextjs/server";
import Verification from "@/components/shared/Verification";
import Image from "next/image";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Footersub from "@/components/shared/Footersub";
const Settings = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const user = await getUserById(userId);
  const isAdCreator = true;
  if (!user) {
    return (
      <div className="flex-center h-screen w-full bg-[#ebf2f7] bg-dotted-pattern bg-cover bg-fixed bg-center">
        <div className="top-0 z-10 fixed w-full">
          <Navbar userstatus="User" userId={userId || ""} />
        </div>
        <div className="max-w-6xl mx-auto mt-20">
          <div className="flex gap-1 items-center">
            <Image
              src="/assets/icons/loading.gif"
              alt="edit"
              width={60}
              height={60}
            />
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="z-10 top-0 fixed w-full">
        <Navbar userstatus="User" userId={userId} />
      </div>

      <div className="max-w-3xl mx-auto flex mt-20 p-1">
        <div className="hidden lg:inline mr-5"></div>

        <div className="flex-1">
          <div className="max-w-6xl mb-20 lg:mb-0 mx-auto justify-center">
            <section className="w-full rounded-lg bg-white p-1">
              <div className="w-full p-2 flex flex-col lg:flex-row lg:justify-between">
                <div className="flex text-lg mb-1 gap-1 font-bold">
                  <SettingsOutlinedIcon />
                  <h3 className="font-bold text-[25px]">Settings</h3>
                </div>
                <div className="flex">
                  <Verification
                    user={user}
                    userId={userId}
                    isAdCreator={isAdCreator}
                  />
                </div>
              </div>
            </section>

            <SettingsEdit user={user} type="Update" userId={userId} />
            <Toaster />
          </div>
        </div>
      </div>
      <footer>
        <div className="hidden lg:inline">
          <Footersub />
        </div>
        <div className="lg:hidden">
          <BottomNavigation userId={userId} />
        </div>
      </footer>
    </>
  );
};
export default Settings;
