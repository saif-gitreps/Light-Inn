import React from "react";
import ChatSidebar from "../feature/chat/components/ChatSideBar";
import { useAppContext } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Inbox: React.FC = () => {
   const { currentUser } = useAppContext();
   const navigate = useNavigate();
   // Function to open the new conversation modal/page
   const openNewConversation = () => {
      navigate("/inbox/new"); // Navigate to a route that shows the new conversation component
   };

   return (
      <div className="h-screen">
         <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-bold text-lg">Messages</h2>

            <Button onClick={openNewConversation} variant={"outline"}>
               New Chat <Plus />
            </Button>
         </div>
         <div className="w-full border rounded-sm">
            <ChatSidebar currentUserId={currentUser?._id as string} />
         </div>
      </div>
   );
};

export default Inbox;
