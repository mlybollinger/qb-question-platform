const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, "src/")
    }
  },
  // You can also add Babel or PostCSS plugins here
  babel: {
    plugins: []
  }
};

