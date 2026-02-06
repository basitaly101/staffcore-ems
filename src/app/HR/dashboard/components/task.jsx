'use client';
import { useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Box, Typography, Paper, TextField, MenuItem, Button, Stack } from '@mui/material';
import { SendRounded, AssignmentIndRounded } from '@mui/icons-material';
import { showToast } from '../../../utils/alert';

const departments = ['Development', 'Design', 'Marketing', 'Sales', 'HR'];

export default function HRTaskCreator() {
  const [field, setField] = useState('');
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);

  const sendTask = async () => {
    if (!field || !task) return showToast('error', 'Missing Info', 'Please fill all fields');
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        department: field,
        taskDescription: task,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setTask('');
      showToast('success', 'Task Assigned', `Task sent to ${field} team.`);
    } catch (error) {
      showToast('error', 'Error', 'Failed to send task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: '24px', bgcolor: '#050505', border: '1px solid #1f1f1f', maxWidth: 400 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={3}>
        <AssignmentIndRounded sx={{ color: '#10b981' }} />
        <Typography sx={{ color: '#fff', fontWeight: 800 }}>ASSIGN NEW TASK</Typography>
      </Stack>

      <Stack spacing={2.5}>
        <TextField
          select
          label="Select Department"
          value={field}
          onChange={(e) => setField(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ '& .MuiOutlinedInput-root': { color: '#fff', bgcolor: '#0a0a0a' }, '& label': { color: '#666' } }}
        >
          {departments.map((dept) => (
            <MenuItem key={dept} value={dept}>{dept}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Task Description"
          multiline
          rows={3}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { color: '#fff', bgcolor: '#0a0a0a' }, '& label': { color: '#666' } }}
        />

        <Button
          fullWidth
          onClick={sendTask}
          disabled={loading}
          variant="contained"
          startIcon={<SendRounded />}
          sx={{ bgcolor: '#10b981', color: '#000', fontWeight: 900, py: 1.5, borderRadius: '12px', '&:hover': { bgcolor: '#fff' } }}
        >
          {loading ? 'SENDING...' : 'DISPATCH TASK'}
        </Button>
      </Stack>
    </Paper>
  );
}