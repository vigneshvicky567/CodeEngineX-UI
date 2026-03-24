/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "primary": "#00628c",
        "primary-shadow": "#1899D6",
        "on-primary": "#e9f4ff",
        "primary-container": "#2fb8ff",
        "on-primary-container": "#00324a",
        "primary-dim": "#00557a",
        "primary-fixed": "#2fb8ff",
        "on-primary-fixed": "#001624",
        "primary-fixed-dim": "#07abf0",
        "on-primary-fixed-variant": "#003b57",

        "secondary": "#2a6900",
        "on-secondary": "#d5ffb9",
        "secondary-container": "#84fb42",
        "on-secondary-container": "#245c00",
        "secondary-dim": "#235b00",
        "secondary-fixed": "#84fb42",
        "on-secondary-fixed": "#1a4700",
        "secondary-fixed-dim": "#76ec33",
        "on-secondary-fixed-variant": "#296700",

        "tertiary": "#725800",
        "on-tertiary": "#fff1d7",
        "tertiary-container": "#fec700",
        "on-tertiary-container": "#574300",
        "tertiary-dim": "#644c00",
        "tertiary-fixed": "#fec700",
        "on-tertiary-fixed": "#403000",
        "tertiary-fixed-dim": "#edba00",
        "on-tertiary-fixed-variant": "#634c00",

        "error": "#b31b25",
        "error-shadow": "#EA2B2B",
        "on-error": "#ffefee",
        "error-container": "#fb5151",
        "on-error-container": "#570008",
        "error-dim": "#9f0519",

        "background": "#f2f7ff",
        "on-background": "#0b314e",

        "surface": "#f2f7ff",
        "surface-alt": "#F7F7F9",
        "on-surface": "#0b314e",
        "surface-variant": "#c5dfff",
        "on-surface-variant": "#3f5e7d",

        "outline": "#5a7a9a",
        "outline-variant": "#90b0d3",

        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#e8f1ff",
        "surface-container": "#d9eaff",
        "surface-container-high": "#cfe5ff",
        "surface-container-highest": "#c5dfff",

        "inverse-surface": "#000f1e",
        "inverse-on-surface": "#80a0c2",
        "inverse-primary": "#2fb8ff",

        "surface-dim": "#b5d8ff",
        "surface-bright": "#f2f7ff",
        "surface-tint": "#00628c",

        // Additions from alternate screens:
        "background-light": "#ffffff",
        "background-dark": "#101c22",
        "text-main": "#4B4B4B",
        "muted": "#AFAFAF",
        "success": "#58CC02",
        "success-shadow": "#58A700",
        "streak": "#FFC800",
        "console-bg": "#2A2A35"
      },
      fontFamily: {
        "headline": ["Fredoka", "sans-serif"],
        "body": ["Be Vietnam Pro", "sans-serif"],
        "label": ["Plus Jakarta Sans", "sans-serif"],
        "display": ["Plus Jakarta Sans", "sans-serif"],
        "code": ["Fira Code", "monospace"]
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      boxShadow: {
        '3d-primary': '0 4px 0 0 #1899D6',
        '3d-secondary': '0 4px 0 0 #E5E7EB',
        'btn-success': '0 4px 0 0 #58A700',
        'button-error': '0 4px 0 0 #EA2B2B',
        'card': '0 4px 0 0 #E5E5E5',
        'card-active': '0 4px 0 0 #1eb1f6',
      }
    },
  },
  plugins: [],
}
