import { createMuiTheme } from '@material-ui/core/styles';

/**
 * Theme sáng: nền xanh-xám nhạt, primary indigo đậm.
 * Theme tối: nền slate, giấy (paper) tách lớp, primary indigo sáng để đủ contrast.
 */
export function buildTheme(mode) {
  const isDark = mode === 'dark';

  const primary = isDark
    ? { light: '#a5b4fc', main: '#818cf8', dark: '#6366f1' }
    : { light: '#5c6bc0', main: '#3949ab', dark: '#283593' };

  const secondary = isDark
    ? { light: '#f9a8d4', main: '#f472b6', dark: '#db2777' }
    : { light: '#ff4081', main: '#d81b60', dark: '#ad1457' };

  return createMuiTheme({
    palette: {
      type: mode,
      primary,
      secondary,
      background: {
        default: isDark ? '#0f1219' : '#eceff7',
        paper: isDark ? '#1a2030' : '#ffffff',
      },
      text: {
        primary: isDark ? '#e8eaef' : '#161922',
        secondary: isDark ? '#9aa3b2' : '#5a6270',
      },
      divider: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)',
      action: {
        hover: isDark ? 'rgba(129, 140, 248, 0.12)' : 'rgba(57, 73, 171, 0.06)',
        selected: isDark ? 'rgba(129, 140, 248, 0.18)' : 'rgba(57, 73, 171, 0.1)',
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      button: { textTransform: 'none', fontWeight: 600 },
    },
    overrides: {
      MuiPaper: {
        root: {
          backgroundImage: 'none',
        },
      },
      MuiButton: {
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': { boxShadow: isDark ? '0 4px 14px rgba(129,140,248,0.35)' : '0 4px 14px rgba(57,73,171,0.35)' },
        },
      },
    },
  });
}
