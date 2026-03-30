import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
    appBar: {
        borderRadius: 15,
        margin: '20px 0',
        padding: '10px 20px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        color: '#fff',
    },
    heading: {
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '1px',
        color: '#fff',
        textTransform: 'uppercase',
    },
    image: {
        marginLeft: '15px',
        width: '50px',
        height: '50px',
    },
    mainContainer: {
        padding: '20px 0',
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column-reverse',
        }
    },
    paper: {
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        transition: '0.3s ease',
        '&:hover': {
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        }
    },
}));