import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";

const BrandLogo = () => {
  return (
    <div>
      {/* Brand Logo */}
      <Link className="flex items-center gap-3 group select-none" href="/">
        
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.2)] group-hover:scale-105 group-hover:shadow-[0_4px_20px_rgba(79,70,229,0.4)] transition-all duration-300">
          <FiBookOpen className="w-5 h-5 text-white stroke-[2.5]" />
        </div>

        <span className="font-sans font-black text-xl tracking-tight text-slate-850 dark:text-white transition-colors duration-200">
          Fluento{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-extrabold">
            Speak
          </span>
        </span>
      </Link>
    </div>
  );
};

export default BrandLogo;