'use client';

import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { CalendarMonthRounded, AutoAwesomeRounded } from '@mui/icons-material';

export default function MasterCalendar() {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        width: '100%', 
        maxWidth: '320px', // Chota aur compact size
        p: 2.5, 
        borderRadius: '28px', 
        bgcolor: '#050505', // Deep Black
        border: '1px solid #1f1f1f',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Effect: Subtle Green Glow */}
      <Box sx={{
        position: 'absolute', top: -40, right: -40, width: 100, height: 100,
        bgcolor: 'rgba(16, 185, 129, 0.1)', filter: 'blur(40px)', borderRadius: '50%'
      }} />

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} px={0.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ 
            bgcolor: 'rgba(16, 185, 129, 0.15)', 
            p: 0.6, 
            borderRadius: '10px', 
            display: 'flex',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <CalendarMonthRounded sx={{ color: '#10b981', fontSize: '1.1rem' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
              SCHEDULE
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: '#666', fontWeight: 700 }}>
              YEAR 2026
            </Typography>
          </Box>
        </Stack>
        <AutoAwesomeRounded sx={{ color: '#222', fontSize: '1rem' }} />
      </Stack>

      {/* Calendar Component Overrides */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{
          '& .MuiDateCalendar-root': { 
            width: '100%', 
            height: 'auto',
            maxHeight: '290px'
          },
          // Month/Year Label
          '& .MuiPickersCalendarHeader-label': { 
            fontSize: '0.85rem', 
            fontWeight: 800, 
            color: '#fff' 
          },
          '& .MuiSvgIcon-root': { color: '#666', fontSize: '1.2rem' },
          // Weekdays (M, T, W...)
          '& .MuiDayCalendar-weekDayLabel': { 
            color: '#10b981', 
            fontWeight: 800, 
            fontSize: '0.7rem',
            width: '32px'
          },
          // Days Styling
          '& .MuiPickersDay-root': { 
            color: '#ccc', 
            fontSize: '0.75rem',
            fontWeight: 600,
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            transition: '0.2s',
            '&:hover': { bgcolor: '#111', color: '#10b981' },
            // Selected Day
            '&.Mui-selected': { 
              bgcolor: '#10b981 !important', 
              color: '#000 !important',
              fontWeight: 800,
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            },
            // Today's Date
            '&.MuiPickersDay-today': { 
              borderColor: '#10b981 !important',
              color: '#10b981'
            }
          },
          // Removing unnecessary padding
          '& .MuiPickersCalendarHeader-root': {
            paddingLeft: '8px',
            paddingRight: '8px',
          }
        }}>
          <DateCalendar />
        </Box>
      </LocalizationProvider>

      {/* Footer Branding */}
      <Box sx={{ 
        mt: 1, 
        py: 0.8, 
        bgcolor: 'rgba(255,255,255,0.02)', 
        borderRadius: '12px', 
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.03)'
      }}>
        <Typography sx={{ fontSize: '0.65rem', color: '#444', fontWeight: 800, letterSpacing: '1px' }}>
          STAFFCORE SYSTEM
        </Typography>
      </Box>
    </Paper>
  );
}