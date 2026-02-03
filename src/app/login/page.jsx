'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const cursor = document.querySelector('.pro-cursor');
    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, 'users', res.user.uid));
      if (!snap.exists()) {
        setError(role === 'employee' ? 'Account not found. Contact HR.' : 'HR account not found.');
        return;
      }
      const user = snap.data();
      if (user.role !== role) { setError('Incorrect role selected.'); return; }
      if (role === 'hr' && user.status !== 'approved') { setError('Account pending approval.'); return; }
      window.location.href = role === 'employee' ? '/employee/dashboard' : '/hr/dashboard';
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pro-login-page">
      <div className="pro-cursor"></div>
      
      <div className="login-grid-container">
        {/* LEFT SECTION */}
        <div className="login-visual-box">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <div className="pro-tag">STAFFCORE V3</div>
            <h1 className="visual-title">Secure <span>Access.</span></h1>
            <p className="visual-subtitle">Login to manage your daily tasks and workspace efficiently.</p>
            
            <div className="stats-row">
              <div className="stat-item"><strong>99.9%</strong><span>Uptime</span></div>
              <div className="stat-item"><strong>Secure</strong><span>Data</span></div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="login-form-box">
          <div className="form-card">
            <div className="pro-logo-area">
              <Image src={logo} alt="Logo" width={50} height={50} priority />
            </div>

            <div className="form-head">
              <h2>Sign In</h2>
              <p>Enter your details to continue</p>
            </div>

            <div className="role-switch-premium">
              <button 
                className={role === 'employee' ? 'switch-btn active' : 'switch-btn'} 
                onClick={() => setRole('employee')}
              >
                Employee
              </button>
              <button 
                className={role === 'hr' ? 'switch-btn active' : 'switch-btn'} 
                onClick={() => setRole('hr')}
              >
                HR Manager
              </button>
            </div>

            <div className="form-inputs">
              <div className="input-field-wrapper">
                <label>Email Address</label>
                <input type="email" placeholder="email@company.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div className="input-field-wrapper">
                <label>Password</label>
                <input type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            <div className="form-options">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            {error && <div className="pro-error-msg">{error}</div>}

            <button className="pro-login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {role === 'hr' && (
              <div className="hr-signup-link">
                Don't have an HR account? <a href="/HR/signup">Register Now</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}