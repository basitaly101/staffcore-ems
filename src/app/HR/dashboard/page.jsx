'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import CreateEmployee from './components/create-empolyee';
import {
  Box, Typography, Button, Stack, Card,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, CircularProgress, Chip
} from '@mui/material';
import { AddRounded, PeopleAltOutlined } from '@mui/icons-material';

export default function HRDashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setEmployees(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-in' }}>
      
      {/* HEADER SECTION */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5}>
        <Box>
          <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-2px', color: '#0f172a' }}>
            HR <span style={{ color: '#22c55e' }}>Management</span>
          </Typography>
          <Typography sx={{ color: '#64748b' }}>
            Total {employees.length} active employees registered.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={() => setShowCreate(true)}
          sx={{
            bgcolor: '#22c55e', color: '#000', fontWeight: 800, px: 4, py: 1.5,
            borderRadius: '14px', textTransform: 'none',
            '&:hover': { bgcolor: '#1db954' },
          }}
        >
          Add Employee
        </Button>
      </Stack>

      {/* STATS CARD */}
      <Card sx={{ 
        p: 3, maxWidth: 300, mb: 6, borderRadius: 4, 
        bgcolor: '#0a0a0a', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' 
      }}>
        <Typography fontSize="0.75rem" fontWeight={700} color="#64748b">TOTAL STAFF</Typography>
        <Stack direction="row" justifyContent="space-between" mt={1}>
          <Typography variant="h3" fontWeight={900}>{employees.length}</Typography>
          <PeopleAltOutlined sx={{ fontSize: 40, color: '#22c55e' }} />
        </Stack>
      </Card>

      {/* TABLE SECTION */}
      <Typography variant="h6" fontWeight={800} mb={3} color="#0f172a">
        Employee Directory
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 4, bgcolor: '#0a0a0a', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        {loading ? (
          <Box sx={{ p: 8, textAlign: 'center' }}><CircularProgress color="success" /></Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
              <TableRow>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Employee</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>CNIC</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {employees.map(emp => (
                <TableRow key={emp.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' } }}>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={emp.profileImage} sx={{ bgcolor: '#22c55e', fontWeight: 800 }}>
                        {emp.fullName?.[0]}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700} color="#fff">{emp.fullName}</Typography>
                        <Typography fontSize="0.75rem" color="#64748b">{emp.email}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{emp.cnic}</TableCell>
                  <TableCell sx={{ color: '#22c55e', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {emp.jobRole || 'Staff'}
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Chip label="Active" sx={{ bgcolor: '#22c55e20', color: '#22c55e', fontWeight: 700 }} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {showCreate && <CreateEmployee onClose={() => setShowCreate(false)} />}
    </Box>
  );
}