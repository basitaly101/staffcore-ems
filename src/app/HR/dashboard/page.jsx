'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/app/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';

// Components
import CreateEmployee from './components/create-empolyee'; 
import AttendanceApprove from './components/attendenceAprove'; 
import AdminCalendar from './components/calculatorCard';
import HRTaskCreator from './components/task'; // Renamed for clarity
import './styles/dashboard.css'; 

import {
  Box, Typography, Button, Stack, Card,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, Skeleton, Chip, Grid, Container
} from '@mui/material';
import { 
  AddRounded, 
  PeopleAltOutlined, 
  FactCheckRounded, 
  AssignmentTurnedInRounded 
} from '@mui/icons-material';

export default function HRDashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [hrData, setHrData] = useState(null);
  const [hrLoading, setHrLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const hrDocRef = doc(db, 'users', user.uid);
        const unsubHr = onSnapshot(hrDocRef, (snap) => {
          if (snap.exists()) setHrData(snap.data());
          setHrLoading(false);
        });
        return () => unsubHr();
      }
    });

    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubEmployees = onSnapshot(q, (snap) => {
      setEmployees(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => {
      unsubAuth();
      unsubEmployees();
    };
  }, []);
  
  return (
    <Box sx={{ bgcolor: '#000', minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="xl">
        
        {/* TOP BAR / HEADER */}
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', md: 'center' }} 
          spacing={2} 
          sx={{ pt: 4, mb: 5 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff' }}>
              {hrLoading ? (
                <Skeleton width={200} sx={{ bgcolor: '#111' }} />
              ) : (
                <>Welcome, <span style={{ color: '#10b981' }}>{hrData?.fullName?.split(' ')[0] || 'Admin'}</span></>
              )}
            </Typography>
            <Typography sx={{ color: '#666', fontWeight: 500 }}>
              System Management & Staff Oversight
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<FactCheckRounded />}
              onClick={() => setShowApprove(true)}
              sx={{
                borderColor: '#333', color: '#fff', borderRadius: '12px', px: 3,
                '&:hover': { borderColor: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.05)' }
              }}
            >
              Attendance
            </Button>
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={() => setShowCreate(true)}
              sx={{
                bgcolor: '#10b981', color: '#000', fontWeight: 800, borderRadius: '12px', px: 3,
                '&:hover': { bgcolor: '#fff' }
              }}
            >
              Add Staff
            </Button>
          </Stack>
        </Stack>

        {/* MAIN CONTENT GRID */}
        <Grid container spacing={4}>
          
          {/* LEFT COLUMN: Stats & Table */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={4}>
              
              {/* STATS CARDS */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ bgcolor: '#0a0a0a', p: 3, borderRadius: '24px', border: '1px solid #1a1a1a' }}>
                    <Typography sx={{ color: '#666', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px' }}>TOTAL EMPLOYEES</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
                      <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff' }}>{employees.length}</Typography>
                      <PeopleAltOutlined sx={{ fontSize: 40, color: '#10b981' }} />
                    </Stack>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ bgcolor: '#0a0a0a', p: 3, borderRadius: '24px', border: '1px solid #1a1a1a' }}>
                    <Typography sx={{ color: '#666', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px' }}>ACTIVE TASKS</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
                      <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff' }}>12</Typography>
                      <AssignmentTurnedInRounded sx={{ fontSize: 40, color: '#fff' }} />
                    </Stack>
                  </Card>
                </Grid>
              </Grid>

              {/* EMPLOYEE TABLE */}
              <Box>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, mb: 2 }}>Employee Directory</Typography>
                <TableContainer component={Paper} sx={{ bgcolor: '#0a0a0a', borderRadius: '24px', border: '1px solid #1a1a1a', overflow: 'hidden' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#111' }}>
                        {['Employee', 'Job Role', 'Status'].map((text) => (
                          <TableCell key={text} sx={{ color: '#666', fontWeight: 800, borderBottom: '1px solid #1a1a1a' }}>{text}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow><TableCell colSpan={3}><Skeleton sx={{ bgcolor: '#111' }} height={100} /></TableCell></TableRow>
                      ) : (
                        employees.map(emp => (
                          <TableRow key={emp.id} sx={{ '&:hover': { bgcolor: '#0d0d0d' } }}>
                            <TableCell sx={{ borderBottom: '1px solid #141414' }}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar src={emp.profileImage} sx={{ bgcolor: '#10b981', color: '#000', fontWeight: 900 }}>{emp.fullName?.[0]}</Avatar>
                                <Box>
                                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{emp.fullName}</Typography>
                                  <Typography sx={{ color: '#555', fontSize: '0.75rem' }}>{emp.email}</Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #141414', color: '#10b981', fontWeight: 700 }}>{emp.jobRole || 'Staff'}</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #141414' }}>
                              <Chip label="Active" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 800 }} />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Stack>
          </Grid>

          {/* RIGHT COLUMN: Calendar & Task Management */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={4}>
              {/* Task Creator Component */}
              <HRTaskCreator />
              
              {/* Calendar Component */}
              <AdminCalendar />
            </Stack>
          </Grid>

        </Grid>
      </Container>

      {/* MODALS */}
      {showCreate && <CreateEmployee onClose={() => setShowCreate(false)} />}
      {showApprove && <AttendanceApprove onClose={() => setShowApprove(false)} />}
      
    </Box>
  );
}