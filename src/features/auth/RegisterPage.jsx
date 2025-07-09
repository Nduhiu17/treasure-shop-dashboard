import React, { useState } from "react";
import { Dialog } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/toast";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function RegisterPage({ open, onClose, onSwitchToLogin, asModal }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast({ message: data.message || "Registration failed", type: "error" });
        throw new Error(data.message || "Registration failed");
      }
      setSuccess(true);
      showToast({ message: "Registration successful!", type: "success" });
      setTimeout(() => {
        if (onSwitchToLogin) onSwitchToLogin();
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Landing page theme: fuchsia, cyan, white, soft gradients, modern shadow, rounded, playful
  return (
    <Dialog isOpen={open} onClose={onClose}>
      <div className="w-full max-w-md mx-auto bg-gradient-to-br from-fuchsia-50 via-white to-cyan-50 rounded-3xl shadow-2xl p-0 flex flex-col border border-fuchsia-100 animate-fade-in-up">
        <div className="px-8 pt-8 pb-2 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-fuchsia-700 text-center mb-2 drop-shadow">Create your account</h2>
          <p className="text-base text-cyan-700 text-center mb-4 font-medium">Sign up to get started with Treasure Shop!</p>
        </div>
        <form className="flex flex-col gap-4 px-8 pb-8" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
            <input
              className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-fuchsia-200 focus:ring-2 focus:ring-fuchsia-400 outline-none text-base bg-fuchsia-50 placeholder:text-fuchsia-400 shadow-sm"
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
            <input
              className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-cyan-200 focus:ring-2 focus:ring-cyan-400 outline-none text-base bg-cyan-50 placeholder:text-cyan-400 shadow-sm"
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <input
            className="px-4 py-3 rounded-xl border border-fuchsia-200 focus:ring-2 focus:ring-fuchsia-400 outline-none text-base bg-fuchsia-50 placeholder:text-fuchsia-400 shadow-sm"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            className="px-4 py-3 rounded-xl border border-cyan-200 focus:ring-2 focus:ring-cyan-400 outline-none text-base bg-cyan-50 placeholder:text-cyan-400 shadow-sm"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="px-4 py-3 rounded-xl border border-fuchsia-200 focus:ring-2 focus:ring-fuchsia-400 outline-none text-base bg-fuchsia-50 placeholder:text-fuchsia-400 shadow-sm"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <div className="text-red-600 text-sm text-center font-semibold">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center font-semibold">Registration successful! Redirecting to login...</div>}
          <Button type="submit" className="w-full py-3 text-lg font-bold bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-green-300 text-white shadow-lg hover:from-fuchsia-600 hover:to-cyan-500 hover:to-green-400 transition-all duration-200 rounded-2xl" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        <div className="text-center text-fuchsia-700 font-medium pb-8">
          Already have an account?{' '}
          <button type="button" className="underline hover:text-fuchsia-900 font-bold" onClick={onSwitchToLogin}>
            Log in
          </button>
        </div>
      </div>
    </Dialog>
  );
}
