import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 20,
    margin: '20px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 60px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: '10px 20px',
    },
  },
  heading: {
    color: '#3f51b5',
    textDecoration: 'none',
    fontSize: '2.2rem',
    fontWeight: 500,
    fontFamily: 'Roboto, sans-serif',
  },
  image: {
    marginLeft: '15px',
    marginTop: '5px',
    borderRadius: '5px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '420px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: '10px',
      justifyContent: 'center',
    },
  },
  profile: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '420px',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: 15,
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
  },
  logout: {
    marginLeft: '20px',
    fontWeight: 500,
    textTransform: 'capitalize',
    transition: '0.3s',
    '&:hover': {
      backgroundColor: '#f50057',
      color: '#fff',
    },
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    color: '#555',
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
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
    width: '45px',
    height: '45px',
    fontSize: '1.2rem',
  },
}));