'use client';

import * as React from 'react';
import { Box, Grid, Container, Typography, Stack, Fade, Skeleton } from '@mui/material';
import { 
  TrendingUpRounded, 
  WatchLaterRounded, 
  EventAvailableRounded, 
  StarRounded 
} from '@mui/icons-material';

// Firebase Imports
import { auth, db } from '@/app/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

// Components
import EmployeeSidebar from './components/EmployeeSidebar';
import EmployeeTopbar from './components/EmployeeTopbar';
import ProfileCard from './components/ProfileCard';
import AttendanceStatus from './components/AttendanceApprove'; // Fixed spelling
import EmployeeAttendancePie from './components/EmployeeAttendancePie';
import EmployeeTasks from './components/EmployeeTasks'; // Renamed and fixed
import EmployeeIDCard from './components/EmployeeIDCard';
import EmployeeBankCard from './components/EmployeeBankCard';
import CalendarCard from './components/CalendarCard';
import TaskCompletionChart from './components/TaskCompletionChart';

export default function EmployeeDashboard() {
  const [checked, setChecked] = React.useState(true);
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // --- Real-time Data Fetching ---
  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData({ uid: user.uid, ...docSnap.data() });
          }
          setLoading(false);
        });
        return () => unsubscribeDoc();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // --- Premium Component: Quick Stats Tiles (Dark Mode Styled) ---
  const StatTile = ({ icon, label, value, color }) => (
    <Box sx={{
      p: 3, borderRadius: '24px', 
      bgcolor: '#0a0a0a', // Solid Black
      border: '1px solid #1a1a1a', // Subtle Border
      display: 'flex', alignItems: 'center', gap: 2,
      transition: '0.3s', 
      '&:hover': { 
        transform: 'translateY(-5px)', 
        borderColor: '#10b981', // Glow Green on hover
        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.1)' 
      }
    }}>
      <Box sx={{ bgcolor: `${color}15`, p: 1.5, borderRadius: '15px', color: color }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
          {label}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>
          {loading ? <Skeleton sx={{ bgcolor: '#222' }} width={60} /> : value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#000' }}> {/* Pure Black BG */}
      <EmployeeSidebar />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 4 }, 
          pt: { xs: '100px', md: '110px' }, 
          width: '100%',
          overflowX: 'hidden'
        }}
      >
        <Fade in={checked} timeout={800}>
          <Container maxWidth="xl" sx={{ p: '0 !important' }}>
            
            <EmployeeTopbar userData={userData} loading={loading} />

            {/* QUICK STATS ROW */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatTile icon={<WatchLaterRounded />} label="Working Hours" value={userData?.workingHours || "0h / Mo"} color="#10b981" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatTile icon={<EventAvailableRounded />} label="Days Present" value={`${userData?.totalPresent || 0} Days`} color="#fff" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatTile icon={<TrendingUpRounded />} label="Performance" value={`${userData?.performance || 0}%`} color="#10b981" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatTile icon={<StarRounded />} label="Rewards" value={`${userData?.badges || 0} Badges`} color="#f59e0b" />
              </Grid>
            </Grid>

            {/* MAIN GRID LAYOUT */}
            <Grid container spacing={3}>
              {/* Profile & Punch-In Section */}
              <Grid item xs={12} lg={8}>
                <ProfileCard data={userData} loading={loading} />
              </Grid>
              <Grid item xs={12} lg={4}>
                <AttendanceStatus /> {/* Punch In Card */}
              </Grid>

              {/* Attendance Analytics & Tasks */}
              <Grid item xs={12} md={6} lg={5}>
                <EmployeeAttendancePie />
              </Grid>
              <Grid item xs={12} md={6} lg={7}>
                {/* Yahan TaskList component ko userData pass karein taake department filter ho sake */}
                <EmployeeTasks department={userData?.department} />
              </Grid>

              {/* Bottom Details Section */}
              <Grid item xs={12} md={6} lg={4}>
                <Stack spacing={3}>
                  <EmployeeIDCard user={userData} />
                  <Box sx={{ 
                    p: 3, borderRadius: '24px', 
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
                    color: '#fff', textAlign: 'center', border: '1px solid #1a1a1a'
                  }}>
                    <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 800 }}>
                      {userData?.designation || 'Elite Member'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Official Employee of Staff-Portal
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6} lg={8}>
                <EmployeeBankCard bankInfo={userData?.bankDetails} />
              </Grid>

              {/* Charts & Calendar */}
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