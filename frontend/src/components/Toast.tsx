import { useEffect } from "react";
import { Button } from "./ui/button";
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
      }, 5000);

      return () => clearTimeout(timer);
   }, [onclose]);

   const styles: string =
      type === "SUCCESS"
         ? "fixed bottom-4 left-4 z-50 p-4 rounded-md bg-white border border-black text-green-700 max-w-md animate-bounce"
         : "fixed bottom-4 left-4 z-50 p-4 rounded-md bg-white border border-black text-red-700 max-w-md animate-bounce";

   return (
      <div className={styles}>
         <div className="flex justify-center items-center">
            <span className="text-lg font-semibold">{message}</span>
            <Button onClick={onclose} variant="link">
               <CircleX size={38} className="stroke-red-600 hover:opacity-80" />
            </Button>
         </div>
      </div>
   );
}

export default Toast;
