module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#001F3F",
        gold: "#FFD700",
      },
      backgroundImage: {
        "navy-grid":
          "linear-gradient(60deg, rgba(255, 215, 0, 0.15) 1px, transparent 1px), " +
          "linear-gradient(-60deg, rgba(255, 215, 0, 0.15) 1px, transparent 1px), " +
          "linear-gradient(0deg, rgba(255, 215, 0, 0.1) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
