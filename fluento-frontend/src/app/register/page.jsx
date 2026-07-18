"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiLoader, FiCheck } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    // Real-time password validation
    const validationRules = {
        minLength: passwordInput.length >= 8,
        hasUppercase: /[A-Z]/.test(passwordInput),
        hasLowercase: /[a-z]/.test(passwordInput),
        hasNumber: /[0-9]/.test(passwordInput),
    };

    const isPasswordValid = 
        validationRules.minLength && 
        validationRules.hasUppercase && 
        validationRules.hasLowercase && 
        validationRules.hasNumber;

    // Show requirements only when user starts typing or focuses on the input
    const shouldShowRequirements = isPasswordFocused || passwordInput.length > 0;

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

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoadingMessage("Connecting to server...");

        const formData = new FormData(e.currentTarget);
        const { name, email, password } = Object.fromEntries(formData);

        if (!name || !email || !password) {
            toast.error('All fields are required');
            setIsLoading(false);
            return;
        }

        if (!isPasswordValid) {
            toast.error('Please fulfill all password requirements');
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await authClient.signUp.email({
                name,
                email,
                password
            });

            if (error) {
                toast.error(error?.message);
                setIsLoading(false);
                return;
            } else {
                toast.success(`Registration Successful! Welcome ${data?.user?.name}`);
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            console.error('betterAuth Register page error', error);
            toast.error(error.message);
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
                        Create an Account
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                        Join us and elevate your communication skills
                    </p>
                </div>

                {/* Google Sign-in */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 text-xs cursor-pointer"
                >
                    <FcGoogle className="w-5 h-5" />
                    <span>Continue with Google</span>
                </button>

                {/* Clean Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200/60"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-slate-400 font-bold tracking-wider text-[10px]">
                            Or register with email
                        </span>
                    </div>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleRegister} className="space-y-4">
                    
                    {/* Full Name */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                            Full Name
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <FiUser className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                name="name"
                                required
                                disabled={isLoading}
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-60 font-semibold"
                            />
                        </div>
                    </div>

                    {/* Email */}
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

                    {/* Password */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <FiLock className="w-4 h-4" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                disabled={isLoading}
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
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

                        {/* Password Requirements Logic */}
                        {shouldShowRequirements && (
                            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 bg-[#fdfdfd] border border-slate-100 rounded-xl p-4 transition-all duration-300">
                                
                                {/* Requirement 1: Length */}
                                <div className="flex items-center gap-2 text-xs font-medium">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${validationRules.minLength ? "bg-indigo-50 border-indigo-500 text-indigo-600" : "border-slate-300 bg-white"}`}>
                                        {validationRules.minLength && <FiCheck className="w-2.5 h-2.5 stroke-[3]" />}
                                    </div>
                                    <span className={validationRules.minLength ? "text-slate-700 font-semibold" : "text-slate-400"}>
                                        Min 8 characters
                                    </span>
                                </div>

                                {/* Requirement 2: Uppercase */}
                                <div className="flex items-center gap-2 text-xs font-medium">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${validationRules.hasUppercase ? "bg-indigo-50 border-indigo-500 text-indigo-600" : "border-slate-300 bg-white"}`}>
                                        {validationRules.hasUppercase && <FiCheck className="w-2.5 h-2.5 stroke-[3]" />}
                                    </div>
                                    <span className={validationRules.hasUppercase ? "text-slate-700 font-semibold" : "text-slate-400"}>
                                        One uppercase
                                    </span>
                                </div>

                                {/* Requirement 3: Lowercase */}
                                <div className="flex items-center gap-2 text-xs font-medium">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${validationRules.hasLowercase ? "bg-indigo-50 border-indigo-500 text-indigo-600" : "border-slate-300 bg-white"}`}>
                                        {validationRules.hasLowercase && <FiCheck className="w-2.5 h-2.5 stroke-[3]" />}
                                    </div>
                                    <span className={validationRules.hasLowercase ? "text-slate-700 font-semibold" : "text-slate-400"}>
                                        One lowercase
                                    </span>
                                </div>

                                {/* Requirement 4: Number */}
                                <div className="flex items-center gap-2 text-xs font-medium">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${validationRules.hasNumber ? "bg-indigo-50 border-indigo-500 text-indigo-600" : "border-slate-300 bg-white"}`}>
                                        {validationRules.hasNumber && <FiCheck className="w-2.5 h-2.5 stroke-[3]" />}
                                    </div>
                                    <span className={validationRules.hasNumber ? "text-slate-700 font-semibold" : "text-slate-400"}>
                                        One number
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
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
                            "Create Account"
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-center text-xs text-slate-500 font-medium mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="font-bold text-indigo-600 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}