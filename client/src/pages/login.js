import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../lib/api';
import { setToken } from '../lib/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await loginUser(username, password);
      setToken(token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-canvas">
      <div className="flex flex-col gap-6 bg-white border border-stroke-light rounded-xl shadow-sm p-10 w-full max-w-sm">
        <div
          className="font-heading font-normal text-3xl text-left"
          style={{ fontVariationSettings: "'SHRP' 50" }}
        >
          <span style={{ color: 'var(--primary-color)' }}>Quote</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-mono text-ink-subtle" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border border-stroke-light rounded-md px-3 py-2 text-sm bg-canvas focus:outline-none focus:border-stroke"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-mono text-ink-subtle" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-stroke-light rounded-md px-3 py-2 text-sm bg-canvas focus:outline-none focus:border-stroke"
            />
          </div>

          {error && (
            <p className="text-sm text-danger bg-danger-bg border border-danger-border rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-4 py-2 rounded-md text-white text-sm font-medium justify-center"
            style={{ backgroundColor: 'var(--primary-color)', border: 'none', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
