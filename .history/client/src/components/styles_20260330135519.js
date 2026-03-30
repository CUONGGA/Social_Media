import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  ul: {
    justifyContent: 'center',
    margin: '20px 0',
    '& .MuiPaginationItem-root': {
      borderRadius: '50%', // bo tròn hoàn toàn
      margin: '0 8px',     // tăng khoảng cách 2 bên
      minWidth: '44px',    // to hơn một chút
      height: '44px',
      fontWeight: 600,
      color: '#3f51b5',
      background: 'linear-gradient(145deg, #f5f5f5 0%, #e8e8e8 100%)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      transition: 'all 0.25s ease',
      '&:hover': {
        background: 'linear-gradient(145deg, #7986cb 0%, #9fa8da 100%)',
        color: '#fff',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
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