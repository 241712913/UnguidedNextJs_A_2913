"use client";

import { X, Bell } from "lucide-react";

export default function NotificationPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const notifications: any[] = []; // kosong dulu

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-40 transition ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-50 shadow-xl transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <Bell className="text-emerald-600" size={20} />
            <h2 className="font-semibold text-lg">Notifikasi</h2>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5">

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-20 text-gray-400">
              <Bell size={40} />
              <p className="mt-4 font-medium">
                Belum ada notifikasi
              </p>
              <p className="text-sm">
                Notifikasi akan muncul di sini
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border hover:bg-gray-50 cursor-pointer"
                >
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}