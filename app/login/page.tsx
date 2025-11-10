"use client";

import { useState } from "react";
import { Eye, EyeOff, Store } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.email === "admin@warung.com" && form.password === "123456") {
      // ✅ Simpan status login di localStorage
      localStorage.setItem("isLoggedIn", "true");

      // ✅ Tambahkan sedikit delay agar tersimpan sebelum redirect
      setTimeout(() => {
        router.push("/");
      }, 100);
    } else {
      setError("Email atau password salah!");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl transition-all ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-center mb-6">
          <Store className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold">Data Warung</h1>
        </div>

        <h2 className="text-center text-lg mb-6 opacity-80">
          Masuk ke akun Anda
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@warung.com"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            Masuk
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm text-blue-500 hover:underline"
          >
            {darkMode ? "Mode Terang" : "Mode Gelap"}
          </button>
        </div>
      </div>
    </div>
  );
}
