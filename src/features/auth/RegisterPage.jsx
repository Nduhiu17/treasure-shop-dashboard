import React, { useState } from "react";
import { Dialog } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Registration failed");
      }
      setSuccess(true);
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

  // Responsive, world-class design
  return (
    <Dialog isOpen={open} onClose={onClose}>
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-blue-100">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 text-center mb-2">Create your account</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <input
              className="flex-1 px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-base bg-blue-50 placeholder:text-blue-400"
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
            <input
              className="flex-1 px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-base bg-blue-50 placeholder:text-blue-400"
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <input
            className="px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-base bg-blue-50 placeholder:text-blue-400"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            className="px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-base bg-blue-50 placeholder:text-blue-400"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-base bg-blue-50 placeholder:text-blue-400"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <div className="text-red-600 text-sm text-center font-semibold">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center font-semibold">Registration successful! Redirecting to login...</div>}
          <Button type="submit" className="w-full py-3 text-lg font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-green-400 text-white shadow-lg hover:from-blue-700 hover:to-cyan-600 hover:to-green-500 transition-all duration-200 rounded-xl" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        <div className="text-center text-blue-700 font-medium">
          Already have an account?{' '}
          <button type="button" className="underline hover:text-blue-900 font-bold" onClick={onSwitchToLogin}>
            Log in
          </button>
        </div>
      </div>
    </Dialog>
  );
}
