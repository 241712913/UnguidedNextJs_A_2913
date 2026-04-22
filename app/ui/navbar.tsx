"use client";

import Image from "next/image";
import { Menu, Bell } from "lucide-react";
import { useState } from "react";
import NotificationPanel from "./notification-panel";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [openNotif, setOpenNotif] = useState(false);
  const [role, setRole] = useState<"admin" | "pelanggan">("admin");

  return (
    <>
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

        {/* RIGHT */}
        <button
          onClick={() => setOpenNotif(true)}
          className="relative p-2 hover:bg-gray-100 rounded-full"
        >
          <Bell className="w-6 h-6 text-green-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>

      {/* PANEL */}
      <NotificationPanel open={openNotif} onClose={() => setOpenNotif(false)} />
    </>
  );
}