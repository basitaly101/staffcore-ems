'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import {
  Box, List, CssBaseline, Typography, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Avatar, Stack,
  Tooltip, Drawer as MuiDrawer, Skeleton, Chip
} from '@mui/material';
import {
  DashboardRounded, PeopleAltRounded, AssignmentRounded,
  SettingsRounded, LogoutRounded
} from '@mui/icons-material';

import Image from 'next/image';
// Logo & Icon Paths according to your directory
import logoImg from '@/app/assets/logo.png'; 
import iconImg from '@/app/assets/icon.png';

import { auth, db } from '@/app/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 88;

const THEME = {
  bg: '#f8fafc', 
  sidebar: '#0a0a0a',
  primary: '#22c55e',
  primaryGlow: 'rgba(34, 197, 94, 0.12)',
  textMain: '#ffffff',
  textMuted: '#64748b',
  border: 'rgba(255, 255, 255, 0.06)'
};

// --- ULTRA SMOOTH DRAWER ---
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
      overflowX: 'hidden',
      // Isse lagging khatam hoti hai (0.2s is the sweet spot)
      transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
      transform: 'translateZ(0)', 
      willChange: 'width',
    },
  }),
);

const MenuItem = memo(({ item, open, isActive }) => (
  <ListItem disablePadding sx={{ mb: 0.5, px: 1.5 }}>
    <Link href={item.path} style={{ textDecoration: 'none', width: '100%' }}>
      <Tooltip title={!open ? item.text : ""} placement="right" arrow>
        <ListItemButton
          sx={{
            borderRadius: '12px',
            bgcolor: isActive ? THEME.primaryGlow : 'transparent',
            color: isActive ? THEME.primary : THEME.textMuted,
            justifyContent: open ? 'initial' : 'center',
            minHeight: '48px',
            transition: 'background 0.2s',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#fff' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', color: 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          {open && (
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500 }} 
            />
          )}
        </ListItemButton>
      </Tooltip>
    </Link>
  </ListItem>
));

MenuItem.displayName = 'MenuItem';

export default function PremiumSidebar({ children }) {
  const [open, setOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) setUserData(docSnap.data());
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const menuItems = useMemo(() => [
    { text: 'Dashboard', icon: <DashboardRounded />, path: '/dashboard/hr' },
    { text: 'Employees', icon: <PeopleAltRounded />, path: '/dashboard/employees' },
    { text: 'Tasks', icon: <AssignmentRounded />, path: '/dashboard/tasks' },
    { text: 'Settings', icon: <SettingsRounded />, path: '/dashboard/settings' },
  ], []);

  return (
    <Box sx={{ display: 'flex', bgcolor: THEME.bg, minHeight: '100vh' }}>
      <CssBaseline />
      
      <StyledDrawer variant="permanent" open={open}>
        {/* LOGO SECTION - Now using your actual images */}
        <Box
          onClick={() => setOpen(!open)}
          sx={{
            height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', p: 2, transition: '0.2s'
          }}
        >
          <Box sx={{ position: 'relative', width: open ? 160 : 40, height: 50 }}>
            <Image 
              src={open ? logoImg : iconImg} 
              alt="Logo" 
              fill 
              style={{ objectFit: 'contain' }}
              priority // Isse logo jaldi load hoga bina lag ke
            />
          </Box>
        </Box>

        {/* NAVIGATION */}
        <List sx={{ flexGrow: 1, mt: 2 }}>
          {menuItems.map((item) => (
            <MenuItem key={item.path} item={item} open={open} isActive={pathname === item.path} />
          ))}
        </List>

        {/* PROFILE SECTION */}
        <Box sx={{ p: 2, borderTop: `1px solid ${THEME.border}`, bgcolor: 'rgba(255,255,255,0.02)' }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent={open ? 'flex-start' : 'center'}>
            {loading ? (
              <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'grey.900' }} />
            ) : (
              <Avatar sx={{ bgcolor: THEME.primary, color: '#000', fontWeight: 'bold' }}>
                {userData?.fullName?.[0] || 'A'}
              </Avatar>
            )}
            {open && !loading && (
              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Typography variant="body2" noWrap fontWeight={700}>{userData?.fullName || 'Admin'}</Typography>
                <Chip label="Active" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: THEME.primary, fontWeight: 900 }} />
              </Box>
            )}
          </Stack>
          
          {open && (
            <ListItemButton 
              onClick={() => signOut(auth).then(() => router.push('/login'))}
              sx={{ mt: 2, borderRadius: '10px', color: '#ef4444', height: 40, '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
            >
              <LogoutRounded fontSize="small" sx={{ mr: 1 }} />
              <Typography fontSize="0.75rem" fontWeight={700}>LOGOUT</Typography>
            </ListItemButton>
          )}
        </Box>
      </StyledDrawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 4, 
          // Main content width automatically adjusts with sidebar
          width: `calc(100% - ${open ? DRAWER_WIDTH : COLLAPSED_WIDTH}px)`,
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}