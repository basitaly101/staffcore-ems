// app/dashboard/layout.js
'use client';

import PremiumSidebar from './components/hr-sidebar';
import { Box } from '@mui/material';

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      
      {/* Sidebar yahan fix hai */}
      <PremiumSidebar />

      {/* Main Content Area: Dashboard yahan load hoga */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 4, 
          // Margin check karein: Agar sidebar 260px hai to ye lazmi chahiye
          ml: { sm: '260px' }, 
          width: { sm: `calc(100% - 260px)` },
          transition: 'margin 0.2s ease-in-out'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}