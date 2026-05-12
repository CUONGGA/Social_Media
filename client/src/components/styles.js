import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  ul: {
    justifyContent: 'center',
    margin: '20px 0',
    /* Trạng thái mặc định — mọi ô (trừ ellipsis là div) */
    '& .MuiPaginationItem-root': {
      borderRadius: '50%',
      margin: '0 5px',
      minWidth: '36px',
      height: '36px',
      padding: theme.spacing(0.75),
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#3f51b5',
      background: 'linear-gradient(145deg, #f5f5f5 0%, #e8e8e8 100%)',
      backgroundColor: 'transparent',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      transition:
        'transform 0.2s ease, background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
    },
    /*
     * PaginationItem = ButtonBase: không có .MuiButtonBase-label. Trạng thái chọn / disabled
     * dùng class MUI Lab: .MuiPaginationItem-selected / .MuiPaginationItem-disabled (không phải .Mui-selected).
     */
    '& .MuiPaginationItem-root.MuiPaginationItem-page:not(.MuiPaginationItem-disabled):not(.MuiPaginationItem-selected):not([aria-current="true"]):hover':
      {
        background: 'linear-gradient(145deg, #7986cb 0%, #9fa8da 100%)',
        backgroundColor: 'transparent !important',
        color: '#fff',
        boxShadow: '0 8px 18px rgba(57, 73, 171, 0.35)',
        transform: 'translateY(-2px)',
      },
    '& .MuiPaginationItem-root.MuiPaginationItem-page.MuiPaginationItem-selected:not(.MuiPaginationItem-disabled):hover, & .MuiPaginationItem-root.MuiPaginationItem-page[aria-current="true"]:not(.MuiPaginationItem-disabled):hover':
      {
        background: 'linear-gradient(90deg, #6573c3 0%, #3f51b5 100%)',
        backgroundColor: 'transparent !important',
        color: '#fff !important',
        boxShadow: '0 8px 20px rgba(63, 81, 181, 0.45)',
        transform: 'translateY(-2px)',
      },
    /* Trang đang chọn: aria-current + class selected (ghi đè outlinedPrimary của MUI) */
    '& .MuiPaginationItem-root.MuiPaginationItem-selected, & .MuiPaginationItem-root[aria-current="true"]': {
      background: 'linear-gradient(90deg, #3f51b5 0%, #6573c3 100%) !important',
      backgroundColor: 'transparent !important',
      color: '#fff !important',
      borderColor: 'rgba(57, 73, 171, 0.35) !important',
      boxShadow: '0 6px 16px rgba(63,81,181,0.3)',
    },
  },
}));
