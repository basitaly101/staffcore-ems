'use client';

import { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/app/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
// Yahan Stack hona zaroori hai 👇
import { Box, Typography, Paper, CircularProgress, Stack } from '@mui/material';
// --- Center Label Styling ---
const StyledText = styled('text')(({ theme }) => ({
  fill: '#fff',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontFamily: 'inherit',
}));

function PieCenterLabel({ value }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      <tspan x={left + width / 2} dy="-0.5em" style={{ fontSize: 24, fontWeight: 900, fill: '#10b981' }}>{value}%</tspan>
      <tspan x={left + width / 2} dy="1.5em" style={{ fontSize: 10, fill: '#666', fontWeight: 800 }}>ATTENDANCE</tspan>
    </StyledText>
  );
}

export default function AttendancePieChart() {
  const [stats, setStats] = useState([
    { label: 'Present', value: 0, color: '#10b981' },
    { label: 'Late', value: 0, color: '#ffffff' },
    { label: 'Absent', value: 0, color: '#333333' },
    { label: 'Leave', value: 0, color: '#1a1a1a' },
  ]);
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Query: Sirf logged-in user ka attendance data
        const q = query(
          collection(db, 'attendance'),
          where('userId', '==', user.uid)
        );

        const unsubSnap = onSnapshot(q, (snapshot) => {
          let counts = { present: 0, late: 0, absent: 0, leave: 0 };
          let total = 0;

          snapshot.forEach((doc) => {
            const status = doc.data().status?.toLowerCase();
            if (counts.hasOwnProperty(status)) {
              counts[status]++;
              total++;
            }
          });

          // Chart data update
          setStats([
            { label: 'Present', value: counts.present, color: '#10b981' },
            { label: 'Late', value: counts.late, color: '#ffffff' },
            { label: 'Absent', value: counts.absent, color: '#444' },
            { label: 'Leave', value: counts.leave, color: '#222' },
          ]);

          // Percentage Logic
          const rate = total > 0 ? Math.round(((counts.present + counts.late) / total) * 100) : 0;
          setPercent(rate);
          setLoading(false);
        });

        return () => unsubSnap();
      }
    });

    return () => unsubAuth();
  }, []);

  if (loading) return <CircularProgress sx={{ color: '#10b981', m: 'auto' }} />;

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, borderRadius: '28px', bgcolor: '#050505', border: '1px solid #1f1f1f',
        width: '100%', maxWidth: '350px', textAlign: 'center'
      }}
    >
      <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', mb: 2, letterSpacing: '1px' }}>
        ANALYTICS
      </Typography>

      <Box sx={{ width: '100%', height: 220, position: 'relative' }}>
        <PieChart
          series={[
            {
              data: stats,
              innerRadius: 70,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 6,
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              valueFormatter: (item) => `${item.value} Days`,
            },
          ]}
          slotProps={{ legend: { hidden: true } }} // Custom legend is better for mobile
          height={200}
        >
          <PieCenterLabel value={percent} />
        </PieChart>
      </Box>

      {/* Mini Legend Below */}
      <Stack direction="row" justifyContent="center" spacing={2} mt={1}>
        {stats.map((item) => (
          <Stack key={item.label} direction="row" alignItems="center" spacing={0.5}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
            <Typography sx={{ color: '#666', fontSize: '0.65rem', fontWeight: 700 }}>
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}