'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import './hr-signup.css';

export default function HRSignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.target;

    const data = {
      fullName: form.fullName.value,
      fatherName: form.fatherName.value,
      email: form.email.value,
      cnic: form.cnic.value,
      gender: form.gender.value,
      education: form.education.value,
      phone: form.phone.value,
      address: form.address.value,
      role: 'hr',
      status: 'pending', // 🔐 admin approval later
      createdAt: serverTimestamp(),
    };

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        form.password.value
      );

      await setDoc(doc(db, 'users', userCred.user.uid), data);

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
      <form className="hr-signup-card" onSubmit={handleSubmit}>

        <h2>Create HR Account</h2>
        <p className="sub-text">
          Register as HR — admin approval required
        </p>

        <div className="grid">

          <input name="fullName" placeholder="Full Name" required />
          <input name="fatherName" placeholder="Father Name" required />

          <input name="email" type="email" placeholder="Email Address" required />
          <input name="phone" placeholder="Phone Number" required />

          <input name="cnic" placeholder="CNIC (35202-XXXXXXX-X)" required />
          <input name="education" placeholder="Education (e.g. BBA, MBA)" required />

        </div>

        {/* GENDER */}
        <div className="gender-box">
          <label>
            <input type="radio" name="gender" value="male" required />
            Male
          </label>
          <label>
            <input type="radio" name="gender" value="female" />
            Female
          </label>
          <label>
            <input type="radio" name="gender" value="other" />
            Other
          </label>
        </div>

        <textarea
          name="address"
          placeholder="Complete Address"
          rows="3"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Create Password"
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create HR Account'}
        </button>

        <p className="note">
          By signing up, you agree to company HR policies.
        </p>

      </form>
    </div>
  );
}
