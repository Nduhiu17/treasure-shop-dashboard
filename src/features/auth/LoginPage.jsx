import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useAuth } from './AuthProvider';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-4">
      <Card className="w-full max-w-md mx-auto p-2 xs:p-3 sm:p-4 md:p-8 shadow-xl border-0">
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 xs:mb-4 sm:mb-6 text-blue-900">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-2 xs:space-y-3 sm:space-y-4">
          <div>
            <label className="block text-gray-700 text-xs xs:text-sm sm:text-base font-bold mb-1 xs:mb-2" htmlFor="email">
              Email (ignored)
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-xs xs:text-sm sm:text-base h-8 xs:h-9 sm:h-10"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-xs xs:text-sm sm:text-base font-bold mb-1 xs:mb-2" htmlFor="password">
              Password (ignored)
            </label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white text-xs xs:text-sm sm:text-base h-8 xs:h-9 sm:h-10"
            />
          </div>
          <Button type="submit" className="w-full py-2 text-xs xs:text-sm sm:text-base" disabled={loading}>
            {loading ? "Redirecting..." : "Enter Dashboard"}
          </Button>
          <p className="text-center text-[10px] xs:text-xs sm:text-sm text-gray-500 mt-1 xs:mt-2">Login is currently bypassed for quick access.</p>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
