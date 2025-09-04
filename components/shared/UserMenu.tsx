import { useState } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";


const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};
type Props = {
    userdata: any;
    handleOpenShop: (shopId: string) => void;
    handleOpenSettings: () => void;
}
const UserMenu = ({ userdata, handleOpenShop, handleOpenSettings }: Props) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const { user: currentUser, signOutUser } = useAuth(); // Firebase auth

    const handleLogout = () => {
        signOutUser();
        setMenuOpen(false);
        router.push("/"); // redirect to home after logout
    };

    return (
        <div className="relative">
            {userdata && currentUser ? (
                <>
                    {/* Avatar / Initials */}
                    <div
                        className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white tooltip tooltip-bottom hover:cursor-pointer"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {userdata.photo ? (
                            <img
                                src={userdata.photo}
                                alt="User"
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold rounded-full">
                                {getInitials(
                                    userdata.firstName,
                                    userdata.lastName
                                )}
                            </div>
                        )}
                    </div>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#1f1f1f] border dark:border-gray-700 rounded-md shadow-lg z-50">
                            <button
                                onClick={() => {
                                    handleOpenSettings();
                                    setMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => {
                                    handleOpenShop(userdata._id)
                                    setMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                My Ads
                            </button>
                            <button
                                onClick={() => {
                                    handleOpenSettings();
                                    setMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Settings
                            </button>
                            <hr className="border-gray-200 dark:border-gray-700" />
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </>
            ) : (<>
                {!currentUser && (<button
                    onClick={() => {
                        router.push("/auth");

                    }}
                    className="w-full text-left px-4 py-2 text-white  underline hover:text-black text-sm hover:bg-gray-100 hover:rounded-xl dark:hover:bg-gray-800"
                >
                    Login In
                </button>)}
            </>)}
        </div>
    );
};

export default UserMenu;
