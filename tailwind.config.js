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
                // Accent colors - APENAS AS USADAS
                accent: {
                    blue: '#3b82f6',
                    green: '#10b981',
                    red: '#ef4444',
                },
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'glass-sm': '0 2px 16px 0 rgba(0, 0, 0, 0.2)',
                'glass-lg': '0 16px 64px 0 rgba(0, 0, 0, 0.5)',
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}