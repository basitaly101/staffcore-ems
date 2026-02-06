'use client';
import { useEffect, useState } from 'react';
import { db, auth } from '@/app/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Box, Typography, Paper, Checkbox, Stack, IconButton } from '@mui/material';
import { TaskAltRounded, RadioButtonUncheckedRounded } from '@mui/icons-material';

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  // Maan lo employee ka department 'Development' hai (ye aap user profile se le sakte hain)
  const employeeDept = "Development"; 

  useEffect(() => {
    const q = query(
      collection(db, 'tasks'), 
      where('department', '==', employeeDept),
      where('status', '==', 'pending')
    );

    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const completeTask = async (taskId, taskDesc) => {
    // English Confirmation Alert
    const confirmAction = window.confirm(`Have you really completed this task: "${taskDesc}"?`);
    
    if (confirmAction) {
      try {
        await updateDoc(doc(db, 'tasks', taskId), {
          status: 'completed',
          completedAt: new Date(),
          completedBy: auth.currentUser?.displayName || 'Employee'
        });
        alert("Great job! Task marked as completed.");
      } catch (error) {
        alert("Something went wrong.");
      }
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: '24px', bgcolor: '#050505', border: '1px solid #1f1f1f', maxWidth: 400 }}>
      <Typography sx={{ color: '#fff', fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TaskAltRounded sx={{ color: '#10b981' }} /> ACTIVE TASKS
      </Typography>

      <Stack spacing={2}>
        {tasks.length === 0 ? (
          <Typography sx={{ color: '#444', textAlign: 'center', py: 2 }}>No pending tasks</Typography>
        ) : (
          tasks.map((t) => (
            <Box 
              key={t.id} 
              sx={{ 
                p: 2, bgcolor: '#0a0a0a', borderRadius: '16px', border: '1px solid #1a1a1a',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: '0.3s', '&:hover': { borderColor: '#10b981' }
              }}
            >
              <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>{t.taskDescription}</Typography>
              <IconButton onClick={() => completeTask(t.id, t.taskDescription)}>
                <RadioButtonUncheckedRounded sx={{ color: '#333' }} />
              </IconButton>
            </Box>
          ))
        )}
      </Stack>
    </Paper>
  );
}