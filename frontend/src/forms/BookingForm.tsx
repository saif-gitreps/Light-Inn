import { useForm } from "react-hook-form";
import { UserType } from "../../../backend/src/shared/types";

type BookingFormProps = {
   currentUser: UserType;
};

type BookingFormData = {
   firstName: string;
   lastName: string;
   email: string;
};

function BookingForm({ currentUser }: BookingFormProps) {
   const { handleSubmit, register } = useForm<BookingFormData>({
      defaultValues: {
         firstName: currentUser.firstName,
         lastName: currentUser.lastName,
         email: currentUser.email,
      },
   });

   return (
      <div className="grid grid-cols-1 gap-4 rounded border p-5">
         <span className="text-2xl font-bold">Please confirm your details</span>

         <div className="grid grid-cols-2 gap-6">
            <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
               First Name:
               <input
                  className="mt-1 border rounded w-full py-2 px-4 text-gray-600 bg-gray-50 font-semibold"
                  type="text"
                  readOnly
                  disabled
                  {...register("firstName")}
               />
            </label>

            <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
               Last Name:
               <input
                  className="mt-1 border rounded w-full py-2 px-4 text-gray-600 bg-gray-50 font-semibold"
                  type="text"
                  readOnly
                  disabled
                  {...register("lastName")}
               />
            </label>

            <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
               Email:
               <input
                  className="mt-1 border rounded w-full py-2 px-4 text-gray-600 bg-gray-50 font-semibold"
                  type="text"
                  readOnly
                  disabled
                  {...register("email")}
               />
            </label>
         </div>
      </div>
   );
}

export default BookingForm;
