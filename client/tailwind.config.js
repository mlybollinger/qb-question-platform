/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        "primary-dim": "var(--desaturated-primary)",
        "primary-dark": "var(--dark-color)",
        "primary-light": "var(--light-color)",
        ink: "var(--text-color)",
        "ink-subtle": "var(--subtitle-color)",
        "ink-faint": "var(--light-font-color)",
        stroke: "var(--line-color)",
        "stroke-light": "var(--light-line-color)",
        canvas: "var(--light-background)",
        danger: "var(--red)",
        "danger-bg": "var(--red-light)",
        "danger-border": "var(--red-light-border)",
        "danger-dark": "var(--red-dark)",
        annotation: "var(--annotation-color)",
        "status-yellow": "var(--light-yellow)",
        "status-red": "var(--light-red)",
        "status-blue": "var(--light-blue)",
        "status-green": "var(--light-green)",
        subtitle: "var(--subtitle-color)",
      },
      fontFamily: {
        heading: ["var(--heading-font)"],
        body: ["var(--body-font)"],
        "dm-sans": ['"DM Sans"', "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
