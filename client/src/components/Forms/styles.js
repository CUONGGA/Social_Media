import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
  const isDark = theme.palette.type === 'dark';

  return {
    root: {
      width: '100%',
      '& .MuiTextField-root': {
        marginTop: theme.spacing(0.75),
        marginBottom: theme.spacing(0.75),
        marginLeft: 0,
        marginRight: 0,
        width: '100%',
        '& .MuiOutlinedInput-root': {
          borderRadius: 10,
          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
        },
        '& .MuiOutlinedInput-input': {
          color: theme.palette.text.primary,
        },
        '& .MuiInputLabel-root': {
          color: theme.palette.text.secondary,
          fontWeight: 500,
        },
      },
    },
    paper: {
      padding: theme.spacing(2.5),
      marginTop: theme.spacing(2.5),
      borderRadius: 15,
      backgroundColor: theme.palette.background.paper,
      boxShadow: isDark ? '0 6px 20px rgba(0,0,0,0.45)' : '0 6px 20px rgba(0,0,0,0.06)',
      transition: 'all 0.3s ease',
      display: 'flex',
      justifyContent: 'center',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: 400,
      margin: '0 auto',
      boxSizing: 'border-box',
    },
    fileInput: {
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(0.5),
      borderRadius: 10,
      padding: theme.spacing(1, 1.25),
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
      border: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(1.25),
      minHeight: 44,
      flexWrap: 'nowrap',
    },
    fileInputHidden: {
      position: 'absolute',
      width: 0,
      height: 0,
      opacity: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    },
    chooseFileButton: {
      flexShrink: 0,
      boxSizing: 'border-box',
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.8125rem',
      minHeight: 36,
      padding: '8px 16px',
      borderRadius: 10,
      lineHeight: 1.2,
      border: isDark ? '1px solid rgba(165, 180, 252, 0.35)' : '1px solid #d5d5d5',
      color: isDark ? theme.palette.text.primary : '#424242',
      backgroundColor: isDark ? 'rgba(129, 140, 248, 0.12)' : '#eceff1',
      boxShadow: 'none',
      transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
      '&:hover': {
        backgroundColor: isDark ? 'rgba(129, 140, 248, 0.2)' : '#cfd8dc',
        borderColor: isDark ? 'rgba(165, 180, 252, 0.55)' : '#90a4ae',
        color: isDark ? '#e0e7ff' : '#263238',
        boxShadow: 'none',
      },
      '&.MuiButton-outlined': {
        padding: '8px 16px',
        border: isDark ? '1px solid rgba(165, 180, 252, 0.35)' : '1px solid #d5d5d5',
        backgroundColor: isDark ? 'rgba(129, 140, 248, 0.12)' : '#eceff1',
        '&:hover': {
          border: isDark ? '1px solid rgba(165, 180, 252, 0.55)' : '1px solid #90a4ae',
          backgroundColor: isDark ? 'rgba(129, 140, 248, 0.2)' : '#cfd8dc',
        },
      },
    },
    fileHint: {
      flex: 1,
      minWidth: 0,
      fontSize: '0.8125rem',
      color: theme.palette.text.secondary,
      lineHeight: 1.3,
    },
    actionsRow: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: theme.spacing(1.5),
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginTop: theme.spacing(1.5),
    },
    buttonSubmit: {
      boxSizing: 'border-box',
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.8125rem',
      letterSpacing: '0.01em',
      minHeight: 34,
      padding: theme.spacing(0.5, 2.25),
      borderRadius: 8,
      flex: '1 1 0',
      minWidth: 0,
      width: '100%',
      maxWidth: 'calc(50% - 6px)',
      border: 'none',
      background: isDark
        ? 'linear-gradient(180deg, #7c83f7 0%, #6366f1 100%)'
        : 'linear-gradient(180deg, #5c6bc0 0%, #3f51b5 100%)',
      color: '#fff',
      boxShadow: isDark
        ? '0 2px 6px rgba(99, 102, 241, 0.35)'
        : '0 2px 6px rgba(63, 81, 181, 0.28)',
      transition: 'background 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        background: isDark
          ? 'linear-gradient(180deg, #a5b4fc 0%, #818cf8 100%)'
          : 'linear-gradient(180deg, #4a5aa8 0%, #2e3d8f 100%)',
        boxShadow: isDark
          ? '0 2px 8px rgba(129, 140, 248, 0.4)'
          : '0 2px 6px rgba(41, 53, 130, 0.45)',
      },
      '&.MuiButton-contained': {
        boxShadow: isDark
          ? '0 2px 6px rgba(99, 102, 241, 0.35)'
          : '0 2px 6px rgba(63, 81, 181, 0.28)',
      },
      '&.MuiButton-contained:hover': {
        boxShadow: isDark
          ? '0 2px 8px rgba(129, 140, 248, 0.4)'
          : '0 2px 6px rgba(41, 53, 130, 0.45)',
      },
      '&.MuiButton-containedPrimary': {
        background: isDark
          ? 'linear-gradient(180deg, #7c83f7 0%, #6366f1 100%)'
          : 'linear-gradient(180deg, #5c6bc0 0%, #3f51b5 100%)',
        color: '#fff',
        boxShadow: isDark
          ? '0 2px 6px rgba(99, 102, 241, 0.35)'
          : '0 2px 6px rgba(63, 81, 181, 0.28)',
        '&:hover': {
          background: isDark
            ? 'linear-gradient(180deg, #a5b4fc 0%, #818cf8 100%)'
            : 'linear-gradient(180deg, #4a5aa8 0%, #2e3d8f 100%)',
          boxShadow: isDark
            ? '0 2px 8px rgba(129, 140, 248, 0.4)'
            : '0 2px 6px rgba(41, 53, 130, 0.45)',
        },
      },
    },
    clearButton: {
      boxSizing: 'border-box',
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.8125rem',
      letterSpacing: '0.01em',
      minHeight: 34,
      padding: theme.spacing(0.5, 2.25),
      borderRadius: 8,
      flex: '1 1 0',
      minWidth: 0,
      width: '100%',
      maxWidth: 'calc(50% - 6px)',
      border: '1px solid',
      borderColor: theme.palette.divider,
      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
      color: theme.palette.text.primary,
      boxShadow: 'none',
      transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
      '&:hover': {
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.primary.light,
        boxShadow: 'none',
      },
      '&.MuiButton-outlined': {
        border: '1px solid',
        borderColor: theme.palette.divider,
        padding: theme.spacing(0.5, 2.25),
        '&:hover': {
          border: '1px solid',
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.action.hover,
        },
      },
    },
    titleTypography: {
      fontWeight: 600,
      fontSize: '1.125rem',
      marginBottom: theme.spacing(1),
      color: theme.palette.text.primary,
      width: '100%',
      textAlign: 'center',
    },
  };
});
