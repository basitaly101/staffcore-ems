'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { showToast, showAuthSuccess } from '../utils/alert'; 
import logo from '@/app/assets/logo.png'; 
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return showToast('warning', 'Adhoori Maalumat', 'Email aur password bhariye.');

    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', res.user.uid));

      if (!userDoc.exists()) throw new Error('No Record');

      const userData = userDoc.data();
      if (userData.role !== role) {
        showToast('error', 'Access Denied', `Aapka account ${userData.role} hai.`);
        setLoading(false);
        return;
      }

      await showAuthSuccess(role);
      router.push(role === 'hr' ? '/dashboard/hr' : '/dashboard/employee');
    } catch (err) {
      showToast('error', 'Login Fail', 'Ghalat Email ya Password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-viewport">
      <div className="compact-card">
        
        {/* LEFT: FORM SECTION */}
        <div className="form-area">
          <div className="brand">
            <Image src={logo} alt="StaffCore" width={130} height={50} priority />
          </div>

          <div className="text-header">
            <h2>Welcome Back</h2>
            <p>Login to your workspace</p>
          </div>

          <div className="role-pills">
            <button className={role === 'employee' ? 'active' : ''} onClick={() => setRole('employee')}>Staff</button>
            <button className={role === 'hr' ? 'active' : ''} onClick={() => setRole('hr')}>HR Admin</button>
          </div>

          <form onSubmit={handleLogin} className="main-form">
            <div className="input-grp">
              <label>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" required />
            </div>
            <div className="input-grp">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className="login-action" disabled={loading}>
              {loading ? <div className="loader"></div> : 'Sign In'}
            </button>
          </form>
        </div>

        {/* RIGHT: DESIGN SECTION (No Image, Just Colors) */}
        <div className="design-area">
          <div className="abstract-shape"></div>
          <div className="abstract-glow"></div>
          
          <div className="content-overlay">
            <div className="quote-wrap">
              <p>"Success is the result of perfection, hard work, and learning from failure."</p>
              <span>— StaffCore Insight</span>
            </div>
            
            <div className="feature-badges">
              <span>Secure</span>
              <span>•</span>
              <span>Fast</span>
              <span>•</span>
              <span>Reliable</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}