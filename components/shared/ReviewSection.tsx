import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star, Send, X, CheckCircle, Phone, Mail, Circle } from "lucide-react";
import StarIcon from "@mui/icons-material/Star";
import { UpdateUserParams } from "@/types";
import { addDoc, collection, getDocs, limit, onSnapshot, query, serverTimestamp, Timestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IUser } from "@/lib/database/models/user.model";
import { ScrollArea } from "../ui/scroll-area";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SellerProfile from "./SellerProfile";
import SellerProfileReviews from "./SellerProfileReviews";
import CircularProgress from "@mui/material/CircularProgress";
interface Revieww {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}
type sidebarProps = {
  displayName: string;
  uid: string;
  recipientUid: string;
  photoURL: string;
  recipient: IUser;
  handleOpenReview: (value:string) => void;
  handleOpenChatId: (value:string) => void;
  handleOpenSettings: () => void;
  handlePay: (id:string) => void;
};
interface Review {
  text: string;
  name: string;
  avatar: string;
  createdAt: Timestamp; // Assuming createdAt is a Firestore timestamp
  uid: string;
  recipientUid: string;
  starClicked: boolean[];
}
const ReviewSection = ({
    uid,
    photoURL,
    displayName,
    recipientUid,
    recipient,
    handleOpenReview,
                      handleOpenChatId,
                      handleOpenSettings,
                      handlePay,
  }: sidebarProps) => {

const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
   const [isSending, setIsSending] = useState(false); 
  //const [recipientUid, setrecipientUid] = React.useState<string | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = () => {
      const senderMessagesQuery = query(
        collection(db, "reviews"),
        where("recipientUid", "==", recipientUid),

        limit(100)
      );

      const reviewsall = onSnapshot(senderMessagesQuery, (snapshot) => {
        const senderMessages: Review[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Review), // Cast to the Review type
        }));
        // Sort messages by createdAt timestamp
        senderMessages.sort((a, b) => {
          // Handle cases where createdAt might be null or undefined
          const createdAtA = a.createdAt ? a.createdAt.toMillis() : 0;
          const createdAtB = b.createdAt ? b.createdAt.toMillis() : 0;
          return createdAtA - createdAtB;
        });

        setMessages(senderMessages);
      });

      return () => {
        reviewsall();
      };
    };

    fetchMessages();
  }, [uid, recipientUid]);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom();
  }, [messages]);

    
  //const [reviews, setReviews] = useState<Review[]>([
   // {
     // id: 1,
  //    name: "John Doe",
   //   avatar: "/avatar1.png",
  //    rating: 4,
  //    comment: "Great seller! The product was as described.",
   //   date: "March 15, 2024",
   // },
  //  {
     // id: 2,
   //   name: "Jane Smith",
   //   avatar: "/avatar2.png",
   //   rating: 5,
   //   comment: "Excellent service, highly recommended!",
   //   date: "March 18, 2024",
    //},
  //]);

  const [newReview, setNewReview] = useState({
    comment: "",
    rating: 0,
  });

const [showForm, setShowForm] = useState(false);
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


  //const handleReviewSubmit = () => {
  //  if (newReview.name && newReview.comment && newReview.rating) {
    //  setReviews([
     //   ...reviews,
     //   {
//id: reviews.length + 1,
     //     name: newReview.name,
      //    avatar: "/default-avatar.png",
//rating: newReview.rating,
     //     comment: newReview.comment,
    //      date: new Date().toLocaleDateString(),
    //    },
    //  ]);
    //  setNewReview({ name: "", comment: "", rating: 0 });
    //  setShowForm(false);
//}
  //};
const handleReviewSubmit = async () => {

    if (newReview.comment && newReview.rating) {
      //  alert("Enter review!");
      //toast({
      //  variant: "destructive",
      //  title: "Failed!",
      //  description: "Write your review and send again!",
       // duration: 5000,
     // });
      return;
    }

    try {
      setIsSending(true); // Disable the button and show progress

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
      //  toast({
        //  variant: "destructive",
        //  title: "Failed!",
         // description: "You have already submitted a review for this Seller.",
        //  duration: 5000,
        //});
        await addDoc(collection(db, "reviews"), {
          text: newReview.comment,
          name: displayName,
          avatar: photoURL,
          createdAt: serverTimestamp(),
          uid,
          recipientUid,
          starClicked,
        });
      } else {
        // Allow the user to submit a new review
        await addDoc(collection(db, "reviews"), {
          text: newReview.comment,
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
      console.error("Error sending review: ", error);
    } finally {
      setIsSending(false); // Re-enable the button and hide progress
    }
    setNewReview({ comment: "", rating: 0 });
    setShowForm(false);
    //setValue("");
   // setStarClicked([false, false, false, false, false]);
  };
  return (<>

     <div className="gap-2 hidden lg:inline w-[350px]  sidebar left-0 top-0 lg:p-4">
                    {/* Seller Profile Section */}
                    <div className="border rounded-lg flex w-full">
                <SellerProfileReviews
                      user={recipient}
                      loggedId={uid}
                      userId={uid}
                      handleOpenReview={handleOpenReview} 
                      handleOpenChatId={handleOpenChatId} 
                      handleOpenSettings={handleOpenSettings}
                      handlePay={handlePay}
                      />
              </div>
                  </div>
         
                  <div className="w-full lg:w-3/4 chat overflow-y-auto">
                    <div className="lg:hidden w-full sidebar lg:fixed mb-2 rounded-lg">
                      {/* Seller Profile Section */}
                      <div className="hidden">
              <SellerProfileReviews user={recipient} loggedId={uid} userId={uid} handleOpenReview={handleOpenReview} handleOpenChatId={handleOpenChatId} handleOpenSettings={handleOpenSettings} handlePay={handlePay}/>
            </div>
                    </div>
          
                    <ScrollArea className="h-[90vh] lg:h-[88vh] w-full dark:bg-[#2D3236] rounded-md border  lg:p-2">
                      
 {/* Reviews List (Scrollable) */}
 <div className="flex-1 overflow-y-auto space-y-2 w-full">
        {messages .slice()
              .reverse().map((review:any, index:number) => (
          <div
            key={index}
            className="p-1 border rounded-lg flex gap-3 items-start bg-gray-50"
          >
            <Image
              src={review.avatar}
              alt={review.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium text-gray-800">{review.name}</h4>
                <span className="text-gray-500 text-sm">  {review.createdAt?.seconds
    ? new Date(review.createdAt.seconds * 1000).toLocaleDateString()
    : "Date not available"}</span>
              </div>
              <div className="flex gap-1 text-yellow-500">

                {review.starClicked && 
                review.starClicked.map((clicked: boolean, index: any) => (
                                  <StarIcon
                                    key={index}
                                    sx={{ fontSize: 24, color: clicked ? "gold" : "gray" }}
                                  />
                ))}

              
              </div>
              <p className="text-gray-700 text-sm">{review.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Leave a Review Button (Fixed) */}
      <button
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-5 py-2 rounded-full shadow-lg"
        onClick={() => setShowForm(true)}
      >
        Leave a Review
      </button>

      {/* Review Form Popup */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">
                Leave a Review
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <textarea
              placeholder="Write a review..."
              className="w-full p-2 border rounded-md mb-2"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })}
            />
            <div className="flex gap-2 items-center">
              <span className="text-gray-700">Rating:</span>

                 {starClicked.map((clicked, index) => (
                    <StarIcon
                      key={index}
                      sx={{ fontSize: 36, color: clicked ? "gold" : "gray" }} // Change color based on clicked state
                      onClick={() => handleStarClick(index)} // Call handleStarClick function on click
                      className="ml-1 lg:ml-0 cursor-pointer mb-1"
                    />
                  ))}
            </div>
            <button
              disabled={isSending}
              className="w-full mt-3 bg-green-600 text-white p-2 rounded-lg flex items-center justify-center gap-2"
              onClick={() => handleReviewSubmit()}
            >
                {isSending && (
                                  <CircularProgress sx={{ color: "white" }} size={30} />
                                )}
                                {isSending ? " Submitting..." : " Submit"}
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
                     
                    </ScrollArea>
                  </div>
 
    </> );
};

export default ReviewSection;
