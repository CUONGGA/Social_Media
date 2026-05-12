import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  searchPaper: {
    padding: theme.spacing(2.5),
    borderRadius: 15,
    backgroundColor: '#fafafa',
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
    display: 'flex',
    justifyContent: 'center',
  },
  searchInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  searchFieldsRoot: {
    width: '100%',
    '& .MuiTextField-root': {
      marginTop: theme.spacing(0.75),
      marginBottom: theme.spacing(0.75),
      marginLeft: 0,
      marginRight: 0,
      width: '100%',
      '& .MuiOutlinedInput-root': {
        borderRadius: 10,
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
  searchTitle: {
    fontWeight: 600,
    fontSize: '1.125rem',
    marginBottom: theme.spacing(1),
    color: '#222',
    width: '100%',
    textAlign: 'center',
  },
  /* ChipInput (material-ui-chip-input) dùng style cũ không khớp MUI v4 → ghi đè để giống TextField outlined */
  chipInput: {
    width: '100%',
    marginTop: theme.spacing(0.75),
    marginBottom: theme.spacing(0.75),
    '& .MuiOutlinedInput-root': {
      borderRadius: 10,
      backgroundColor: '#fff',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3f51b5',
    },
    '& .MuiOutlinedInput-input': {
      float: 'none !important',
      margin: '0 !important',
      height: 'auto !important',
      padding: '18.5px 14px !important',
      lineHeight: '1.1876em !important',
      boxSizing: 'border-box !important',
      flex: '1 1 72px',
      minWidth: '3rem',
    },
    '& .MuiOutlinedInput-root input.MuiOutlinedInput-input': {
      float: 'none !important',
      margin: '0 !important',
      height: 'auto !important',
      padding: '18.5px 14px !important',
      lineHeight: '1.1876em !important',
    },
    '& .MuiInputAdornment-root': {
      alignSelf: 'center',
    },
    '& .MuiInputLabel-root': {
      color: '#555',
      fontWeight: 500,
    },
    /* ChipInput thêm top trên label → lệch so với TextField outlined chuẩn MUI */
    '& .MuiInputLabel-outlined:not([data-shrink="true"])': {
      top: 0,
      transform: 'translate(14px, 20px) scale(1) !important',
    },
    '& .MuiInputLabel-outlined[data-shrink="true"]': {
      transform: 'translate(14px, -6px) scale(0.75) !important',
    },
    '& .MuiChip-root': {
      backgroundColor: '#e0e0e0',
      fontWeight: 500,
      margin: theme.spacing(0.5, 1, 0.5, 0),
    },
  },
  searchButton: {
    boxSizing: 'border-box',
    width: '100%',
    marginTop: theme.spacing(1.5),
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.8125rem',
    letterSpacing: '0.01em',
    minHeight: 34,
    padding: theme.spacing(0.5, 2.25),
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(180deg, #5c6bc0 0%, #3f51b5 100%)',
    color: '#fff',
    boxShadow: '0 2px 6px rgba(63, 81, 181, 0.28)',
    transition: 'background 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      background: 'linear-gradient(180deg, #4a5aa8 0%, #2e3d8f 100%)',
      boxShadow: '0 2px 6px rgba(41, 53, 130, 0.45)',
    },
    '&.MuiButton-contained': {
      boxShadow: '0 2px 6px rgba(63, 81, 181, 0.28)',
    },
    '&.MuiButton-contained:hover': {
      boxShadow: '0 2px 6px rgba(41, 53, 130, 0.45)',
    },
    '&.MuiButton-containedPrimary': {
      background: 'linear-gradient(180deg, #5c6bc0 0%, #3f51b5 100%)',
      color: '#fff',
      boxShadow: '0 2px 6px rgba(63, 81, 181, 0.28)',
      '&:hover': {
        background: 'linear-gradient(180deg, #4a5aa8 0%, #2e3d8f 100%)',
        boxShadow: '0 2px 6px rgba(41, 53, 130, 0.45)',
      },
    },
  },
  pagination: {
    borderRadius: 12,
    marginTop: '1rem',
    padding: '16px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
    backgroundColor: '#fff',
  },
  gridContainer: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    },
  },
}));
