import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
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
    },
  },
  paper: {
    padding: '24px',
    marginTop: '20px',
    borderRadius: '15px',
    backgroundColor: '#fafafa',
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '14px',
  },
  fileInput: {
    width: '100%',
    margin: '10px 0',
    borderRadius: '10px',
    padding: '8px',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
  },
  buttonSubmit: {
    marginTop: '10px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    padding: '10px 0',
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
  clearButton: {
    marginTop: '10px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    padding: '8px 0',
    borderRadius: '12px',
    background: 'linear-gradient(90deg, #f50057 0%, #ff4081 100%)',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(245,0,87,0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(245,0,87,0.4)',
      transform: 'translateY(-2px)',
    },
  },
  titleTypography: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1.2rem',
    marginBottom: '10px',
    color: '#222',
  },
}));