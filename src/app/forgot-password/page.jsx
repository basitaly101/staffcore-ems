'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import './forgot-password.css';

export default function ForgotPassword() {
  const [role, setRole] = useState('employee');
  const [cnic, setCnic] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Custom Cursor
  useEffect(() => {
    const moveCursor = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const cleanCnic = cnic.trim();

    // 🛡️ BASIC VALIDATIONS
    if (!cleanCnic || !newPassword || !confirmPassword) {
      setError('Please fill all fields.');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      // 🔍 FIREBASE LOGIC: Search by CNIC and ROLE
      const q = query(
        collection(db, 'users'),
        where('cnic', '==', cleanCnic),
        where('role', '==', role)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        setError(`No ${role} found with this CNIC.`);
        setLoading(false);
        return;
      }

      // 🔄 UPDATE PASSWORD
      // Note: Firebase Auth password update ke liye re-auth chahiye hota hai, 
      // isliye hum doc mein temporary store kar rahe hain ya as per your flow.
      const userDoc = snap.docs[0];
      await updateDoc(userDoc.ref, {
        password: newPassword, // Direct update in Firestore
        passwordUpdatedAt: new Date(),
      });

      setSuccess('Password updated successfully!');
      setCnic('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Auto redirect to login after 2 seconds
      setTimeout(() => window.location.href = '/login', 2000);

    } catch (err) {
      setError('Database connection failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page-wrapper">
      <div className="pro-cursor" style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}></div>

      <div className="reset-card">
        <h2 className="reset-title">Reset <span>Password</span></h2>
        <p className="reset-subtitle">Verify CNIC to change password</p>

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
            HR
          </button>
        </div>

        <div className="input-group">
          <label>Identity Number</label>
          <input
            type="text"
            placeholder="Enter 13 Digit CNIC"
            value={cnic}
            maxLength={13}
            onChange={e => setCnic(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <button className="reset-btn" onClick={handleReset} disabled={loading}>
          {loading ? 'Processing...' : 'Update Password'}
        </button>

        <div className="back-to-login">
          <a href="/login">← Back to Portal</a>
        </div>
      </div>
    </div>
  );
}