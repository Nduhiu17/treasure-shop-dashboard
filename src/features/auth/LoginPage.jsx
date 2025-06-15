import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/"); // Redirect to main/dashboard page after successful login
    } catch (err) {
      setError(err.message || "Login failed");
    }
    setLoading(false);
  };

  // No redirect needed here, but for protected pages, use the pattern below:
  // const { token } = useAuth();
  // useEffect(() => { if (!token) navigate('/login'); }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-4">
      <Card className="w-full max-w-md mx-auto p-2 xs:p-3 sm:p-4 md:p-8 shadow-xl border-0">
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 xs:mb-4 sm:mb-6 text-blue-900">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-2 xs:space-y-3 sm:space-y-4">
          <div>
            <label className="block text-gray-700 text-xs xs:text-sm sm:text-base font-bold mb-1 xs:mb-2" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-xs xs:text-sm sm:text-base h-8 xs:h-9 sm:h-10"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-xs xs:text-sm sm:text-base font-bold mb-1 xs:mb-2" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white text-xs xs:text-sm sm:text-base h-8 xs:h-9 sm:h-10"
              required
            />
          </div>
          {error && <div className="text-red-600 text-xs xs:text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full py-2 text-xs xs:text-sm sm:text-base" disabled={loading}>
            {loading ? "Logging in..." : "Enter Dashboard"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
