import React, { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import RegisterPage from './RegisterPage';

const LoginPage = ({ asModal = false, onSuccess, open, onClose, onOpenRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Only track modalType if not asModal (standalone page/modal switching)
  const [modalType, setModalType] = useState(!asModal && (open) ? 'login' : null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
      else navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
    setLoading(false);
  };

  // Handlers to switch modals
  const handleOpenRegister = () => setModalType('register');
  const handleOpenLogin = () => setModalType('login');
  const handleCloseModal = () => setModalType(null);

  // Main login form styled to match landing/register modal
  const loginForm = (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-fuchsia-50 via-white to-cyan-50 rounded-3xl shadow-2xl p-0 flex flex-col border border-fuchsia-100 animate-fade-in-up">
      <div className="px-8 pt-8 pb-2 flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-fuchsia-700 text-center mb-2 drop-shadow">Sign in to your account</h2>
        <p className="text-base text-cyan-700 text-center mb-4 font-medium">Welcome back to Treasure Shop!</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-8 pb-8">
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-xl border border-fuchsia-200 focus:ring-2 focus:ring-fuchsia-400 outline-none text-base bg-fuchsia-50 placeholder:text-fuchsia-400 shadow-sm"
          required
          autoFocus={asModal || (!asModal && modalType === 'login')}
        />
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 rounded-xl border border-cyan-200 focus:ring-2 focus:ring-cyan-400 outline-none text-base bg-cyan-50 placeholder:text-cyan-400 shadow-sm"
          required
        />
        {error && <div className="text-red-600 text-sm text-center font-semibold">{error}</div>}
        <Button type="submit" className="w-full py-3 text-lg font-bold bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-green-300 text-white shadow-lg hover:from-fuchsia-600 hover:to-cyan-500 hover:to-green-400 transition-all duration-200 rounded-2xl" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <div className="text-center text-fuchsia-700 font-medium pb-8">
        Don't have an account?{' '}
        <button type="button" className="underline hover:text-fuchsia-900 font-bold" onClick={asModal && onOpenRegister ? onOpenRegister : handleOpenRegister}>
          Register
        </button>
      </div>
    </div>
  );

  // If asModal, only render the login form. Do not render RegisterPage here; parent should handle opening it.
  if (asModal) {
    return loginForm;
  }

  // Standalone page/modal switching logic
  return (
    <>
      {/* Show login form only if no modal is open */}
      {!modalType && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-4">
          {loginForm}
        </div>
      )}
      {/* Login modal overlay */}
      {modalType === 'login' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50 px-2 sm:px-4">
          <div className="w-full max-w-md mx-auto">
            {loginForm}
          </div>
        </div>
      )}
      {/* Register modal overlay */}
      {modalType === 'register' && (
        <RegisterPage
          open={true}
          onClose={handleCloseModal}
          onSwitchToLogin={handleOpenLogin}
        />
      )}
    </>
  );
};

export default LoginPage;
