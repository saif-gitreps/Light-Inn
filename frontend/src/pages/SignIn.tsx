import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";

import * as apiServices from "../api-services";

export type SignInFormData = {
   email: string;
   password: string;
};

function SignIn() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();
   const { showToast } = useAppContext();

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isLoading },
   } = useForm<SignInFormData>();

   const mutation = useMutation(apiServices.signIn, {
      onSuccess: async () => {
         showToast({ message: "Welcome back!", type: "SUCCESS" });

         await queryClient.invalidateQueries("validateToken");

         navigate("/");
      },
      onError: (error: Error) => {
         showToast({ message: error.message, type: "ERROR" });
      },
   });

   const onSubmit = handleSubmit((data) => {
      mutation.mutate(data);
   });

   return (
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
         <div className="">
            <h1 className="text-3xl font-bold">Sign in</h1>
            <p className="text-lg font-normal">
               Do not have an account?{" "}
               <Button variant="outline" type="button" asChild>
                  <Link to="/sign-up" className="text-lg">
                     Sign up
                     <ArrowRight size={24} />
                  </Link>
               </Button>
            </p>
         </div>

         <div className="flex flex-col md:flex-row gap-5">
            <label htmlFor="email" className="text-gray-700 text-md font-bold flex-1">
               Email:
               <input
                  type="email"
                  id="email"
                  className="border w-full border-gray-400 rounded p-2 font-normal"
                  {...register("email", {
                     required: "Email is required",
                  })}
               />
               {errors.email && (
                  <span className="text-red-600">{errors.email.message}</span>
               )}
            </label>

            <label htmlFor="password" className="text-gray-700 text-md font-bold flex-1">
               Password:
               <input
                  type="password"
                  id="password"
                  className="border w-full border-gray-400 rounded p-2 font-normal"
                  {...register("password", {
                     required: "Password is required",

                     minLength: {
                        value: 6,
                        message: "Password should be at least 6 characters",
                     },
                  })}
               />
               {errors.password && (
                  <span className="text-red-600">{errors.password.message}</span>
               )}
            </label>
         </div>

         <Button
            type="submit"
            className="w-36 text-lg"
            disabled={isLoading || isSubmitting}
         >
            Submit
         </Button>
      </form>
   );
}

export default SignIn;
