import React from "react";
import { FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-zinc-50 text-center md:py-6 py-4 flex justify-center gap-2 items-center">
      Copyright {new Date().getFullYear()} &copy; made by{" "}
      <FaHeart size={18} className="text-red-600" />
    </footer>
  );
};
export default Footer;
