"use client";

import Link from "next/link";
import { FaUser, FaEnvelope, FaLock, FaImage, FaGoogle } from "react-icons/fa";
// import Logo from "@/components/Logo";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();

        // from data collect
        const formData = new FormData(e.currentTarget);
        const { name, email, image, password, role } = Object.fromEntries(formData.entries());

        // password validation
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            toast.error("Password must include at least one uppercase letter!");
            return;
        }

        if (!/[a-z]/.test(password)) {
            toast.error("Password must include at least one lowercase letter!");
            return;
        }

        // betterAuth setup
        const { data, error } = await authClient.signUp.email({
            name,
            email,
            image,
            password,
            role,
        });
        
        if (error) {
            toast.error(error?.message)
            return;
        } else {
            toast.success('Registration Successful')
            router.push('/')
        }
    };

    const handleGoogleSignUp = () => {
        console.log("Google Auth Triggered");
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950">
            <div className="w-full max-w-md sm:max-w-lg border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-2xl p-6 sm:p-10 transition-all duration-300">

                {/* header section */}
                <div className="flex flex-col gap-1 items-center pb-6 text-center">
                    {/* <Logo /> */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-pink-500 bg-clip-text text-transparent mt-3">
                        Create an Account
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xs sm:max-w-none">
                        Join Ticketo to book premium events or host your own organization.
                    </p>
                </div>

                {/* from section */}
                <form onSubmit={handleSubmit} className="space-y-4 w-full">

                    {/* Full Name */}
                    <div className="form-control w-full">
                        <label className="label py-1" htmlFor="name">
                            <span className="label-text text-slate-300 text-xs sm:text-sm font-medium">Full Name</span>
                        </label>
                        <div className="relative flex items-center">
                            <FaUser className="absolute left-4 text-slate-400 text-sm pointer-events-none" />
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                autoComplete="name"
                                className="input input-bordered h-11 sm:h-12 w-full pl-11 bg-slate-950/50 border-white/10 text-white text-sm focus:border-pink-500 focus:outline-none placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="form-control w-full">
                        <label className="label py-1" htmlFor="email">
                            <span className="label-text text-slate-300 text-xs sm:text-sm font-medium">Email Address</span>
                        </label>
                        <div className="relative flex items-center">
                            <FaEnvelope className="absolute left-4 text-slate-400 text-sm pointer-events-none" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                required
                                autoComplete="email"
                                className="input input-bordered h-11 sm:h-12 w-full pl-11 bg-slate-950/50 border-white/10 text-white text-sm focus:border-pink-500 focus:outline-none placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    {/* Profile Image URL */}
                    <div className="form-control w-full">
                        <label className="label py-1" htmlFor="image">
                            <span className="label-text text-slate-300 text-xs sm:text-sm font-medium">Profile Image URL</span>
                        </label>
                        <div className="relative flex items-center">
                            <FaImage className="absolute left-4 text-slate-400 text-sm pointer-events-none" />
                            <input
                                id="image"
                                name="image"
                                type="url"
                                placeholder="https://example.com/avatar.jpg"
                                className="input input-bordered h-11 sm:h-12 w-full pl-11 bg-slate-950/50 border-white/10 text-white text-sm focus:border-pink-500 focus:outline-none placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="form-control w-full">
                        <label className="label py-1" htmlFor="password">
                            <span className="label-text text-slate-300 text-xs sm:text-sm font-medium">Password</span>
                        </label>
                        <div className="relative flex items-center">
                            <FaLock className="absolute left-4 text-slate-400 text-sm pointer-events-none" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                                className="input input-bordered h-11 sm:h-12 w-full pl-11 bg-slate-950/50 border-white/10 text-white text-sm focus:border-pink-500 focus:outline-none placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    {/* Select Role Dropdown */}
                    <div className="form-control w-full">
                        <label className="label py-1" htmlFor="role">
                            <span className="label-text text-slate-300 text-xs sm:text-sm font-medium">Select Role</span>
                        </label>
                        <select
                            id="role"
                            name="role"
                            defaultValue="attendee"
                            className="select select-bordered h-11 sm:h-12 w-full bg-slate-950/50 border-white/10 text-white text-sm focus:border-pink-500 focus:outline-none"
                        >
                            <option value="attendee" className="bg-slate-950 text-white">
                                Attendee
                            </option>
                            <option value="organizer" className="bg-slate-950 text-white">
                                Organizer
                            </option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn w-full bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold border-none normal-case h-11 sm:h-12 shadow-lg shadow-pink-500/10 mt-4 text-sm"
                    >
                        Create Account
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-5">
                    <div className="flex-grow border-t border-white/5" />
                    <span className="mx-4 text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">Or Sign Up With</span>
                    <div className="flex-grow border-t border-white/5" />
                </div>

                {/* Google OAuth Button */}
                <button
                    onClick={handleGoogleSignUp}
                    type="button"
                    className="btn btn-bordered w-full bg-transparent border border-white/10 text-white hover:bg-white/5 hover:border-white/20 normal-case font-semibold h-11 gap-2 text-sm"
                >
                    <FaGoogle className="text-pink-500" />
                    Google OAuth
                </button>

                {/* Bottom Link */}
                <p className="text-center text-xs sm:text-sm text-slate-400 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-pink-500 hover:text-pink-400 font-semibold hover:underline transition-colors">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}