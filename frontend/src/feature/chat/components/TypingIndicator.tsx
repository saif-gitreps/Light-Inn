import React from "react";

const TypingIndicator: React.FC = () => {
   return (
      <div className="flex mb-4">
         <div className="bg-gray-200 p-3 rounded-lg">
            <div className="flex space-x-1">
               <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
               ></div>
               <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
               ></div>
               <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "600ms" }}
               ></div>
            </div>
         </div>
      </div>
   );
};

export default TypingIndicator;
