'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/app/lib/firebase';
import { 
  collection, addDoc, query, where, onSnapshot, serverTimestamp, getDocs 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Box, Typography, Button, Paper, Stack, CircularProgress } from '@mui/material';
import { 
  FingerprintRounded, 
  AccessTimeFilledRounded, 
  VerifiedUserRounded, 
  HourglassEmptyRounded 
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { showToast } from '../../../utils/alert';

export default function EmployeeAttendance() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [status, setStatus] = useState(null); // 'pending', 'present', 'late'
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [punchTime, setPunchTime] = useState('--:--');

  const today = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    // Real-time Clock
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);

    // Auth & Real-time Database Sync
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(
          collection(db, 'attendance'), 
          where('userId', '==', currentUser.uid), 
          where('date', '==', today)
        );

        const unsubSnap = onSnapshot(q, (snap) => {
          if (!snap.empty) {
            const data = snap.docs[0].data();
            setStatus(data.status);
            if (data.checkInTime) setPunchTime(data.checkInTime);
          } else {
            setStatus(null);
          }
          setLoading(false);
        });

        return () => unsubSnap();
      } else {
        setLoading(false);
      }
    });

    return () => {
      clearInterval(timer);
      unsubscribeAuth();
    };
  }, [today]);

  const handlePunchIn = async () => {
    if (!user) return showToast('error', 'Auth Error', 'Please login again.');

    setLoading(true);
    const now = dayjs();
    
    // Logic: 9:15 AM check for "Late" but initial state is "pending" for HR approval
    // Ya agar aap direct mark karna chahte hain toh 'pending' ki jagah logic use karein
    try {
      await addDoc(collection(db, 'attendance'), {
        userId: user.uid,
        userName: user.displayName || "Employee",
        date: today,
        status: 'pending', // Initially pending for admin review
        checkInTime: now.format('hh:mm A'),
        createdAt: serverTimestamp()
      });

      showToast('success', 'Request Sent', 'Attendance request is pending approval.');
    } catch (error) {
      showToast('error', 'Error', 'Failed to punch in.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // UI Theme Helper
  const getThemeColor = () => {
    if (status === 'present') return '#10b981';
    if (status === 'late') return '#ffffff';
    if (status === 'pending') return '#f59e0b'; // Amber for pending
    return '#333';
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
      <CircularProgress sx={{ color: '#10b981' }} />
    </Box>
  );

  return (
    <Paper 
      elevation={0}
      sx={{ 
        width: '100%', maxWidth: '380px', p: 3, borderRadius: '32px', 
        bgcolor: '#050505', border: '1px solid #1f1f1f',
        position: 'relative', overflow: 'hidden'
      }}
    >
      {/* Visual Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
            DAILY <span style={{ color: '#10b981' }}>PUNCH</span>
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 700 }}>
            ORG ID: STAFF-2026
          </Typography>
        </Box>
        <FingerprintRounded sx={{ fontSize: 40, color: getThemeColor(), opacity: 0.8 }} />
      </Stack>

      {/* Clock Section */}
      <Box sx={{ textAlign: 'center', mb: 4, py: 2, bgcolor: '#0a0a0a', borderRadius: '20px', border: '1px solid #141414' }}>
        <Typography sx={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
          {currentTime.format('hh:mm')}
          <Typography component="span" sx={{ fontSize: '1rem', color: '#10b981', ml: 1 }}>
            {currentTime.format('A')}
          </Typography>
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#555', mt: 1, fontWeight: 800, letterSpacing: '2px' }}>
          {currentTime.format('DD MMMM, YYYY').toUpperCase()}
        </Typography>
      </Box>

      {/* Status Details */}
      <Stack direction="row" spacing={2} mb={4}>
        <Box sx={{ flex: 1, p: 2, bgcolor: '#0d0d0d', borderRadius: '18px', border: '1px solid #1a1a1a' }}>
           <Typography sx={{ fontSize: '0.6rem', color: '#444', fontWeight: 800, mb: 1 }}>MY STATUS</Typography>
           <Stack direction="row" spacing={1} alignItems="center">
              {status === 'pending' ? <HourglassEmptyRounded sx={{ color: '#f59e0b', fontSize: 16 }} /> : <VerifiedUserRounded sx={{ color: getThemeColor(), fontSize: 16 }} />}
              <Typography sx={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700, textTransform: 'uppercase' }}>
                {status || 'Absent'}
              </Typography>
           </Stack>
        </Box>
        <Box sx={{ flex: 1, p: 2, bgcolor: '#0d0d0d', borderRadius: '18px', border: '1px solid #1a1a1a' }}>
           <Typography sx={{ fontSize: '0.6rem', color: '#444', fontWeight: 800, mb: 1 }}>PUNCH TIME</Typography>
           <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeFilledRounded sx={{ color: '#666', fontSize: 16 }} />
              <Typography sx={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>
                {punchTime}
              </Typography>
           </Stack>
        </Box>
      </Stack>

      {/* Main Action Button */}
      {!status ? (
        <Button 
          fullWidth
          onClick={handlePunchIn}
          disabled={loading}
          variant="contained"
          sx={{ 
            py: 2.2, borderRadius: '16px', fontWeight: 900, fontSize: '1rem',
            bgcolor: '#10b981', color: '#000',
            boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)',
            '&:hover': { bgcolor: '#fff', color: '#000' },
            '&:active': { transform: 'scale(0.98)' }
          }}
        >
          {loading ? 'SYNCHRONIZING...' : 'MARK ATTENDANCE'}
        </Button>
      ) : (
        <Box sx={{ 
          textAlign: 'center', p: 2, borderRadius: '16px', 
          border: '1px dashed #333', bgcolor: 'rgba(255,255,255,0.02)' 
        }}>
          <Typography sx={{ color: '#666', fontSize: '0.8rem', fontWeight: 600 }}>
            {status === 'pending' 
              ? 'Waiting for HR to verify your punch...' 
              : 'Attendance logged for today. Well done!'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}