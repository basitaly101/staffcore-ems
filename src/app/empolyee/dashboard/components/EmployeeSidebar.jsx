'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Drawer as MuiDrawer, AppBar as MuiAppBar, Toolbar, List, CssBaseline, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Stack, Tooltip } from '@mui/material';
import { 
  DashboardRounded, 
  EventAvailableRounded, 
  AssignmentRounded, 
  EventBusyRounded, 
  PersonRounded, 
  LogoutRounded, 
  NotificationsNoneRounded,
  MenuOpenRounded, 
  GridViewRounded 
} from '@mui/icons-material';

const drawerWidth = 280;

// Smooth Transition Setting
const transitionStyle = (theme) => theme.transitions.create(['width', 'margin', 'transform'], {
  easing: theme.transitions.easing.sharp,
  duration: theme.transitions.duration.enteringScreen,
});

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: transitionStyle(theme),
  overflowX: 'hidden',
  background: '#0f172a', 
  borderRight: '1.5px solid rgba(197, 160, 89, 0.3)',
});

const closedMixin = (theme) => ({
  transition: transitionStyle(theme),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(10)} + 1px)`, // Width itni rakhi hai ke icon nazar aaye
  background: '#0f172a',
  borderRight: '1.5px solid rgba(197, 160, 89, 0.3)',
});

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'rgba(255, 255, 255, 0.8) !important',
  backdropFilter: 'blur(15px)',
  color: '#0f172a',
  transition: transitionStyle(theme),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2.5),
  minHeight: '80px',
}));

export default function EmployeeSidebar({ children }) {
  const [open, setOpen] = React.useState(true);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardRounded />, active: true },
    { text: 'My Attendance', icon: <EventAvailableRounded /> },
    { text: 'My Tasks', icon: <AssignmentRounded /> },
    { text: 'Leave Requests', icon: <EventBusyRounded /> },
    { text: 'My Profile', icon: <PersonRounded /> },
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <CssBaseline />

      {/* TOP HEADER */}
      <AppBar position="fixed" open={open} elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Toolbar sx={{ height: 80 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
            
            {/* ✅ FIXED TOGGLE: Ye hamesha AppBar ke start mein rahega */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                background: open ? 'transparent' : 'rgba(197, 160, 89, 0.15)',
                color: '#c5a059',
                borderRadius: '12px',
                mr: 2,
                transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'all 0.4s ease',
                '&:hover': { background: 'rgba(197, 160, 89, 0.25)' }
              }}
            >
              <MenuOpenRounded sx={{ fontSize: 28 }} />
            </IconButton>

            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: -1, flexGrow: 1 }}>
              STAFF<span style={{ color: '#c5a059' }}>CORE</span>
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: '#c5a059', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>MA</Avatar>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ opacity: open ? 1 : 0, transition: '0.2s' }}>
            <GridViewRounded sx={{ color: '#c5a059', fontSize: 32 }} />
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', letterSpacing: 1 }}>
              ELITE
            </Typography>
          </Stack>
        </DrawerHeader>

        <Box sx={{ px: 2, mt: 1 }}>
           <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
        </Box>

        <List sx={{ px: 2, mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 1 }}>
              <Tooltip title={!open ? item.text : ""} placement="right" arrow>
                <ListItemButton
                  sx={{
                    minHeight: 55,
                    borderRadius: '16px',
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    background: item.active ? 'linear-gradient(135deg, #c5a059 0%, #a68442 100%)' : 'transparent',
                    '&:hover': {
                      background: item.active ? 'linear-gradient(135deg, #c5a059 0%, #a68442 100%)' : 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 0, 
                    mr: open ? 2 : 'auto', 
                    color: item.active ? '#0f172a' : '#94a3b8',
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      opacity: open ? 1 : 0,
                      '& .MuiTypography-root': { 
                        fontWeight: item.active ? 800 : 500,
                        fontSize: '0.9rem',
                        color: item.active ? '#0f172a' : '#94a3b8'
                      }
                    }} 
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', p: 2, mb: 2 }}>
          <ListItemButton sx={{ 
            borderRadius: '16px', 
            bgcolor: 'rgba(239, 68, 68, 0.08)', 
            justifyContent: open ? 'initial' : 'center',
            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' } 
          }}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', color: '#ef4444' }}>
              <LogoutRounded />
            </ListItemIcon>
            <ListItemText primary="Sign Out" sx={{ opacity: open ? 1 : 0, '& .MuiTypography-root': { fontWeight: 800, color: '#ef4444' } }} />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* MAIN CONTENT AREA */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 5 }, 
          width: '100%', 
          pt: '110px',
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}