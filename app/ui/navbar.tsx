"use client";
import Image from "next/image";
import { Menu } from "lucide-react";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="w-full bg-white px-6 py-4 flex items-center justify-between shadow-sm">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex items-center gap-1">
          <Image
            src="/logo.png"
            alt="logo"
            width={80}
            height={28}
            className="object-contain"
          />
          <h1 className="font-bold text-lg ml-1">
            SahabatKargo<span className="text-green-700">.id</span>
          </h1>
        </div>
      </div>
    </div>
  );
}