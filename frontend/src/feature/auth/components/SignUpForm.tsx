import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useSignUp } from "../api/useSignUp";
import { Button } from "../../../components/ui/button";
import { SignUpFormData } from "../../../lib/shared-types";
import GuestLoginButton from "../../guest-login/components/GuestLoginButton";

function SignUpForm() {
   const {
      register,
      watch,
      handleSubmit,
      formState: { errors },
   } = useForm<SignUpFormData>();

   const { mutate: signUp, isLoading } = useSignUp();

   const onSubmit = handleSubmit((data) => {
      signUp(data);
   });

   return (
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
         <div>
            <h1 className="text-3xl font-bold">Create a new account</h1>
            <p className="text-lg font-normal">
               Already have an account?{" "}
               <Button variant="outline" type="button" asChild>
                  <Link to="/sign-in" className="text-lg">
                     Sign in
                     <ArrowRight size={24} />
                  </Link>
               </Button>
            </p>
         </div>

         <div className="flex flex-col md:flex-row gap-5">
            <label htmlFor="firstName" className="text-gray-700 text-md font-bold flex-1">
               First name:
               <input
                  type="text"
                  id="firstName"
                  className="border w-full border-gray-400 rounded p-2 font-normal"
                  {...register("firstName", {
                     required: "First name is required",

                     maxLength: {
                        value: 20,
                        message: "First name should be less than 20 characters",
                     },
                  })}
               />
               {errors.firstName && (
                  <span className="text-red-600">{errors.firstName.message}</span>
               )}
            </label>

            <label htmlFor="lastName" className="text-gray-700 text-md font-bold flex-1">
               Last name:
               <input
                  type="text"
                  id="lastName"
                  className="border w-full border-gray-400 rounded p-2 font-normal"
                  {...register("lastName", {
                     required: "Last name is required",

                     maxLength: {
                        value: 20,
                        message: "Last name should be less than 20 characters",
                     },
                  })}
               />
               {errors.lastName && (
                  <span className="text-red-600">{errors.lastName.message}</span>
               )}
            </label>
         </div>

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
            {errors.email && <span className="text-red-600">{errors.email.message}</span>}
         </label>

         <div className="flex flex-col md:flex-row gap-5">
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

            <label
               htmlFor="confirmPassword"
               className="text-gray-700 text-md font-bold flex-1"
            >
               Confirm Password:
               <input
                  type="password"
                  id="confirmPassword"
                  className="border w-full border-gray-400 rounded p-2 font-normal"
                  {...register("confirmPassword", {
                     validate: (value) => {
                        if (!value) {
                           return "Please confirm your password";
                        } else if (watch("password") !== value) {
                           return "Passwords do not match";
                        }
                     },

                     required: "Password is required",

                     minLength: {
                        value: 6,
                        message: "Password should be at least 6 characters",
                     },
                  })}
               />
               {errors.confirmPassword && (
                  <span className="text-red-600">{errors.confirmPassword.message}</span>
               )}
            </label>
         </div>

         <div className="flex items-center gap-2">
            <Button type="submit" className="w-36" disabled={isLoading}>
               {isLoading ? "Signing in.." : "Sign in"}
            </Button>

            <GuestLoginButton variant={"link"}>
               Sign in as a guest <ArrowUpRight />{" "}
            </GuestLoginButton>
         </div>
      </form>
   );
}

export default SignUpForm;
