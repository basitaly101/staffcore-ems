'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Box, Typography, Stack, Button, Avatar, Grid } from '@mui/material';
import { CheckRounded, CloseRounded } from '@mui/icons-material';
import '../styles/attendence.css';

export default function HRAttendanceApproval() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'attendance'), where('status', '==', 'pending'));
    return onSnapshot(q, (snap) => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const handleAction = async (id, finalStatus) => {
    await updateDoc(doc(db, 'attendance', id), { status: finalStatus });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={900} mb={1}>Attendance <span style={{color: 'var(--primary-green)'}}>Approvals</span></Typography>
      <Typography color="#64748b" mb={4}>Approve or Reject daily attendance requests.</Typography>

      <Grid container spacing={3}>
        {requests.map((req) => (
          <Grid item xs={12} md={6} key={req.id}>
            <Box className="attendance-card">
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'var(--primary-green)', color: '#000', fontWeight: 900 }}>{req.userName?.[0]}</Avatar>
                  <Box>
                    <Typography fontWeight={700}>{req.userName}</Typography>
                    <Typography fontSize="0.75rem" color="#64748b">ID: {req.userId.slice(0,5)}...</Typography>
                  </Box>
                </Stack>
                <span className="status-badge pending">Pending</span>
              </Stack>

              <Stack direction="row" spacing={2} mt={4}>
                <Button 
                  fullWidth className="action-btn" 
                  sx={{ bgcolor: 'var(--primary-green)', color: '#000', '&:hover': {bgcolor: '#1db954'} }}
                  startIcon={<CheckRounded />}
                  onClick={() => handleAction(req.id, 'present')}
                >
                  Approve (Present)
                </Button>
                <Button 
                  fullWidth className="action-btn" 
                  sx={{ border: '1px solid #ef4444', color: '#ef4444', '&:hover': {bgcolor: 'rgba(239, 68, 68, 0.1)'} }}
                  startIcon={<CloseRounded />}
                  onClick={() => handleAction(req.id, 'absent')}
                >
                  Reject (Absent)
                </Button>
              </Stack>
            </Box>
          </Grid>
        ))}
        {requests.length === 0 && <Typography sx={{ml: 3, color: '#64748b'}}>No pending requests today.</Typography>}
      </Grid>
    </Box>
  );
}