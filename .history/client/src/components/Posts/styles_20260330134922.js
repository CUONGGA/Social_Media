import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  container: {
    padding: '20px 10px',
    [theme.breakpoints.down('sm')]: {
      padding: '10px 0',
    },
  },
  noPosts: {
    width: '100%',
    textAlign: 'center',
    marginTop: '40px',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#888',
    fontFamily: 'Inter, sans-serif',
  },
  circularProgress: {
    display: 'block',
    margin: '50px auto',
    color: '#3f51b5',
  },
  gridItem: {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
    },
  },
}));