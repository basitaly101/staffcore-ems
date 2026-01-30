'use client';

import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { EventNoteRounded } from '@mui/icons-material';

export default function CalendarCard() {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        borderRadius: '24px', 
        bgcolor: '#fff', 
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" px={2} pt={1} mb={1}>
        <EventNoteRounded sx={{ color: '#c5a059' }} />
        <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
          Schedule
        </Typography>
      </Stack>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{
          '& .MuiDateCalendar-root': { width: '100%', height: 'auto' },
          '& .MuiPickersDay-root.Mui-selected': { bgcolor: '#c5a059 !important' },
          '& .MuiPickersDay-today': { borderColor: '#c5a059 !important' },
          '& .MuiDayCalendar-weekDayLabel': { color: '#64748b', fontWeight: 700 },
          '& .MuiTypography-caption': { fontWeight: 800 }
        }}>
          <DateCalendar />
        </Box>
      </LocalizationProvider>
    </Paper>
  );
}