'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import {
  Box, List, CssBaseline, Typography, IconButton, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Avatar, Stack,
  Tooltip, Drawer as MuiDrawer, Skeleton
} from '@mui/material';
import {
  DashboardRounded, PeopleAltRounded, AssignmentRounded,
  EventNoteRounded, SettingsRounded, LogoutRounded,
} from '@mui/icons-material';

import Image from 'next/image';
import logo from '../../../assets/logo.png';
import icon from '../../../assets/icon.png';

import { auth, db } from '@/app/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 80;

const THEME = {
  bg: '#f8fafc', 
  sidebar: '#0a0a0a',
  primary: '#22c55e',
  primaryGlow: 'rgba(34, 197, 94, 0.15)',
  textMain: '#ffffff',
  textMuted: '#94a3b8',
  border: 'rgba(255, 255, 255, 0.08)'
};

const StyledDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    '& .MuiDrawer-paper': {
      width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
      backgroundColor: THEME.sidebar,
      color: THEME.textMain,
      borderRight: 'none',
      height: '100vh',
      position: 'fixed', // Position fixed to prevent gaps
      transition: theme.transitions.create('width', {
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        duration: 250,
      }),
      overflowX: 'hidden',
      zIndex: 1201,
    },
  }),
);

const MainContent = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    minHeight: '100vh',
    backgroundColor: THEME.bg,
    // 🔥 GAP FIX: Margin is exactly the width of sidebar
    marginLeft: open ? DRAWER_WIDTH : COLLAPSED_WIDTH, 
    transition: theme.transitions.create('margin', {
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      duration: 250,
    }),
    padding: '32px',
    width: `calc(100% - ${open ? DRAWER_WIDTH : COLLAPSED_WIDTH}px)`,
  })
);

export default function PremiumSidebar({ children }) {
  const [open, setOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUserData(docSnap.data());
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => signOut(auth).then(() => router.push('/login'));

  const menuItems = useMemo(() => [
    { text: 'Dashboard', icon: <DashboardRounded /> },
    { text: 'Employees', icon: <PeopleAltRounded /> },
    { text: 'Tasks', icon: <AssignmentRounded /> },
    { text: 'Attendance', icon: <EventNoteRounded /> },
    { text: 'Settings', icon: <SettingsRounded /> },
  ], []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <StyledDrawer variant="permanent" open={open}>
        <Box
          onClick={() => setOpen(!open)}
          sx={{
            p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', borderBottom: `1px solid ${THEME.border}`, mb: 2, minHeight: '90px'
          }}
        >
          <Box sx={{ position: 'relative', width: open ? 160 : 38, height: 45 }}>
            <Image src={open ? logo : icon} alt="Logo" fill style={{ objectFit: 'contain' }} priority />
          </Box>
        </Box>

        <List sx={{ px: 1.5, flexGrow: 1 }}>
          {menuItems.map((item) => {
            const isActive = activeItem === item.text;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5, display: 'block' }}>
                <ListItemButton
                  onClick={() => setActiveItem(item.text)}
                  sx={{
                    borderRadius: '12px',
                    bgcolor: isActive ? THEME.primaryGlow : 'transparent',
                    color: isActive ? THEME.primary : THEME.textMuted,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5, minHeight: '48px',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ display: open ? 'block' : 'none', '& span': { fontWeight: isActive ? 700 : 500 } }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ p: 2, borderTop: `1px solid ${THEME.border}` }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: THEME.primary, color: '#000', fontWeight: 'bold' }}>
              {userData?.fullName?.charAt(0) || 'U'}
            </Avatar>
            {open && (
              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Typography variant="body2" noWrap sx={{ color: '#fff', fontWeight: 700 }}>
                  {userData?.fullName || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textMuted }}>
                  {userData?.role || 'Employee'}
                </Typography>
              </Box>
            )}
            {open && (
              <IconButton onClick={handleLogout} size="small" sx={{ color: '#ef4444' }}>
                <LogoutRounded fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Box>
      </StyledDrawer>

      <MainContent open={open}>
        {children}
      </MainContent>
    </Box>
  );
}