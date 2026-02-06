'use client';

import PremiumSidebar from './components/PremiumSidebar'; // Path check kar lena

export default function DashboardLayout({ children }) {
  return (
    <PremiumSidebar>
      {children}
    </PremiumSidebar>
  );
}