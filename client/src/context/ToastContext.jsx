import React, { useState, useCallback, useEffect } from 'react';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { registerToastNotifier } from '../utils/toastBus';

const DEFAULT_TITLES = {
  success: 'Success',
  error: 'Error',
  info: 'Notice',
  warning: 'Warning',
};

function normalizeToastPayload(severity, payload) {
  const sev = ['success', 'error', 'warning', 'info'].includes(severity) ? severity : 'info';
  const defaultTitle = DEFAULT_TITLES[sev];

  if (payload == null) {
    return { title: defaultTitle, body: ' ' };
  }
  if (typeof payload === 'string') {
    const body = String(payload).trim();
    return { title: defaultTitle, body: body || ' ' };
  }
  if (typeof payload === 'object' && !Array.isArray(payload)) {
    const title =
      payload.title != null && String(payload.title).trim() !== ''
        ? String(payload.title)
        : defaultTitle;
    const rawBody = payload.body ?? payload.message ?? '';
    const body = String(rawBody).trim() || ' ';
    return { title, body };
  }
  const body = String(payload).trim();
  return { title: defaultTitle, body: body || ' ' };
}

const useToastStyles = makeStyles((theme) => ({
  snackbar: {
    /* Sát mép phải-dưới. Giữ khoảng đệm tối thiểu để toast không "đè"
       lên mép viewport. */
    marginBottom: theme.spacing(0.75),
    marginRight: 0,
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(0.5),
      marginRight: 0,
      paddingLeft: theme.spacing(1),
    },
    '& .MuiSnackbarContent-root': {
      padding: 0,
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
  },
  alert: {
    width: '100%',
    maxWidth: 472,
    minWidth: 300,
    borderRadius: 12,
    padding: theme.spacing(1, 1.5, 1, 1.25),
    alignItems: 'flex-start',
    border:
      theme.palette.type === 'dark'
        ? '1px solid rgba(148, 163, 184, 0.25)'
        : '1px solid rgba(226, 232, 240, 0.95)',
    boxShadow:
      theme.palette.type === 'dark'
        ? '0 10px 40px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.25)'
        : '0 10px 40px rgba(15, 23, 42, 0.08), 0 2px 12px rgba(15, 23, 42, 0.06)',
    backgroundColor: theme.palette.type === 'dark' ? '#1e293b' : '#ffffff',
    color: theme.palette.type === 'dark' ? '#f1f5f9' : '#0f172a',
    '& .MuiAlert-icon': {
      padding: 0,
      marginRight: theme.spacing(1.25),
      width: 18,
      height: 18,
      minWidth: 18,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      opacity: 1,
      marginTop: 0,
      alignSelf: 'flex-start',
      '& .MuiSvgIcon-root': {
        fontSize: 13,
      },
    },
    '& .MuiAlert-message': {
      padding: 0,
      paddingRight: theme.spacing(0.5),
      width: '100%',
    },
    '& .MuiAlert-action': {
      padding: 0,
      marginTop: theme.spacing(-0.5),
      marginRight: theme.spacing(-0.75),
      paddingLeft: theme.spacing(0.5),
      alignItems: 'flex-start',
      alignSelf: 'flex-start',
      '& .MuiIconButton-root': {
        color:
          theme.palette.type === 'dark' ? 'rgba(148, 163, 184, 0.9)' : 'rgba(100, 116, 139, 0.85)',
        padding: 4,
        marginTop: -2,
        marginRight: -2,
        '& .MuiSvgIcon-root': {
          fontSize: 17,
        },
        '&:hover': {
          backgroundColor:
            theme.palette.type === 'dark'
              ? 'rgba(148, 163, 184, 0.12)'
              : 'rgba(148, 163, 184, 0.15)',
        },
      },
    },
  },
  toastTitle: {
    fontWeight: 700,
    fontSize: '0.8125rem',
    letterSpacing: '-0.01em',
    color: theme.palette.type === 'dark' ? '#f8fafc' : '#0f172a',
    lineHeight: 1.3,
  },
  toastBody: {
    marginTop: 2,
    fontWeight: 400,
    fontSize: '0.75rem',
    color: theme.palette.type === 'dark' ? '#94a3b8' : '#64748b',
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
  success: {
    backgroundImage:
      theme.palette.type === 'dark'
        ? 'radial-gradient(ellipse 120% 70% at 0% 0%, rgba(34, 197, 94, 0.2) 0%, transparent 55%)'
        : 'radial-gradient(ellipse 120% 70% at 0% 0%, rgba(34, 197, 94, 0.12) 0%, transparent 55%)',
    '& .MuiAlert-icon': {
      backgroundColor: '#16a34a',
    },
  },
  error: {
    backgroundImage:
      theme.palette.type === 'dark'
        ? 'radial-gradient(ellipse 120% 70% at 0% 0%, rgba(220, 38, 38, 0.22) 0%, transparent 55%)'
        : 'radial-gradient(ellipse 120% 70% at 0% 0%, rgba(220, 38, 38, 0.1) 0%, transparent 55%)',
    '& .MuiAlert-icon': {
      backgroundColor: '#dc2626',
    },
  },
  info: {
    backgroundImage:
      theme.palette.type === 'dark'
        ? 'radial-gradient(ellipse 120% 70% at 0% 0%, rgba(59, 130, 246, 0.22) 0%, transparent 55%)'
        : 'radial-gradient(ellipse 120% 70% at 0% 0%, rgba(59, 130, 246, 0.14) 0%, transparent 55%)',
    '& .MuiAlert-icon': {
      backgroundColor: '#2563eb',
    },
  },
  warning: {
    backgroundImage:
      theme.palette.type === 'dark'
        ? 'radial-gradient(ellipse 120% 70% at 0% 0%, rgba(217, 119, 6, 0.22) 0%, transparent 55%)'
        : 'radial-gradient(ellipse 120% 70% at 0% 0%, rgba(217, 119, 6, 0.12) 0%, transparent 55%)',
    '& .MuiAlert-icon': {
      backgroundColor: '#d97706',
    },
  },
}));

function ToastSlide(props) {
  /* `direction="left"` = toast bay từ bên phải vào (Slide đẩy element theo
     direction tới vị trí cuối). Phù hợp với anchor bottom-right. */
  return <Slide {...props} direction="left" />;
}

/**
 * Toast: Snackbar góc phải dưới; thẻ trắng rộng hơn một chút — icon nhỏ cùng hàng tiêu đề.
 */
export function ToastProvider({ children }) {
  const classes = useToastStyles();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [severity, setSeverity] = useState('info');
  const [toastKey, setToastKey] = useState(0);

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  }, []);

  const show = useCallback((sev, payload) => {
    const { title: nextTitle, body: nextBody } = normalizeToastPayload(sev, payload);
    setSeverity(['success', 'error', 'warning', 'info'].includes(sev) ? sev : 'info');
    setTitle(nextTitle);
    setBody(nextBody);
    setToastKey((k) => k + 1);
    setOpen(true);
  }, []);

  useEffect(() => {
    registerToastNotifier(show);
    return () => registerToastNotifier(null);
  }, [show]);

  const autoHide = severity === 'error' ? 6500 : 4000;

  const alertClass = [classes.alert, classes[severity]].filter(Boolean).join(' ');

  return (
    <>
      {children}
      <Snackbar
        key={toastKey}
        className={classes.snackbar}
        open={open}
        autoHideDuration={autoHide}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={ToastSlide}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="standard"
          elevation={0}
          className={alertClass}
        >
          <div className={classes.toastTitle}>{title}</div>
          <div className={classes.toastBody}>{body}</div>
        </Alert>
      </Snackbar>
    </>
  );
}
