/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Background layers
                background: {
                    primary: '#0a0a0a',
                    secondary: '#121212',
                    tertiary: '#1a1a1a',
                },
                // Surface colors
                surface: {
                    DEFAULT: '#1a1a1a',
                    hover: '#222222',
                    active: '#2a2a2a',
                },
                // Glass colors (with opacity)
                glass: {
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: 'rgba(255, 255, 255, 0.08)',
                    hover: 'rgba(255, 255, 255, 0.05)',
                },
                // Text colors
                text: {
                    primary: '#ffffff',
                    secondary: 'rgba(255, 255, 255, 0.7)',
                    tertiary: 'rgba(255, 255, 255, 0.5)',
                    quaternary: 'rgba(255, 255, 255, 0.3)',
                },
                // Accent colors
                accent: {
                    blue: '#3b82f6',
                    purple: '#8b5cf6',
                    green: '#10b981',
                    yellow: '#f59e0b',
                    red: '#ef4444',
                },
            },
            backdropBlur: {
                xs: '2px',
                '3xl': '64px',
                '4xl': '128px',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'glass-sm': '0 2px 16px 0 rgba(0, 0, 0, 0.2)',
                'glass-lg': '0 16px 64px 0 rgba(0, 0, 0, 0.5)',
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}