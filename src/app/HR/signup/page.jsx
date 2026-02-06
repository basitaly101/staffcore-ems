'use client';

import { useState, useEffect } from 'react'; // useEffect add kiya
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase';
import { doc, setDoc, serverTimestamp, getDocs, query, collection, where } from 'firebase/firestore';
import './hr-signup.css';

export default function HRSignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Custom Cursor Logic
  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.target;
    const email = form.email.value;
    const cnic = form.cnic.value.trim();

    try {
      /* 🛡️ CNIC LOGIC */
      if (!/^\d{13}$/.test(cnic)) {
        throw new Error('CNIC must be exactly 13 digits.');
      }
      if (new Set(cnic.split('')).size === 1) {
        throw new Error('Invalid CNIC: Repeated numbers not allowed.');
      }

      const q = query(collection(db, 'users'), where('email', '==', email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        throw new Error('Account already exists with this email.');
      }
      // Login logic mein check karein:
if (userData.role === 'hr' && userData.status === 'pending') {
  alert("Your account is pending admin approval. Please wait!");
  return; 
}

      const userCred = await createUserWithEmailAndPassword(auth, email, form.password.value);

      await setDoc(doc(db, 'users', userCred.user.uid), {
        fullName: form.fullName.value,
        fatherName: form.fatherName.value,
        email,
        cnic: cnic,
        gender: form.gender.value,
        education: form.education.value,
        phone: form.phone.value,
        address: form.address.value,
        role: 'hr',
        status: 'pending',
        createdBy: 'self',
        createdAt: serverTimestamp(),
      });

      alert('HR account created. Await admin approval.');
      window.location.href = '/login';

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hr-signup-wrapper">
      {/* --- CUSTOM CURSOR --- */}
      <div 
        className="pro-cursor" 
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      ></div>

      <form className="hr-signup-card" onSubmit={handleSubmit}>
        <h2>Create HR Account</h2>
        <p className="sub-text">Admin approval required</p>

        <div className="grid">
          <input name="fullName" placeholder="Full Name" required />
          <input name="fatherName" placeholder="Father Name" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="phone" type="number" placeholder="Phone Number" required />
          <input name="cnic" type="text" placeholder="CNIC (13 Digits)" maxLength={13} required />
          <input name="education" placeholder="Education" required />
        </div>

        <div className="gender-box">
          <label><input type="radio" name="gender" value="male" required /> Male</label>
          <label><input type="radio" name="gender" value="female" /> Female</label>
          <label><input type="radio" name="gender" value="other" /> Other</label>
        </div>

        <textarea name="address" placeholder="Complete Address" rows="3" required />
        <input name="password" type="password" placeholder="Create Password" required />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create HR Account'}
        </button>

        <p className="note">HR signup → Admin approval → Login</p>
      </form>
    </div>
  );
}