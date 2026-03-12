import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main:        '#6aaa1f',
      dark:        '#5a8a1e',
      light:       '#7abf22',
      contrastText: '#ffffff',
    },
    secondary: {
      main:        '#e85d1a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper:   '#ffffff',
    },
    text: {
      primary:   '#1e293b',
      secondary: '#64748b',
      disabled:  '#94a3b8',
    },
    divider: '#f1f5f9',
  },
  typography: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    overline: {
      fontWeight: 700,
      letterSpacing: '0.06em',
      fontSize: '0.6875rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #5a8a1e 0%, #6aaa1f 40%, #7abf22 100%)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 20,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '0.6875rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#94a3b8',
          padding: '12px 16px',
        },
        body: {
          padding: '12px 16px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#f8fafc',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6aaa1f',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          overflow: 'hidden',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 44,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#6aaa1f',
        },
      },
    },
  },
});

export default theme;
