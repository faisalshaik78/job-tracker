import { useEffect, useState } from 'react';
import { api, token } from './api.js';
import Auth from './Auth.jsx';
import Dashboard from './Dashboard.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!token.get()) return setReady(true);
    api
      .me()
      .then((d) => setUser(d.user))
      .catch(() => token.clear())
      .finally(() => setReady(true));
  }, []);

  const logout = () => {
    token.clear();
    setUser(null);
  };

  if (!ready) return <div className="splash">Loading…</div>;
  return user ? <Dashboard user={user} onLogout={logout} /> : <Auth onAuth={setUser} />;
}
