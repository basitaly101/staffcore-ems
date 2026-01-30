'use client';

import { Box, Typography, Paper, Stack } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { TrendingUpRounded } from '@mui/icons-material';

export default function TaskCompletionChart() {
  // Sample Data: Din aur mukammal kiye gaye tasks
  const pData = [2, 5, 3, 8, 6, 9, 7]; // Tasks completed
  const xLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: '24px', 
        bgcolor: '#0f172a', // Midnight Navy background
        color: '#fff',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)',
        border: '1px solid rgba(197, 160, 89, 0.2)',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <TrendingUpRounded sx={{ color: '#c5a059' }} />
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: 0.5 }}>
              Task Efficiency
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Completed tasks this week
            </Typography>
          </Box>
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#c5a059' }}>
          40
        </Typography>
      </Stack>

      <Box sx={{ width: '100%', height: 200 }}>
        <LineChart
          series={[
            {
              data: pData,
              label: 'Tasks',
              area: true, // Flatline with area fill
              color: '#c5a059',
            },
          ]}
          xAxis={[{ scaleType: 'point', data: xLabels }]}
          sx={{
            '.MuiLineElement-root': { strokeWidth: 4 },
            '.MuiAreaElement-root': { fill: 'url(#gradient)' },
            '& .MuiChartsAxis-left .MuiChartsAxis-tickLabel': { fill: '#94a3b8', fontWeight: 600 },
            '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': { fill: '#94a3b8', fontWeight: 600 },
            '& .MuiChartsAxis-line': { stroke: '#1e293b' },
          }}
          margin={{ left: 30, right: 10, top: 20, bottom: 30 }}
        />
        {/* SVG Gradient for the Area Chart */}
        <svg style={{ height: 0 }}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </svg>
      </Box>
    </Paper>
  );
}