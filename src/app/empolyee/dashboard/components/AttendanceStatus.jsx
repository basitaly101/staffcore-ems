'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { FiberManualRecord, Login, AccessTime } from '@mui/icons-material';
import './styles/attendanceStatus.css';

export default function AttendanceClockCard() {
  const [time, setTime] = useState('');
  const [ampm, setAmpm] = useState('');
  const [dayDate, setDayDate] = useState('');
  
  // Logic from AttendanceStatus
  const checkInTime = "09:05 AM";
  const status = "Present";

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const isPM = hours >= 12;
      const ampmValue = isPM ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      setTime(`${hours}:${minutes}`);
      setAmpm(ampmValue);

      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      setDayDate(now.toLocaleDateString('en-US', options));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="ems-clock-card">
      {/* Dynamic Background Icon based on Time */}
      <div className="bg-icon">
        {ampm === 'PM' ? '🌙' : '☀️'}
      </div>

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" zIndex={2}>
        <Box>
          <Typography className="clock-label">LIVE WORK TIME</Typography>
          <Typography className="clock-main">
            {time}<span className="clock-ampm">{ampm}</span>
          </Typography>
          <Typography className="clock-date">{dayDate}</Typography>
        </Box>
        
        <Box className={`attendance-badge ${status.toLowerCase()}`}>
          <FiberManualRecord sx={{ fontSize: 10, mr: 0.5 }} />
          {status}
        </Box>
      </Stack>

      <Box className="attendance-footer" zIndex={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Login sx={{ fontSize: 18, color: '#c5a059' }} />
          <Typography variant="body2">
            Punch In: <strong>{checkInTime}</strong>
          </Typography>
        </Stack>
        <Typography className="shift-text">Shift: 09:00 AM - 06:00 PM</Typography>
      </Box>
    </Box>
  );
}