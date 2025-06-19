import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import RegisterPage from './RegisterPage';

const LoginPage = ({ asModal = false, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false); // State to control login modal visibility
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

  return (
    <>
      <div className={`w-full ${asModal ? '' : 'min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-4'}`}>
        <Card className={`w-full max-w-md mx-auto ${asModal ? 'p-0 shadow-none border-none bg-transparent' : 'p-2 xs:p-3 sm:p-4 md:p-8 shadow-xl border-0'}`} style={asModal ? {background: 'none', boxShadow: 'none'} : {}}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 text-center mb-2">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-2 xs:gap-3 sm:gap-4">
            <div>
              <label className="block text-blue-800 text-xs xs:text-sm sm:text-base font-bold mb-1 xs:mb-2" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-blue-50 border border-blue-200 text-xs xs:text-sm sm:text-base h-10 xs:h-11 sm:h-12 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
                autoFocus={asModal}
              />
            </div>
            <div>
              <label className="block text-blue-800 text-xs xs:text-sm sm:text-base font-bold mb-1 xs:mb-2" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-blue-50 border border-blue-200 text-xs xs:text-sm sm:text-base h-10 xs:h-11 sm:h-12 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            {error && <div className="text-red-600 text-xs xs:text-sm text-center font-semibold">{error}</div>}
            <Button type="submit" className="w-full py-3 text-lg font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-green-400 text-white shadow-lg hover:from-blue-700 hover:to-cyan-600 hover:to-green-500 transition-all duration-200 rounded-xl" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="text-center text-blue-700 font-medium mt-4">
            Don't have an account?{' '}
            <button type="button" className="underline hover:text-blue-900 font-bold" onClick={() => setRegisterOpen(true)}>
              Register
            </button>
          </div>
        </Card>
      </div>
      <RegisterPage open={registerOpen} onClose={() => setRegisterOpen(false)} onSwitchToLogin={() => { setRegisterOpen(false); setLoginModalOpen(true); }} />
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50 px-2 sm:px-4">
          <div className="w-full max-w-md mx-auto">
            <LoginPage asModal={true} onSuccess={() => { setLoginModalOpen(false); if (onSuccess) onSuccess(); }} />
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
