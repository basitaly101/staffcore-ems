'use client';

import * as React from 'react';
import { Box, Grid, Container, Typography, Stack, Fade } from '@mui/material';
import { 
  TrendingUpRounded, 
  WatchLaterRounded, 
  EventAvailableRounded, 
  StarRounded 
} from '@mui/icons-material';

// Components
import EmployeeSidebar from './components/EmployeeSidebar';
import EmployeeTopbar from './components/EmployeeTopbar';
import ProfileCard from './components/ProfileCard';
import AttendanceStatus from './components/AttendanceStatus';
import EmployeeAttendancePie from './components/EmployeeAttendancePie';
import TaskList from './components/TaskList';
import EmployeeIDCard from './components/EmployeeIDCard';
import EmployeeBankCard from './components/EmployeeBankCard';
import CalendarCard from './components/CalendarCard';
import TaskCompletionChart from './components/TaskCompletionChart';

export default function EmployeeDashboard() {
  const [checked, setChecked] = React.useState(true);

  // --- Premium Component: Quick Stats Tiles ---
  const StatTile = ({ icon, label, value, color }) => (
    <Box sx={{
      p: 3, borderRadius: '24px', bgcolor: '#fff',
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      border: '1px solid rgba(0,0,0,0.05)',
      display: 'flex', alignItems: 'center', gap: 2,
      transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 15px 35px rgba(197, 160, 89, 0.1)' }
    }}>
      <Box sx={{ bgcolor: `${color}15`, p: 1.5, borderRadius: '15px', color: color }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{label}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>{value}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>
      <EmployeeSidebar />

      {/* MAIN CONTENT AREA 
          pt: 100px ensures it stays below the TopBar
      */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 4 }, 
          pt: { xs: '100px', md: '110px' }, // Fix overlap
          width: '100%',
          overflowX: 'hidden'
        }}
      >
        <Fade in={checked} timeout={800}>
          <Container maxWidth="xl" sx={{ p: '0 !important' }}>
            
            {/* Topbar: Greeting */}
            <EmployeeTopbar />

            {/* NEW: QUICK STATS ROW (Eye-Catching) */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatTile icon={<WatchLaterRounded />} label="Working Hours" value="164h / Mo" color="#0f172a" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatTile icon={<EventAvailableRounded />} label="Days Present" value="22 Days" color="#c5a059" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatTile icon={<TrendingUpRounded />} label="Performance" value="98%" color="#2e7d32" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatTile icon={<StarRounded />} label="Rewards" value="12 Badges" color="#ed6c02" />
              </Grid>
            </Grid>

            {/* MAIN GRID LAYOUT */}
            <Grid container spacing={4}>
              
              {/* Profile & Main Stats */}
              <Grid item xs={12} lg={8}>
                <ProfileCard />
              </Grid>
              <Grid item xs={12} lg={4}>
                <AttendanceStatus />
              </Grid>

              {/* Attendance Chart & Tasks */}
              <Grid item xs={12} md={6} lg={5}>
                <EmployeeAttendancePie />
              </Grid>
              <Grid item xs={12} md={6} lg={7}>
                <TaskList />
              </Grid>

              {/* Identity Section (Royal Theme) */}
              <Grid item xs={12} md={6} lg={4}>
                <Stack spacing={4}>
                  <EmployeeIDCard />
                  <Box sx={{ 
                    p: 3, borderRadius: '24px', 
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    color: '#fff', textAlign: 'center', border: '1px solid #c5a059'
                  }}>
                    <Typography variant="h6" sx={{ color: '#c5a059', fontWeight: 800 }}>Elite Member</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>Since Oct 2023</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={8}>
                <EmployeeBankCard />
              </Grid>

              {/* Analytics & Schedule */}
              <Grid item xs={12} lg={7}>
                <TaskCompletionChart />
              </Grid>
              <Grid item xs={12} lg={5}>
                <CalendarCard />
              </Grid>

            </Grid>
          </Container>
        </Fade>
      </Box>
    </Box>
  );
}