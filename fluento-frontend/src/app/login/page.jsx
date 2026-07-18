"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff, FiMail, FiLock, FiLoader } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setLoadingMessage("Connecting to Google...");
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch (error) {
            toast.error(error.message || "Google sign in failed");
            setIsLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoadingMessage("Verifying credentials...");

        const formData = new FormData(e.currentTarget);
        const { email, password } = Object.fromEntries(formData);

        if (!email || !password) {
            toast.error("Both email and password are required");
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
                callbackURL: "/"
            });

            if (error) {
                toast.error(error?.message || "Invalid email or password");
                setIsLoading(false);
                return;
            }

            toast.success(`Welcome back! ${data?.user?.name}`);
            router.push("/");
            router.refresh();

        } catch (error) {
            console.error("Authentication submission failure", error);
            toast.error(error.message || "An unexpected system error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#fafafa] flex items-center justify-center p-6 sm:p-12 selection:bg-indigo-600 selection:text-white font-sans antialiased">

            <div className="w-full max-w-md bg-white border border-slate-200/60 rounded-2xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_4px_35px_rgba(0,0,0,0.04)]">
                
                {/* Section header typography */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                        Sign in to your <span className="text-indigo-600 font-semibold">Fluento AI</span> account
                    </p>
                </div>

                {/* Social authentication control link */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 text-xs cursor-pointer"
                >
                    <FcGoogle className="w-5 h-5" />
                    <span>Continue with Google</span>
                </button>

                {/* Section partition layout separator */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200/60"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-slate-400 font-bold tracking-wider text-[10px]">
                            Or sign in with email
                        </span>
                    </div>
                </div>

                {/* Interactive credentials submission block */}
                <form onSubmit={handleLogin} className="space-y-4">
                    
                    {/* Electronic correspondence destination control */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <FiMail className="w-4 h-4" />
                            </span>
                            <input
                                type="email"
                                name="email"
                                required
                                disabled={isLoading}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-60 font-semibold"
                            />
                        </div>
                    </div>

                    {/* Cryptographic string validation input control */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider">
                                Password
                            </label>
                            <Link href="/forgot-password" className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-wider">
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <FiLock className="w-4 h-4" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                disabled={isLoading}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-60 font-semibold"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Verification submission activation element using brand gradient color */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-indigo-600/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none mt-6 text-sm cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <FiLoader className="w-4 h-4 animate-spin text-white" />
                                <span className="text-xs font-bold text-indigo-50">{loadingMessage}</span>
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                {/* Alternate navigation pathway linkage grid */}
                <p className="text-center text-xs text-slate-500 font-medium mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-bold text-indigo-600 hover:underline">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}