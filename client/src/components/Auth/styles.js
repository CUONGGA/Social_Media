// styles.js
import { makeStyles } from '@material-ui/core/styles';

/* Auth styles — đồng bộ với theme sáng/tối.
   Trước đây hardcode `#fff`, `#555`, `#f9fafc` → trong dark mode paper vẫn trắng
   trong khi mọi text quanh dùng `palette.text.primary` (sáng) → "Sign In"
   không nhìn thấy. Sửa: mọi màu nền + chữ chuyển sang `theme.palette.*`. */
export default makeStyles((theme) => {
  const isDark = theme.palette.type === 'dark';
  return {
    // Paper / Card chính
    paper: {
      marginTop: theme.spacing(6),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(5),
      borderRadius: '20px',
      backgroundColor: theme.palette.background.paper,
      boxShadow: isDark
        ? '0 12px 32px rgba(0,0,0,0.55)'
        : '0 12px 32px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: isDark
          ? '0 16px 48px rgba(0,0,0,0.65)'
          : '0 16px 48px rgba(0,0,0,0.25)',
      },
    },

    // Avatar icon — dùng primary palette để gradient hợp 2 mode
    avatar: {
      margin: theme.spacing(1),
      background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 100%)`,
      color: '#fff',
      width: theme.spacing(8),
      height: theme.spacing(8),
      boxShadow: isDark
        ? '0 4px 12px rgba(0,0,0,0.4)'
        : '0 4px 12px rgba(0,0,0,0.1)',
    },

    // Form container
    form: {
      width: '100%',
      marginTop: theme.spacing(3),
    },

    // Input fields (class này hiện chưa được áp dụng từ Auth.js,
    // giữ lại + chuẩn hoá để nếu sau này pass `className={classes.input}`
    // vào Input wrapper sẽ ăn theme đúng.)
    input: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: isDark
          ? 'rgba(255,255,255,0.04)'
          : '#f9fafc',
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.primary.main,
          borderWidth: '2px',
        },
      },
      '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,
        fontWeight: 500,
      },
    },

    // Sign In / Sign Up button — gradient primary, hợp cả 2 mode
    submit: {
      margin: theme.spacing(3, 0, 2),
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      padding: '8px 0',
      borderRadius: '14px',
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
      color: '#fff',
      boxShadow: isDark
        ? '0 8px 20px rgba(99,102,241,0.45)'
        : '0 8px 20px rgba(79,70,229,0.3)',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        boxShadow: isDark
          ? '0 12px 28px rgba(99,102,241,0.55)'
          : '0 12px 28px rgba(79,70,229,0.4)',
        transform: 'translateY(-2px)',
      },
    },

    heading: {
      fontWeight: 700,
      fontSize: '1.8rem',
      color: theme.palette.primary.main,
      textAlign: 'center',
      marginBottom: theme.spacing(2),
    },

    // Small switch mode text
    switchMode: {
      textTransform: 'none',
      marginTop: '10px',
      fontWeight: 500,
      fontSize: '0.9rem',
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: 'transparent',
      },
    },
  };
});