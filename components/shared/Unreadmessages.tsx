import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";

type UnreadProp = {
  userId?: string; // mark optional to be safe
};

const Unreadmessages = ({ userId }: UnreadProp) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (!userId) return; // <-- skip query if userId is undefined

    const messagesQuery = query(
      collection(db, "messages"),
      where("recipientUid", "==", userId),
      where("read", "==", 1) // use number if your field is number
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      setUnreadCount(querySnapshot.size);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div>
      {unreadCount !== 0 && (
        <div className="bg-rose-600 shadow-lg rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-white">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default Unreadmessages;
