import { createTheme } from '@mui/material/styles';

// Custom MUI theme with vibrant, modern aesthetics
export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00D9FF', // Vibrant cyan
            light: '#5DFDFF',
            dark: '#00A8CC',
        },
        secondary: {
            main: '#FF6B9D', // Vibrant pink
            light: '#FFB3D1',
            dark: '#C73866',
        },
        background: {
            default: '#0A0E27',
            paper: '#141B3D',
        },
        success: {
            main: '#00F5A0',
        },
        warning: {
            main: '#FFD93D',
        },
        error: {
            main: '#FF6B6B',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#B8C5D6',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 20px rgba(0, 217, 255, 0.3)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #00D9FF 0%, #00A8CC 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5DFDFF 0%, #00D9FF 100%)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                },
            },
        },
    },
});
