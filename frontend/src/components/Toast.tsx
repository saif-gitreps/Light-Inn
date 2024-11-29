import { useEffect } from "react";
import { CircleX } from "lucide-react";

type ToastProps = {
   message: string;
   type: "SUCCESS" | "ERROR";
   onclose: () => void;
};

function Toast({ message, type, onclose }: ToastProps) {
   useEffect(() => {
      const timer = setTimeout(() => {
         onclose();
      }, 6000);

      return () => clearTimeout(timer);
   }, [onclose]);

   const styles: string =
      type === "SUCCESS"
         ? "fixed bottom-4 left-4 z-50 p-4 rounded-md bg-white border shadow-lg text-green-700 max-w-md animate-bounce"
         : "fixed bottom-4 left-4 z-50 p-4 rounded-md bg-white border shadow-lg text-red-700 max-w-md animate-bounce";

   return (
      <div className={styles}>
         <div className="flex justify-center items-center">
            <span className="text-lg font-semibold mr-1">{message}</span>

            <CircleX
               onClick={onclose}
               size={20}
               className="stroke-red-600 hover:opacity-80 hover:cursor-pointer"
            />
         </div>
      </div>
   );
}

export default Toast;
