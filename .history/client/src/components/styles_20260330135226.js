import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  ul: {
    justifyContent: 'center',
    margin: '16px 0', // cách đều trên/dưới
    '& .MuiPaginationItem-root': {
      borderRadius: '12px',
      margin: '0 6px',
      minWidth: '42px',
      height: '42px',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      color: '#3f51b5',
      background: 'linear-gradient(145deg, #f0f0f0 0%, #fafafa 100%)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
      '&:hover': {
        background: 'linear-gradient(145deg, #c5cae9 0%, #7986cb 100%)',
        color: '#fff',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 14px rgba(0,0,0,0.12)',
      },
    },
    '& .Mui-selected': {
      background: 'linear-gradient(90deg, #3f51b5 0%, #6573c3 100%)',
      color: '#fff',
      boxShadow: '0 6px 16px rgba(63,81,181,0.3)',
      '&:hover': {
        background: 'linear-gradient(90deg, #6573c3 0%, #3f51b5 100%)',
      },
    },
  },
}));