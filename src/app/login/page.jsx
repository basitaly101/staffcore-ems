'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import logo from '../assets/logo.png';
import './login.css';

export default function LoginPage() {
  const [role, setRole] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // ... (Login logic same as before) ...
    setError('');
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, 'users', res.user.uid));
      if (!snap.exists()) { setError('User profile not found'); return; }
      const user = snap.data();
      if (user.role !== role) { setError('Role mismatch. Access denied.'); return; }
      if (role === 'hr' && user.status !== 'approved') { setError('HR account pending approval'); return; }
      window.location.href = role === 'employee' ? '/employee/dashboard' : '/hr/dashboard';
    } catch { setError('Invalid email or password'); } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="ems-login-wrapper">

        {/* LEFT PANEL (Desktop Only) */}
        <div className="ems-left">
          <div className="ems-brand-box">
            <h1>Hello!</h1>
            <p>Have a <span>GOOD DAY</span></p>
            <small>StaffCore Employee Management System</small>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="ems-right">
          <div className="ems-login-card">

            <div className="ems-logo">
              <Image src={logo} alt="StaffCore Logo" priority />
            </div>

            {/* Mobile Greeting Text */}
            <div className="ems-mobile-text">
              <h1>Hello!</h1>
              <p>Have a <span>GOOD DAY</span></p>
            </div>

            <h2 className="ems-title">Login</h2>

            <div className="ems-toggle">
              <button className={role === 'employee' ? 'active' : ''} onClick={() => setRole('employee')}>Employee</button>
              <button className={role === 'hr' ? 'active' : ''} onClick={() => setRole('hr')}>HR</button>
            </div>

            <input type="email" className="ems-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" className="ems-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

            {/* ✅ FORGOT PASSWORD MOVED HERE (Right under password) */}
            <p className="ems-forgot">
              <a href="/forgot-password">Forgot password?</a>
            </p>

            {error && <p className="ems-error">{error}</p>}

            <button className="ems-login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in...' : `Login as ${role.toUpperCase()}`}
            </button>

            {role === 'hr' && (
              <p className="ems-signup">
                New HR? <a href="/HR/signup">Create account</a>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}