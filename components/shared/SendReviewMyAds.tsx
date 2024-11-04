"use client";
import { db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React from "react";
import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { useToast } from "@/components/ui/use-toast";
type sidebarProps = {
  displayName: string;
  uid: string;
  photoURL: string;
  recipientUid: string;
};
const SendReviewMyAds = ({
  uid,
  photoURL,
  displayName,
  recipientUid,
}: sidebarProps) => {
  const [value, setValue] = useState<string>("");
  const [star1, setStar1] = useState<number>(0);
  const [star2, setStar2] = useState<number>(0);
  const [star3, setStar3] = useState<number>(0);
  const [star4, setStar4] = useState<number>(0);
  const [star5, setStar5] = useState<number>(0);
  // const [recipientUid, setrecipientUid] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value.trim() === "") {
      //  alert("Enter review!");
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "Write your review and send again!",
        duration: 5000,
      });
      return;
    }

    try {
      // Check if a review already exists for the sender and recipient combination
      const reviewQuery = query(
        collection(db, "reviews"),
        where("uid", "==", uid), // Assuming senderUid is the UID of the current user
        where("recipientUid", "==", recipientUid)
      ); // Assuming recipientUid is the UID of the recipient

      const reviewSnapshot = await getDocs(reviewQuery);

      if (!reviewSnapshot.empty) {
        // A review already exists for the sender and recipient combination
        // You can display a message to the user indicating that they have already submitted a review
        //alert("You have already submitted a review for this Seller.");
        toast({
          variant: "destructive",
          title: "Failed!",
          description: "You have already submitted a review for this Seller.",
          duration: 5000,
        });
      } else {
        // Allow the user to submit a new review
        await addDoc(collection(db, "reviews"), {
          text: value,
          name: displayName,
          avatar: photoURL,
          createdAt: serverTimestamp(),
          uid,
          recipientUid,
          starClicked,
        });

        console.log("Review submitted successfully.");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setValue("");
    setStarClicked([false, false, false, false, false]);
  };
  const [starClicked, setStarClicked] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  // Function to handle click on a star
  const handleStarClick = (index: number) => {
    const updatedStarClicked = [...starClicked];
    updatedStarClicked[index] = !updatedStarClicked[index];
    setStarClicked(updatedStarClicked);
  };
  return (
    <>
      {recipientUid !== uid && (
        <div className="flex flex-col items-center">
          <form
            onSubmit={handleSendMessage}
            className="flex flex-col w-full justify-end items-center"
          >
            {recipientUid ? (
              <>
                <div className="text-base font-bold">Rate Seller</div>
                <div className="flex gap-2">
                  {starClicked.map((clicked, index) => (
                    <StarIcon
                      key={index}
                      sx={{ fontSize: 36, color: clicked ? "orange" : "gray" }} // Change color based on clicked state
                      onClick={() => handleStarClick(index)} // Call handleStarClick function on click
                      className="ml-1 lg:ml-0 cursor-pointer mb-1"
                    />
                  ))}
                </div>

                <div className="flex w-full p-1 justify-end">
                  <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="input border w-full p-2 focus:outline-none bg-white rounded-r-none rounded-l-lg"
                    type="text"
                    placeholder="Write your review..."
                  />
                  <button
                    type="submit"
                    className="p-3 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white rounded-r-lg px-5 text-sm"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-lg">Rate Seller with Star</div>

                <div className="flex gap-2">
                  {starClicked.map((clicked, index) => (
                    <StarIcon
                      key={index}
                      sx={{ fontSize: 36, color: clicked ? "orange" : "gray" }} // Change color based on clicked state
                      onClick={() => handleStarClick(index)} // Call handleStarClick function on click
                      className="cursor-pointer"
                    />
                  ))}
                </div>
                <div className="w-full flex pr-5">
                  <input
                    value={value}
                    disabled
                    className="input border w-full p-2 focus:outline-none bg-white rounded-r-none rounded-l-lg"
                    type="text"
                    placeholder="Enter your message..."
                  />
                  <button
                    type="submit"
                    disabled
                    className="w-auto bg-gradient-to-b from-emerald-800 to-emerald-900 text-white rounded-r-lg px-5 text-sm"
                  >
                    Send Review
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default SendReviewMyAds;
