import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    borderRadius: '16px',
    background: '#ffffff',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 12px 32px rgba(0,0,0,0.16)',
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#3f51b5',
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    padding: '10px 0',
    borderRadius: '12px',
    background: 'linear-gradient(90deg, #3f51b5 0%, #6573c3 100%)',
    color: '#fff',
    boxShadow: '0 6px 16px rgba(63,81,181,0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(90deg, #6573c3 0%, #3f51b5 100%)',
      boxShadow: '0 8px 20px rgba(63,81,181,0.4)',
      transform: 'translateY(-2px)',
    },
  },
  googleButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    width: '100%',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
      transform: 'translateY(-1px)',
    },
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: '#fafafa',
      transition: 'all 0.25s ease',
      '&:hover fieldset': {
        borderColor: '#3f51b5',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6573c3',
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#555',
      fontWeight: 500,
    },
  },
}));