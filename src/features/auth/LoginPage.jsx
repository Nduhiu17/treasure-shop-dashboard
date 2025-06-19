import React, { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import RegisterPage from './RegisterPage';

const LoginPage = ({ asModal = false, onSuccess, open, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalType, setModalType] = useState((asModal || open) ? 'login' : null);
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

  // Main login form styled to match register modal
  const loginForm = (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-blue-100">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 text-center mb-2">Sign in to your account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-base bg-blue-50 placeholder:text-blue-400"
          required
          autoFocus={asModal || modalType === 'login'}
        />
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-base bg-blue-50 placeholder:text-blue-400"
          required
        />
        {error && <div className="text-red-600 text-sm text-center font-semibold">{error}</div>}
        <Button type="submit" className="w-full py-3 text-lg font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-green-400 text-white shadow-lg hover:from-blue-700 hover:to-cyan-600 hover:to-green-500 transition-all duration-200 rounded-xl" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <div className="text-center text-blue-700 font-medium">
        Don't have an account?{' '}
        <button type="button" className="underline hover:text-blue-900 font-bold" onClick={handleOpenRegister}>
          Register
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Show login form only if no modal is open */}
      {!asModal && !modalType && (
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
