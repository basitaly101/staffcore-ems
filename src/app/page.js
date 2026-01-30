'use client';

import { useState } from 'react';
import LoginPage from "./login/page";
import HRSignupPage from "./HR/signup/page";
import VideoLoader from "./components/loader"; // loader component
import ForgotPassword from './forgot-password/page';
import EmployeeDashboard from './empolyee/dashboard/page';

import './globals.css';
export default function Page() {
  const [showVideo, setShowVideo] = useState(true);

  return (
    <>
      {showVideo ? (
        <VideoLoader onFinish={() => setShowVideo(false)} />
      ) : (
        <div>
          <h1>Hello, Next.js!</h1>
          <LoginPage />
          <HRSignupPage />
          <ForgotPassword />
          <EmployeeDashboard />
        </div>
      )}
    </>
  );
}
