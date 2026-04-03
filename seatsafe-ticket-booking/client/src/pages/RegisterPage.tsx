import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420, background: '#fff', padding: 24, borderRadius: 16 }}>
      <h1>Create account</h1>
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 12 }} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 12 }} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 12 }} />
      <button type="submit" style={{ padding: '0.75rem 1rem' }}>Register</button>
    </form>
  );
}
