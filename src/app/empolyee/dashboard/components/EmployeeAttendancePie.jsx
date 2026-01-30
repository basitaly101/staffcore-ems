'use client';

import { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { getAuth } from 'firebase/auth';
import { Box, Typography, Stack, Divider } from '@mui/material';
import './styles/attendancePie.css';

export default function EmployeeAttendancePie() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [stats, setStats] = useState({ present: 0, absent: 0, leave: 0, late: 0 });
  const [performance, setPerformance] = useState(0);

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(collection(db, 'attendance'), (snapshot) => {
      let totalEmployees = new Set();
      let betterThan = 0;
      let emp = { present: 0, absent: 0, leave: 0, late: 0 };
      let scoreMap = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        totalEmployees.add(data.employeeId);
        if (!scoreMap[data.employeeId]) scoreMap[data.employeeId] = 0;

        if (data.status === 'present') scoreMap[data.employeeId] += 2;
        if (data.status === 'late') scoreMap[data.employeeId] += 1;
        if (data.status === 'absent') scoreMap[data.employeeId] -= 1;

        if (data.employeeId === user.uid) {
          emp[data.status]++;
        }
      });

      const myScore = scoreMap[user.uid] || 0;
      Object.values(scoreMap).forEach((score) => {
        if (myScore > score) betterThan++;
      });

      const percent = totalEmployees.size > 0 
        ? Math.round((betterThan / totalEmployees.size) * 100) 
        : 0;

      setStats(emp);
      setPerformance(percent);
    });

    return () => unsub();
  }, [user]);

  const data = [
    { label: 'Present', value: stats.present, color: '#c5a059' }, // Gold
    { label: 'Absent', value: stats.absent, color: '#ef4444' },  // Red
    { label: 'Leave', value: stats.leave, color: '#94a3b8' },   // Gray
    { label: 'Late', value: stats.late, color: '#f59e0b' },    // Orange
  ];

  return (
    <Box className="ems-pie-card">
      <Typography className="card-label" mb={2}>
        ATTENDANCE ANALYTICS
      </Typography>

      <Box className="pie-container">
        <PieChart
          series={[{
            data,
            innerRadius: 60,
            outerRadius: 100,
            paddingAngle: 5,
            cornerRadius: 5,
            cx: 120,
          }]}
          slotProps={{ legend: { hidden: true } }} // Custom legend niche banayenge
          width={250}
          height={220}
        />
        <div className="pie-center-label">
          <Typography variant="h6" fontWeight={800}>{performance}%</Typography>
          <Typography variant="caption">Score</Typography>
        </div>
      </Box>

      <Stack spacing={1} mt={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography className="stat-text">Present Days</Typography>
          <Typography fontWeight={700} color="#c5a059">{stats.present}</Typography>
        </Stack>
        <Divider sx={{ opacity: 0.1 }} />
        <Box className="performance-banner">
          <Typography variant="body2">
            You are performing better than <strong>{performance}%</strong> of your colleagues.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}