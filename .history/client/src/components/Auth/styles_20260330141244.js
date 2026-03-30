// styles.js
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  // ... các style khác giữ nguyên

  // Sign In / Sign Up button
  submit: {
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    padding: '12px 0',
    borderRadius: '14px',
    backgroundColor: '#1b255c',       // màu nền mặc định
    color: '#fff',
    boxShadow: '0 8px 20px rgba(27,37,92,0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#4e5db9',     // màu khi hover
      boxShadow: '0 12px 28px rgba(78,93,185,0.4)',
      transform: 'translateY(-2px)',
    },
  },

  // Google Sign In button
  googleButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    width: '100%',
    borderRadius: '14px',
    backgroundColor: '#1b255c',       // màu nền mặc định
    color: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#4e5db9',     // màu khi hover
      boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
      transform: 'translateY(-1px)',
    },
  },

  // Switch mode text (nếu bạn muốn cũng đổi màu hover)
  switchMode: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.9rem',
    color: '#fff',                     // đổi màu chữ để hợp với nền
    '&:hover': {
      color: '#fff',
      backgroundColor: '#4e5db9',
    },
  },
}));