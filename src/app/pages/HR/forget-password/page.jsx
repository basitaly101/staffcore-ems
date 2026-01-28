'use client';

import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/app/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import SHA256 from 'crypto-js/sha256';
import { useState } from 'react';

export default function ForgotPassword() {
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');

  const resetPassword = async () => {
    const hash = SHA256(cnic).toString();

    const q = query(
      collection(db, 'users'),
      where('cnicHash', '==', hash),
      where('role', '==', 'hr')
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      alert('CNIC not found');
      return;
    }

    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent');
  };

  return (
    <>
      <input placeholder="Registered Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="CNIC (without dashes)" onChange={e => setCnic(e.target.value)} />
      <button onClick={resetPassword}>Reset Password</button>
    </>
  );
}
