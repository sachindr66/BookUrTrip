// tailwind.config.js
export default {
  content: ['./src/**/*.{jsx,js,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Blue Gradient Theme - Professional Travel Colors
        primary: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#0052D4', // Dark blue - main primary
          600: '#4364F7',
          700: '#6FB1FC',
          800: '#0052D4',
          900: '#0052D4',
        },
        secondary: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#4364F7', // Medium blue - main secondary
          600: '#6FB1FC',
          700: '#0052D4',
          800: '#4364F7',
          900: '#0052D4',
        },
        accent: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6FB1FC', // Light blue - main accent
          600: '#4364F7',
          700: '#0052D4',
          800: '#6FB1FC',
          900: '#4364F7',
        },
        // Enhanced neutral colors for better contrast
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Blue gradient variations for states
        success: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#0052D4', // Dark blue for success states
          600: '#4364F7',
          700: '#6FB1FC',
          800: '#0052D4',
          900: '#0052D4',
        },
        warning: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#4364F7', // Medium blue for warnings
          600: '#6FB1FC',
          700: '#0052D4',
          800: '#4364F7',
          900: '#0052D4',
        },
        error: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6FB1FC', // Light blue for errors
          600: '#4364F7',
          700: '#0052D4',
          800: '#6FB1FC',
          900: '#4364F7',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}