import { useEffect } from "react";
import { disconnectSocket, initializeSocket } from "../lib/websocket";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import ChatInterface from "../feature/chat/components/ChatInterface";

function Chat() {
   const { currentUser } = useAppContext();
   const { partnerId, partnerName } = useParams<{
      partnerId: string;
      partnerName: string;
   }>();

   useEffect(() => {
      initializeSocket();

      return () => {
         disconnectSocket();
      };
   }, [currentUser, partnerId]);

   return (
      <div>
         {partnerId ? (
            <ChatInterface
               currentUserId={currentUser?._id as string}
               chatPartnerId={partnerId as string}
               chatPartnerName={partnerName as string}
            />
         ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
               <Link to={"/inbox"}>Select a conversation to start chatting</Link>
            </div>
         )}
      </div>
   );
}

export default Chat;
