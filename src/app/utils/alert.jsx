import Swal from 'sweetalert2';

const colors = {
  bg: '#0d0d0d',
  text: '#ffffff',
  green: '#10b981',
  error: '#ef4444'
};

export const showToast = (icon, title, text) => {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    background: colors.bg,
    color: colors.text,
    confirmButtonColor: colors.green,
    iconColor: icon === 'error' ? colors.error : colors.green,
    customClass: {
      popup: 'premium-border',
      confirmButton: 'swal-btn'
    }
  });
};

export const showAuthSuccess = (role) => {
  return Swal.fire({
    icon: 'success',
    title: 'Authenticated!',
    text: `Redirecting to ${role.toUpperCase()} Portal...`,
    timer: 2000,
    showConfirmButton: false,
    background: colors.bg,
    color: colors.text,
    iconColor: colors.green
  });
};