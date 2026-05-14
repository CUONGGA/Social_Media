import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 12,
    margin: theme.spacing(1.25, 0),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 2.5),
    boxShadow:
      theme.palette.type === 'dark'
        ? '0 1px 4px rgba(0,0,0,0.35)'
        : '0 1px 3px rgba(0,0,0,0.08)',
    transition: 'none',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: theme.spacing(1.5, 2),
    },
  },
  heading: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontSize: '2em',
    fontWeight: 300,
  },
  image: {
    marginLeft: '10px',
    marginTop: '5px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    paddingRight: 0,
    gap: theme.spacing(2.5),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing(1.5),
    },
  },
  /* Trigger Avatar — kiểu Gmail/GitHub: chỉ 1 vòng tròn avatar, click mở menu.
     IconButton bọc ngoài cho click target rộng + a11y, padding 2px tạo
     "khoảng thở" giữa avatar và hover ring. */
  avatarTrigger: {
    padding: 2,
    flexShrink: 0,
    backgroundColor: 'transparent',
    border: 'none',
    /* Hover/active state dùng `box-shadow` để vẽ ring quanh avatar — đẹp hơn
       background tròn vì avatar đã tròn rồi, ring tách rõ. Transition mượt. */
    boxShadow: '0 0 0 0 transparent',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    '&:hover': {
      backgroundColor: 'transparent',
      boxShadow:
        theme.palette.type === 'dark'
          ? '0 0 0 3px rgba(129, 140, 248, 0.35)'
          : '0 0 0 3px rgba(57, 73, 171, 0.25)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow:
        theme.palette.type === 'dark'
          ? `0 0 0 3px ${theme.palette.primary.main}`
          : `0 0 0 3px ${theme.palette.primary.main}`,
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
    },
  },
  /* Khi menu mở: KHÔNG đậm thêm cấp — chỉ giữ ring tương đương hover (cùng
     độ dày 3px nhưng opacity nhẹ hơn để không "shout"). Trigger phải khiêm
     tốn vì menu bên dưới đã chiếm sự chú ý chính. Trước đây ring đậm 45% +
     extra dropshadow → cứng, jump 1 cấp visual khi click. */
  avatarTriggerActive: {
    boxShadow:
      theme.palette.type === 'dark'
        ? '0 0 0 3px rgba(129, 140, 248, 0.28) !important'
        : '0 0 0 3px rgba(57, 73, 171, 0.18) !important',
  },
  /* Avatar bên trong: 36×36 (đủ thoáng trong IconButton 40×40 padding 2). */
  avatarTriggerImg: {
    width: 36,
    height: 36,
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  /* Dropdown paper: rộng đủ ôm header + 2 hành động; bo góc lớn + đổ bóng sâu.
     Dùng "card" style hiện đại — viền nhẹ + shadow soft thay vì viền cứng. */
  menuPaper: {
    minWidth: 280,
    marginTop: theme.spacing(0.75),
    borderRadius: 14,
    border:
      theme.palette.type === 'dark'
        ? '1px solid rgba(129, 140, 248, 0.18)'
        : '1px solid rgba(0, 0, 0, 0.04)',
    boxShadow:
      theme.palette.type === 'dark'
        ? '0 12px 32px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.3)'
        : '0 12px 32px rgba(17, 24, 39, 0.12), 0 2px 8px rgba(17, 24, 39, 0.05)',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  /* MUI v4 mặc định cho list padding-top/bottom 8 — bỏ để header sát mép, đẹp hơn. */
  menuList: {
    padding: 0,
  },

  /* Header card: identity user. Nền có tint nhẹ để tách khỏi item phía dưới. */
  menuHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2, 2),
    background:
      theme.palette.type === 'dark'
        ? 'linear-gradient(135deg, rgba(129, 140, 248, 0.12) 0%, rgba(99, 102, 241, 0.04) 100%)'
        : 'linear-gradient(135deg, rgba(57, 73, 171, 0.06) 0%, rgba(99, 102, 241, 0.02) 100%)',
    /* Header không bấm được nên không có hover state. */
    cursor: 'default',
  },
  menuHeaderAvatar: {
    width: 44,
    height: 44,
    fontSize: '1.1rem',
    fontWeight: 600,
    flexShrink: 0,
    boxShadow:
      theme.palette.type === 'dark'
        ? '0 4px 12px rgba(99, 102, 241, 0.4)'
        : '0 4px 12px rgba(57, 73, 171, 0.25)',
  },
  menuHeaderText: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    flex: 1,
  },
  menuHeaderName: {
    fontSize: '0.9375rem',
    fontWeight: 700,
    lineHeight: 1.3,
    color: theme.palette.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  menuHeaderEmail: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    lineHeight: 1.3,
    marginTop: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  /* Mỗi mục hành động: icon trong khung tròn bo + 2 dòng text. Hover khá rõ
     để click cảm thấy "feedback". */
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.25, 2),
    transition: 'background-color 0.15s ease',
    '&:hover': {
      backgroundColor:
        theme.palette.type === 'dark'
          ? 'rgba(129, 140, 248, 0.10)'
          : 'rgba(57, 73, 171, 0.06)',
    },
  },
  /* Khung tròn 36px chứa icon — tạo "weight" cho item, nhìn cân bằng với avatar header. */
  menuItemIconBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 10,
    flexShrink: 0,
    backgroundColor:
      theme.palette.type === 'dark'
        ? 'rgba(129, 140, 248, 0.16)'
        : 'rgba(57, 73, 171, 0.10)',
    color: theme.palette.primary.main,
    transition: 'background-color 0.15s ease, color 0.15s ease',
  },
  menuItemIconBoxDanger: {
    backgroundColor:
      theme.palette.type === 'dark'
        ? 'rgba(248, 113, 113, 0.15)'
        : 'rgba(239, 68, 68, 0.10)',
    color: theme.palette.type === 'dark' ? '#fca5a5' : '#dc2626',
  },
  menuItemText: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    flex: 1,
  },
  menuItemPrimary: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.25,
    color: theme.palette.text.primary,
  },
  menuItemSecondary: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    lineHeight: 1.3,
    marginTop: 2,
  },
  /* Item logout: text cũng đỏ nhẹ ở hover để báo "đây là hành động phá huỷ". */
  menuItemDanger: {
    '&:hover': {
      backgroundColor:
        theme.palette.type === 'dark'
          ? 'rgba(248, 113, 113, 0.10)'
          : 'rgba(239, 68, 68, 0.06)',
      '& $menuItemPrimary': {
        color: theme.palette.type === 'dark' ? '#fca5a5' : '#dc2626',
      },
    },
  },
  menuDivider: {
    margin: 0,
    backgroundColor:
      theme.palette.type === 'dark'
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(0, 0, 0, 0.06)',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      textDecoration: 'none',
      opacity: 1,
    },
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  themeToggle: {
    padding: 8,
    width: 38,
    height: 38,
    minWidth: 38,
    boxSizing: 'border-box',
    borderRadius: 10,
    border:
      theme.palette.type === 'dark'
        ? '1px solid rgba(129, 140, 248, 0.35)'
        : '1px solid rgba(57, 73, 171, 0.22)',
    background:
      theme.palette.type === 'dark'
        ? 'linear-gradient(145deg, rgba(99,102,241,0.22) 0%, rgba(30,27,75,0.55) 100%)'
        : 'linear-gradient(145deg, #f5f7ff 0%, #e8eaf6 100%)',
    color: theme.palette.type === 'dark' ? '#e0e7ff' : '#3949ab',
    boxShadow:
      theme.palette.type === 'dark'
        ? '0 2px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)'
        : '0 2px 8px rgba(57, 73, 171, 0.15)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    '&:hover': {
      background:
        theme.palette.type === 'dark'
          ? 'linear-gradient(145deg, rgba(129,140,248,0.32) 0%, rgba(49,46,129,0.65) 100%)'
          : 'linear-gradient(145deg, #fff 0%, #e8eaf6 100%)',
      boxShadow:
        theme.palette.type === 'dark'
          ? '0 4px 18px rgba(99,102,241,0.25)'
          : '0 4px 14px rgba(57, 73, 171, 0.22)',
      transform: 'scale(1.06)',
    },
    '& svg': {
      fontSize: 18,
      filter:
        theme.palette.type === 'dark'
          ? 'drop-shadow(0 0 6px rgba(165, 180, 252, 0.45))'
          : 'drop-shadow(0 1px 2px rgba(57, 73, 171, 0.25))',
    },
  },
  signInButton: {
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.8125rem',
    letterSpacing: '0.04em',
    padding: '9px 16px',
    minHeight: 38,
    minWidth: 116,
    borderRadius: 10,
    lineHeight: 1.2,
    color: '#fff !important',
    border: 'none',
    background:
      theme.palette.type === 'dark'
        ? 'linear-gradient(145deg, #818cf8 0%, #6366f1 40%, #4f46e5 100%)'
        : 'linear-gradient(145deg, #6a77c9 0%, #3f51b5 42%, #283593 100%)',
    boxShadow:
      theme.palette.type === 'dark'
        ? '0 4px 18px rgba(99, 102, 241, 0.38)'
        : '0 4px 16px rgba(57, 73, 171, 0.28)',
    transition: 'box-shadow 0.25s ease, filter 0.2s ease',
    '&:hover': {
      color: '#fff !important',
      background:
        theme.palette.type === 'dark'
          ? 'linear-gradient(145deg, #a5b4fc 0%, #7c83f7 45%, #6366f1 100%)'
          : 'linear-gradient(145deg, #7b87ce 0%, #4f5cb8 40%, #1a237e 100%)',
      boxShadow:
        theme.palette.type === 'dark'
          ? '0 8px 26px rgba(129, 140, 248, 0.42)'
          : '0 8px 24px rgba(57, 73, 171, 0.36)',
    },
    '&.MuiButton-containedPrimary': {
      background:
        theme.palette.type === 'dark'
          ? 'linear-gradient(145deg, #818cf8 0%, #6366f1 40%, #4f46e5 100%)'
          : 'linear-gradient(145deg, #6a77c9 0%, #3f51b5 42%, #283593 100%)',
      boxShadow:
        theme.palette.type === 'dark'
          ? '0 4px 18px rgba(99, 102, 241, 0.38)'
          : '0 4px 16px rgba(57, 73, 171, 0.28)',
      '&:hover': {
        background:
          theme.palette.type === 'dark'
            ? 'linear-gradient(145deg, #a5b4fc 0%, #7c83f7 45%, #6366f1 100%)'
            : 'linear-gradient(145deg, #7b87ce 0%, #4f5cb8 40%, #1a237e 100%)',
        boxShadow:
          theme.palette.type === 'dark'
            ? '0 8px 26px rgba(129, 140, 248, 0.42)'
            : '0 8px 24px rgba(57, 73, 171, 0.36)',
      },
    },
  },
}));