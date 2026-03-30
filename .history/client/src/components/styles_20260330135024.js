import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  ul: {
    justifyContent: 'center',
    marginTop: '20px',
    '& .MuiPaginationItem-root': {
      borderRadius: '12px',
      margin: '0 4px',
      minWidth: '40px',
      height: '40px',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      color: '#3f51b5',
      background: 'linear-gradient(90deg, #e0e0e0 0%, #f5f5f5 100%)',
      boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
      '&:hover': {
        background: 'linear-gradient(90deg, #c5cae9 0%, #7986cb 100%)',
        color: '#fff',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
      },
    },
    '& .Mui-selected': {
      background: 'linear-gradient(90deg, #3f51b5 0%, #6573c3 100%)',
      color: '#fff',
      boxShadow: '0 6px 12px rgba(63,81,181,0.3)',
      '&:hover': {
        background: 'linear-gradient(90deg, #6573c3 0%, #3f51b5 100%)',
      },
    },
  },
}));