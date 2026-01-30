'use client';

import { Box, Typography, Divider, Stack, Grid, Paper } from '@mui/material';
import { 
  BadgeRounded, 
  FingerprintRounded, 
  WorkRounded, 
  AccessTimeFilledRounded, 
  CorporateFareRounded 
} from '@mui/icons-material';

export default function ProfileCard() {
  // Profile item helper component
  const ProfileItem = ({ icon, label, value }) => (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
      <Box 
        sx={{ 
          bgcolor: 'rgba(197, 160, 89, 0.1)', 
          p: 1.2, 
          borderRadius: '12px',
          display: 'flex',
          color: '#c5a059'
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: '1rem', color: '#0f172a', fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 4, 
        borderRadius: '30px', 
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Gold Corner */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        width: '100px', 
        height: '100px', 
        background: 'radial-gradient(circle at top right, rgba(197, 160, 89, 0.15), transparent 70%)' 
      }} />

      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Box sx={{ width: 6, height: 24, bgcolor: '#c5a059', borderRadius: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>
          Personal Information
        </Typography>
      </Stack>

      <Divider sx={{ mb: 4, opacity: 0.6 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ProfileItem 
            icon={<BadgeRounded />} 
            label="Full Name" 
            value="Ali Khan" 
          />
          <ProfileItem 
            icon={<FingerprintRounded />} 
            label="CNIC / Identity" 
            value="35202-XXXXXXX-X" 
          />
          <ProfileItem 
            icon={<WorkRounded />} 
            label="Designation" 
            value="Frontend Developer" 
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <ProfileItem 
            icon={<AccessTimeFilledRounded />} 
            label="Work Shift" 
            value="9 AM – 6 PM" 
          />
          <ProfileItem 
            icon={<CorporateFareRounded />} 
            label="Department" 
            value="Information Technology" 
          />
          {/* Status Badge */}
          <Box 
            sx={{ 
              mt: 1, 
              p: 1.5, 
              borderRadius: '15px', 
              bgcolor: '#0f172a', 
              color: '#fff',
              textAlign: 'center',
              borderBottom: '3px solid #c5a059'
            }}
          >
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8 }}>Employment Status</Typography>
            <Typography sx={{ fontWeight: 800, color: '#c5a059' }}>ACTIVE PERMANENT</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}