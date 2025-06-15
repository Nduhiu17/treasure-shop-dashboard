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
      <Card className="w-full max-w-md mx-auto p-6 sm:p-8 shadow-xl border-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-900">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email (ignored)
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password (ignored)
            </label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white"
            />
          </div>
          <Button type="submit" className="w-full py-2 text-base" disabled={loading}>
            {loading ? "Redirecting..." : "Enter Dashboard"}
          </Button>
          <p className="text-center text-xs text-gray-500 mt-2">Login is currently bypassed for quick access.</p>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
