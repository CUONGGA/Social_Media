// styles.js
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  // Paper / Card chính
  paper: {
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(5),
    borderRadius: '20px',
    background: '#ffffff',
    boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
    },
  },

  // Avatar icon
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#4f46e5',
    width: theme.spacing(8),
    height: theme.spacing(8),
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },

  // Form container
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },

  // Input fields
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#f9fafc',
      '&:hover fieldset': {
        borderColor: '#4f46e5',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6366f1',
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#555',
      fontWeight: 500,
    },
  },

  // Sign In / Sign Up button
  submit: {
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    padding: '12px 0',
    borderRadius: '14px',
    background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
    color: '#fff',
    boxShadow: '0 8px 20px rgba(79,70,229,0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)',
      boxShadow: '0 12px 28px rgba(79,70,229,0.4)',
      transform: 'translateY(-2px)',
    },
  },

  // Google Sign In button
  googleButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    width: '100%',
    borderRadius: '14px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
      transform: 'translateY(-1px)',
    },
  },

  // Typography / Heading
  heading: {
    fontWeight: 700,
    fontSize: '1.8rem',
    color: '#4f46e5',
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },

  // Small switch mode text
  switchMode: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.9rem',
    color: '#555',
    '&:hover': {
      color: '#4f46e5',
      backgroundColor: 'transparent',
    },
  },
}));