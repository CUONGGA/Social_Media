import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: '56.25%',
    /* Tránh lớp tối + blend làm ảnh trông mờ — chỉ nền nhẹ khi chưa load */
    backgroundColor:
      theme.palette.type === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    transition: 'transform 0.5s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: '20px',
    height: '100%',
    position: 'relative',
    boxShadow:
      theme.palette.type === 'dark'
        ? '0 10px 25px rgba(0,0,0,0.45)'
        : '0 10px 25px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow:
        theme.palette.type === 'dark'
          ? '0 12px 30px rgba(0,0,0,0.55)'
          : '0 12px 30px rgba(0,0,0,0.12)',
      transform: 'translateY(-4px)',
    },
  },
  overlay: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: '#fff',
    textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)',
  },
  overlay2: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    color: '#fff',
  },
  details: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    margin: '20px',
    gap: '6px',
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
  title: {
    padding: '0 16px',
    fontWeight: 600,
    fontSize: '1.3rem',
    color: theme.palette.text.primary,
  },
  cardContent: {
    padding: '0 16px 16px 16px',
    color: theme.palette.text.secondary,
    fontSize: '0.95rem',
  },
  cardActions: {
    padding: '0 16px 12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardAction: {
    display: 'block',
    textAlign: 'initial',
  },
  buttonLike: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.85rem',
    padding: '6px 12px',
    borderRadius: '12px',
    background: 'linear-gradient(90deg, #3f51b5 0%, #6573c3 100%)',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(63,81,181,0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(90deg, #6573c3 0%, #3f51b5 100%)',
      boxShadow: '0 6px 16px rgba(63,81,181,0.4)',
      transform: 'translateY(-2px)',
    },
  },
  buttonDelete: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.85rem',
    padding: '6px 12px',
    borderRadius: '12px',
    background: 'linear-gradient(90deg, #f50057 0%, #ff4081 100%)',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(245,0,87,0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(245,0,87,0.4)',
      transform: 'translateY(-2px)',
    },
  },
}));