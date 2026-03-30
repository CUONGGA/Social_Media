import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '20px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 50px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: '10px 20px',
    },
  },
  heading: {
    color: '#333',
    textDecoration: 'none',
    fontSize: '1.8rem',
    fontWeight: 500,
    fontFamily: 'Roboto, sans-serif',
  },
  image: {
    marginLeft: '10px',
    marginTop: '5px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '380px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: '10px',
      justifyContent: 'center',
    },
  },
  profile: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '380px',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: 15,
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
  },
  logout: {
    marginLeft: '15px',
    fontWeight: 500,
    textTransform: 'none',
    padding: '6px 18px',
    borderRadius: '8px',
    transition: '0.3s',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    color: '#555',
    fontWeight: 500,
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover img': {
      transform: 'scale(1.05)',
    },
  },
  purple: {
    color: '#fff',
    backgroundColor: deepPurple[500],
    width: '42px',
    height: '42px',
    fontSize: '1.1rem',
  },
}));