"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Eye, EyeOff, Loader2, Lock, Mail, ArrowRight} from "lucide-react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {SignInAction} from "@/server/apiCalls";

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Zod schema for form validation
    const schema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    });

    type FormData = z.infer<typeof schema>;

    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const handleLoading = (isLoading: boolean) => {
        setIsLoading(isLoading);
    };

    const onSubmit = async (data: FormData) => {
        if (!data.email || !data.password) {
            toast.error("Please fill all the fields");
            return;
        }

        try {
            setIsLoading(true);
            const res = await SignInAction(data.email, data.password);

            if (res.error) {
                toast.error("Sign in failed", {
                    duration: 3000,
                    description: res.error,
                });
            } else {
                toast.success("Welcome back", {
                    duration: 3000,
                    description: "Login was successful",
                });
                router.push("/");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 min-h-screen">
            {/* Left side - Welcome Message */}
            <div
                className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 p-8">
                <div className="max-w-md space-y-6 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-lg text-gray-600">
                        Sign in to your account to continue your journey with us.
                    </p>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile welcome message */}
                    <div className="md:hidden text-center space-y-2">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            Sign In
                        </h1>
                        <p className="text-sm text-gray-600">Welcome back to your account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            {/* Email field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-orange-400"/>
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="you@example.com"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base bg-gray-50"
                                        {...register("email")}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password field */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors duration-200"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-orange-400"/>
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="••••••••"
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base bg-gray-50"
                                        {...register("password")}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-orange-400"/>
                                        ) : (
                                            <Eye className="h-5 w-5 text-orange-400"/>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin"/>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="ml-2 h-5 w-5"/>
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                href="/auth/signup"
                                className="font-medium text-orange-600 hover:text-orange-500 transition-colors duration-200"
                            >
                                Sign up for free
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
