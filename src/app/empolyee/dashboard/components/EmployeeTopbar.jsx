'use client';

import { Box, Typography, Stack, Breadcrumbs, Link } from '@mui/material';
import { TodayRounded, WavingHandRounded } from '@mui/icons-material';

export default function EmployeeTopbar({ name = "Muhammad Ali" }) {
  // Get current date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box
      sx={{
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        p: 3,
        mb: 4,
        borderRadius: '24px',
        border: '1px solid rgba(197, 160, 89, 0.2)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 2
      }}
    >
      {/* Left Side: Greeting */}
      <Stack spacing={0.5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 900, 
              color: '#0f172a',
              letterSpacing: '-1px'
            }}
          >
            Welcome Back, {name.split(' ')[0]}
          </Typography>
          <WavingHandRounded sx={{ color: '#c5a059', fontSize: 32 }} />
        </Stack>
        
        <Breadcrumbs aria-label="breadcrumb" sx={{ '& .MuiTypography-root': { fontSize: '0.85rem' } }}>
          <Link underline="hover" color="inherit" href="#">
            StaffCore
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>Employee Dashboard</Typography>
        </Breadcrumbs>
      </Stack>

      {/* Right Side: Date Badge */}
      <Box
        sx={{
          bgcolor: '#0f172a',
          color: '#fff',
          px: 3,
          py: 1.5,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '3px solid #c5a059', // Royal Gold Accent
          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.2)'
        }}
      >
        <TodayRounded sx={{ color: '#c5a059' }} />
        <Stack>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>
            Today's Date
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
            {today}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}