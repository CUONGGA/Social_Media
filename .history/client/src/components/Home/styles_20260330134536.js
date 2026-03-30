import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  appBarSearch: {
    borderRadius: 12,
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    backgroundColor: '#fafafa', // nền sáng, sang trọng
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)', // shadow nhẹ
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    },
  },
  searchTextField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: '#fff',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3f51b5',
    },
    '& .MuiInputLabel-root': {
      color: '#555',
      fontWeight: 500,
    },
    marginBottom: '12px',
  },
  chipInput: {
    margin: '10px 0',
    '& .MuiChip-root': {
      backgroundColor: '#e0e0e0',
      fontWeight: 500,
    },
  },
  searchButton: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    padding: '8px 22px',
    borderRadius: '12px',
    background: 'linear-gradient(90deg, #3f51b5 0%, #6573c3 100%)',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(63,81,181,0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      background: 'linear-gradient(90deg, #6573c3 0%, #3f51b5 100%)',
      boxShadow: '0 6px 16px rgba(63,81,181,0.4)',
      transform: 'translateY(-2px)',
    },
  },
  pagination: {
    borderRadius: 12,
    marginTop: '1rem',
    padding: '16px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
    backgroundColor: '#fff',
  },
  gridContainer: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    },
  },
}));