"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  Mail,
  Send,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

export default function ContactPage() {
  const router = useRouter();

  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    pesan: "",
  });

  const handleSubmit = () => {
    if (!form.nama || !form.email || !form.pesan) {
      alert("Lengkapi semua data dulu ya");
      return;
    }

    setSent(true);
    setForm({ nama: "", email: "", pesan: "" });

    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      <div className="p-3 md:p-3 space-y-3">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>

        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-3xl p-6 shadow-md">
          <h1 className="text-2xl font-bold">
            Hubungi Kami
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Tim SahabatKargo siap bantu kamu 🚀
          </p>
        </div>

        {sent && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl flex items-center gap-2">
            <CheckCircle size={18} />
            Pesan berhasil dikirim!
          </div>
        )}

        <div className="space-y-4">

          <div className="bg-white p-5 rounded-3xl border shadow-sm flex items-center gap-4">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
              <Phone size={20} />
            </div>
            <div>
              <p className="font-semibold">Telepon</p>
              <p className="text-sm text-gray-500">
                0812-3456-7890
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
              <Mail size={20} />
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-sm text-gray-500">
                support@sahabatkargo.id
              </p>
            </div>
          </div>

        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
          <h2 className="font-semibold text-lg">
            Kirim Pesan
          </h2>

          <input
            placeholder="Nama kamu"
            value={form.nama}
            onChange={(e) =>
              setForm({ ...form, nama: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500"
          />

          <input
            placeholder="Email kamu"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500"
          />

          <textarea
            placeholder="Tulis pesan kamu..."
            value={form.pesan}
            onChange={(e) =>
              setForm({ ...form, pesan: e.target.value })
            }
            className="w-full p-3 h-32 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 resize-none"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition"
          >
            <Send size={16} />
            Kirim Pesan
          </button>
        </div>

      </div>
    </div>
  );
}