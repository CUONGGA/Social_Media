import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '20px 0',
    padding: '10px 50px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', // shadow nhẹ sang
    transition: 'all 0.3s ease',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: '10px 20px',
    },
  },
  heading: {
    color: '#333',          // chữ tối giản
    textDecoration: 'none',
    fontSize: '1.9rem',
    fontWeight: 500,
    fontFamily: 'Roboto, sans-serif',
  },
  image: {
    marginLeft: '10px',
    marginTop: '5px',
    height: '55px',
    borderRadius: '5px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '400px',
    gap: '12px',   // khoảng cách đều giữa các item
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
      marginTop: '10px',
      flexWrap: 'wrap',
    },
  },
  profile: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '400px',
    alignItems: 'center',
    gap: '10px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
      marginTop: 15,
      flexWrap: 'wrap',
    },
  },
  logout: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.95rem',
    padding: '6px 18px',
    borderRadius: '8px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#e0e0e0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
  },
  userName: {
    fontWeight: 500,
    color: '#333',
    fontSize: '0.95rem',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  purple: {
    color: '#fff',
    backgroundColor: deepPurple[500],
    width: '42px',
    height: '42px',
    fontSize: '1rem',
  },
  signInButton: {
    textTransform: 'none',                
    fontWeight: 600,                      
    fontSize: '1rem',                     
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
}));