import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../firebase/authService';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useEffect } from 'react';

export default function AdminLogin() {
  const user = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="p-6 w-full max-w-sm">
        <h2 className="font-heading text-xl font-semibold text-masters-green mb-4 text-center">
          Admin Login
        </h2>
        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="text-gray-500">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green"
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-500">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green"
            />
          </label>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
