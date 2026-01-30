'use client';

import { useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
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

  const handleReset = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!cnic || !newPassword || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'users'),
        where('cnic', '==', cnic),
        where('role', '==', role)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        setError('User not found with this CNIC');
        setLoading(false);
        return;
      }

      await updateDoc(snap.docs[0].ref, {
        tempPassword: newPassword,
        passwordUpdatedAt: new Date(),
      });

      setSuccess('Password updated. Please login.');
      setCnic('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="ems-login-wrapper">
        <div className="ems-login-card">

          <h2 className="ems-title">Change Password</h2>

          {/* ROLE */}
          <div className="ems-toggle">
            <button
              className={role === 'employee' ? 'active' : ''}
              onClick={() => setRole('employee')}
            >
              Employee
            </button>
            <button
              className={role === 'hr' ? 'active' : ''}
              onClick={() => setRole('hr')}
            >
              HR
            </button>
          </div>

          <input
            className="ems-input"
            placeholder="CNIC (without dashes)"
            value={cnic}
            onChange={e => setCnic(e.target.value)}
          />

          <input
            type="password"
            className="ems-input"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            className="ems-input"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />

          {error && <p className="ems-error">{error}</p>}
          {success && <p className="ems-success">{success}</p>}

          <button
            className="ems-login-btn"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>

          <p className="ems-forgot">
            <a href="/login">Back to Login</a>
          </p>

        </div>
      </div>
    </div>
  );
}
