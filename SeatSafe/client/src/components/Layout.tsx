import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', background: '#f5f7fb', minHeight: '100vh' }}>
      <header style={{ background: '#111827', color: '#fff', padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 24 }}>
            SeatSafe
          </Link>
          <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link to="/" style={{ color: '#fff' }}>Events</Link>
            {user && <Link to="/bookings" style={{ color: '#fff' }}>My Bookings</Link>}
            {user?.role === 'admin' && <Link to="/admin" style={{ color: '#fff' }}>Admin</Link>}
            {!user ? (
              <>
                <Link to="/login" style={{ color: '#fff' }}>Login</Link>
                <Link to="/register" style={{ color: '#fff' }}>Register</Link>
              </>
            ) : (
              <button onClick={logout} style={{ padding: '0.5rem 0.85rem', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
                Sign out
              </button>
            )}
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
