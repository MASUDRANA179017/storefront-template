import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const inputClass =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register(form);
      navigate('/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 sm:p-8">
        <h1 className="text-xl font-bold">Create Account</h1>
        <p className="text-sm text-gray-500 mt-1">Track orders and check out faster next time.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input required value={form.name} onChange={update('name')} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required value={form.email} onChange={update('email')} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" required minLength={8} value={form.password} onChange={update('password')} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password_confirmation}
              onChange={update('password_confirmation')}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="icon-btn-accent w-full py-3 rounded-xl font-bold shadow-soft disabled:opacity-50 transition-all"
          >
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-sm text-gray-500 text-center">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-gray-900 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
