import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";

const BrandLogo = () => {
    return (
        <div>
         {/* Brand Logo */}
        <Link className="flex items-center gap-2.5 group" href="/">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-300">
            <FiBookOpen className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <span className="font-sans font-black text-xl tracking-tight text-slate-800">
            Fluento <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-extrabold">Speak</span>
          </span>
        </Link>
        </div>
    );
};

export default BrandLogo;