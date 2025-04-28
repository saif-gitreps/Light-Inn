import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { SignInFormData } from "../../../lib/shared-types";
import { useSignIn } from "../api/useSignIn";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import GuestLoginButton from "../../guest-login/components/GuestLoginButton";

function SignInForm() {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<SignInFormData>();

   const { mutate: signIn, isLoading } = useSignIn();

   const onSubmit = handleSubmit((data) => {
      signIn(data);
   });

   return (
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
         <div>
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

export default SignInForm;
