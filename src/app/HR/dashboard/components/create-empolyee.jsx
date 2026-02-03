'use client';

import { useState, useRef } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { styled } from '@mui/material/styles';
import { 
  Box, Typography, TextField, Button, Avatar, 
  IconButton, CircularProgress, MenuItem, Stack, Fade, 
  FormControl, InputLabel, Select
} from '@mui/material';
import { PhotoCameraRounded, CloseRounded } from '@mui/icons-material';

// --- STYLES ---
const Overlay = styled('div')({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.95)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1500, // High Z-Index for Modal
  padding: '20px'
});

const ModalContainer = styled('div')({
  backgroundColor: '#0f1115',
  padding: '32px',
  borderRadius: '24px',
  width: '100%',
  maxWidth: '500px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#fff',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative', // Relative position for children
});

const inputSx = {
  mb: 2,
  '& label': { color: '#94a3b8' },
  '& .MuiOutlinedInput-root': {
    bgcolor: '#1a1d23',
    color: '#fff',
    borderRadius: '12px',
    '& fieldset': { borderColor: '#2d333b' },
    '&:hover fieldset': { borderColor: '#22c55e' },
    '&.Mui-focused fieldset': { borderColor: '#22c55e' },
  },
  '& .MuiSelect-icon': { color: '#22c55e' }
};

// --- THE SECRET FIX FOR DROPDOWNS ---
const dropdownFixProps = {
  disablePortal: true, // Dropdown ko modal ke "andar" rakhta hai
  PaperProps: {
    sx: {
      bgcolor: '#1a1d23',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
      zIndex: 2000, // Modal se bhi upar!
    },
  },
};

const JOB_ROLES = ["Frontend Engineer", "Backend Engineer", "Full Stack Developer", "UI/UX Designer", "DevOps Engineer", "Project Manager"];

export default function CreateEmployee({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  const [jobRole, setJobRole] = useState('');
  const [isSupervisor, setIsSupervisor] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateCNIC = (cnic) => {
    const cleanCNIC = cnic.replace(/-/g, "");
    if (cleanCNIC.length !== 13) return "CNIC must be exactly 13 digits.";
    const isRepetitive = cleanCNIC.split('').every(char => char === cleanCNIC[0]);
    if (isRepetitive) return "Invalid CNIC: Numbers cannot be all the same.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const cnicError = validateCNIC(data.cnic);
    if (cnicError) {
      setError(cnicError);
      return;
    }

    if(!jobRole || !isSupervisor) {
        setError("Please select Job Role and Supervisor status.");
        return;
    }

    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        ...data,
        jobRole,
        supervisorAuthority: isSupervisor,
        profileImage: imagePreview,
        role: 'employee',
        status: 'active',
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (err) {
      setError(err.message.replace('Firebase:', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in>
      <Overlay>
        <ModalContainer>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight={700}>Add New Employee</Typography>
            <IconButton onClick={onClose} sx={{ color: '#94a3b8' }}><CloseRounded /></IconButton>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box position="relative" display="inline-block">
                <Avatar src={imagePreview} sx={{ width: 80, height: 80, border: '2px solid #22c55e', bgcolor: '#1a1d23' }} />
                <IconButton 
                  onClick={() => fileInputRef.current.click()}
                  sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#22c55e', color: '#000', transform: 'scale(0.8)' }}
                ><PhotoCameraRounded fontSize="small" /></IconButton>
              </Box>
              <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
            </Box>

            <Typography variant="caption" color="#22c55e" fontWeight={700} sx={{ display: 'block', mb: 2 }}>PERSONAL DETAILS</Typography>

            <TextField fullWidth label="Full Name" name="fullName" sx={inputSx} required />
            <TextField fullWidth label="Father Name" name="fatherName" sx={inputSx} required />
            <TextField 
              fullWidth 
              label="CNIC Number (13 Digits)" 
              name="cnic" 
              sx={inputSx} 
              required 
              inputProps={{ maxLength: 13 }}
            />
            <TextField fullWidth label="Education" name="education" sx={inputSx} required />

            {/* FIXED JOB ROLE DROPDOWN */}
            <FormControl fullWidth sx={inputSx} required>
              <InputLabel id="job-role-label">Job Role</InputLabel>
              <Select
                labelId="job-role-label"
                id="job-role-select"
                value={jobRole}
                label="Job Role"
                onChange={(e) => setJobRole(e.target.value)}
                MenuProps={dropdownFixProps} // Important!
              >
                {JOB_ROLES.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* FIXED SUPERVISOR DROPDOWN */}
            <FormControl fullWidth sx={inputSx} required>
              <InputLabel id="supervisor-label">Is Supervisor?</InputLabel>
              <Select
                labelId="supervisor-label"
                id="supervisor-select"
                value={isSupervisor}
                label="Is Supervisor?"
                onChange={(e) => setIsSupervisor(e.target.value)}
                MenuProps={dropdownFixProps} // Important!
              >
                <MenuItem value="yes">Yes (Manager Access)</MenuItem>
                <MenuItem value="no">No (Regular Employee)</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="caption" color="#22c55e" fontWeight={700} sx={{ display: 'block', mt: 2, mb: 2 }}>ACCOUNT ACCESS</Typography>

            <TextField fullWidth label="Official Email" name="email" type="email" sx={inputSx} required />
            <TextField fullWidth label="Temp Password" name="password" type="password" sx={inputSx} required />

            {error && (
              <Typography sx={{ color: '#ff4d4d', fontSize: '0.8rem', mb: 2, textAlign: 'center', bgcolor: 'rgba(255, 77, 77, 0.1)', py: 1, borderRadius: '8px' }}>
                {error}
              </Typography>
            )}

            <Stack spacing={2} mt={4}>
              <Button fullWidth variant="contained" type="submit" disabled={loading}
                sx={{ bgcolor: '#22c55e', color: '#000', fontWeight: 700, height: '54px', borderRadius: '12px', '&:hover': { bgcolor: '#1db954' } }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Registration'}
              </Button>
              <Button fullWidth onClick={onClose} sx={{ color: '#94a3b8', textTransform: 'none' }}>Cancel</Button>
            </Stack>
          </form>
        </ModalContainer>
      </Overlay>
    </Fade>
  );
}