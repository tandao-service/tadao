import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Firestore instance

export const checkUserOnlineStatus = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const userData = docSnap.data();
    console.log("User Online:", userData.online);
    return userData.online; // true or false
  } else {
    console.log("User not found");
    return null;
  }
};


