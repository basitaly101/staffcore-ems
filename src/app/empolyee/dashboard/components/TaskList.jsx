'use client';

import { Box, Typography, List, ListItem, Stack, Chip, LinearProgress } from '@mui/material';
import { 
  CheckCircleRounded, 
  PendingActionsRounded, 
  AssignmentLateRounded, 
  TaskAltRounded 
} from '@mui/icons-material';

export default function TaskList() {
  const tasks = [
    { id: 1, title: "Complete dashboard UI", status: "completed" },
    { id: 2, title: "Fix login validation", status: "completed" },
    { id: 3, title: "Firebase integration", status: "pending" },
  ];

  // Status Badge Logic
  const getStatusStyle = (status) => {
    if (status === 'completed') {
      return { 
        icon: <CheckCircleRounded sx={{ color: '#2e7d32', fontSize: 20 }} />, 
        bgcolor: 'rgba(46, 125, 50, 0.1)', 
        color: '#2e7d32', 
        label: 'Done' 
      };
    }
    return { 
      icon: <PendingActionsRounded sx={{ color: '#c5a059', fontSize: 20 }} />, 
      bgcolor: 'rgba(197, 160, 89, 0.1)', 
      color: '#c5a059', 
      label: 'In Progress' 
    };
  };

  return (
    <Box 
      sx={{ 
        bgcolor: "#fff", 
        p: 3, 
        borderRadius: '24px', 
        boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.05)',
        height: '100%'
      }}
    >
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <TaskAltRounded sx={{ color: '#0f172a' }} />
          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
            My Tasks
          </Typography>
        </Stack>
        <Chip 
          label="Weekly Goals" 
          size="small" 
          sx={{ bgcolor: '#0f172a', color: '#c5a059', fontWeight: 700, fontSize: '0.65rem' }} 
        />
      </Stack>

      {/* Mini Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Completion Progress</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>66%</Typography>
        </Stack>
        <LinearProgress 
          variant="determinate" 
          value={66} 
          sx={{ 
            height: 6, 
            borderRadius: 5, 
            bgcolor: '#f1f5f9',
            '& .MuiLinearProgress-bar': { bgcolor: '#c5a059' } 
          }} 
        />
      </Box>

      {/* Task List */}
      <List disablePadding>
        {tasks.map((task) => {
          const style = getStatusStyle(task.status);
          return (
            <ListItem 
              key={task.id}
              disablePadding
              sx={{ 
                mb: 2, 
                p: 2, 
                borderRadius: '16px', 
                border: '1px solid #f1f5f9',
                transition: '0.3s',
                '&:hover': { 
                  transform: 'translateX(5px)', 
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                  borderColor: '#c5a059' 
                }
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {style.icon}
                  <Typography 
                    sx={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 600, 
                      color: task.status === 'completed' ? '#94a3b8' : '#0f172a',
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                    }}
                  >
                    {task.title}
                  </Typography>
                </Stack>
                
                <Box 
                  sx={{ 
                    px: 1.5, 
                    py: 0.5, 
                    borderRadius: '8px', 
                    fontSize: '0.65rem', 
                    fontWeight: 800, 
                    bgcolor: style.bgcolor, 
                    color: style.color,
                    textTransform: 'uppercase'
                  }}
                >
                  {style.label}
                </Box>
              </Stack>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}