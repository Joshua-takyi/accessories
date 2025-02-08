"use client";
import {Validator} from "@/utils/formValidate";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Loader2, Mail, Lock} from "lucide-react";
import Link from "next/link";
import {SignInAction} from "@/server/apiCalls";

export const SignIn = () => {
    const router = useRouter();
    const schema = z.object({
        email: z.string().email("Please enter a valid email"),
        password: z.string().min(1, "Password is required"),
    });

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm(Validator(schema));

    const onSubmit = async (data) => {
        if (!data.email || !data.password) {
            toast.error("Please fill in all fields", {
                description: "Both email and password are required to sign in.",
                duration: 3000,
            });
            return;
        }

        try {
            const res = await SignInAction(data);
            if (res.error) {
                toast.error("Sign in failed", {
                    description: res.error,
                    duration: 4000,
                });
            } else {
                toast.success("Welcome back!", {
                    description: "You've successfully signed in to your account.",
                    duration: 3000,
                });
                router.push("/");
            }
        } catch (error) {
            toast.error("Something went wrong", {
                description:
                    "Please try again later or contact support if the problem persists.",
                duration: 4000,
            });
        }
    };

    return (
        <main className="min-h-screen grid md:grid-cols-2">
            <div
                className="hidden md:flex bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-8">
                <div className="max-w-md text-center space-y-6">
                    <h1 className="text-4xl font-bold text-gray-800">Welcome Back!</h1>
                    <p className="text-lg text-gray-600">
                        We're excited to see you again. Sign in to access your account and
                        continue your journey.
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile welcome - only shows on small screens */}
                    <div className="md:hidden text-center space-y-2">
                        <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
                        <p className="text-sm text-gray-600">Sign in to your account</p>
                    </div>

                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                        method="post"
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email address
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                                        {...register("password")}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Remember me
                                </label>
                            </div>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin"/>
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                href="/auth/signup"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign up now
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
};