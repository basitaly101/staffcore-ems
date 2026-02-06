'use client';

import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box, Typography, Paper, Stack, Badge } from '@mui/material';
import { CalendarMonthRounded, Circle } from '@mui/icons-material';

export default function EmployeeCalendar() {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2.5, 
        borderRadius: '24px', 
        bgcolor: '#0d0d0d', // Deep Black
        border: '1px solid #1f1f1f',
        color: '#fff'
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} px={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CalendarMonthRounded sx={{ color: '#10b981' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>My Schedule</Typography>
        </Stack>
        <Typography sx={{ fontSize: '0.75rem', color: '#10b981', bgcolor: 'rgba(16,185,129,0.1)', px: 1.5, py: 0.5, borderRadius: '10px' }}>
          Personal
        </Typography>
      </Stack>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{
          '& .MuiDateCalendar-root': { width: '100%', bgcolor: 'transparent' },
          '& .MuiPickersDay-root': { color: '#fff', fontWeight: 500, '&:hover': { bgcolor: '#1f1f1f' } },
          '& .MuiPickersDay-root.Mui-selected': { bgcolor: '#10b981 !important', color: '#000 !important' },
          '& .MuiPickersDay-today': { borderColor: '#10b981 !important', color: '#10b981' },
          '& .MuiDayCalendar-weekDayLabel': { color: '#666', fontWeight: 700 },
          '& .MuiPickersCalendarHeader-label': { fontWeight: 800, color: '#fff' },
          '& .MuiSvgIcon-root': { color: '#666' }
        }}>
          <DateCalendar />
        </Box>
      </LocalizationProvider>

      {/* Quick Stats for Employee */}
      <Stack spacing={1.5} mt={1} pt={2} sx={{ borderTop: '1px solid #1f1f1f' }}>
         <Stack direction="row" alignItems="center" spacing={1}>
            <Circle sx={{ fontSize: 10, color: '#10b981' }} />
            <Typography sx={{ fontSize: '0.85rem', color: '#888' }}>Check-in: 09:00 AM</Typography>
         </Stack>
      </Stack>
    </Paper>
  );
}