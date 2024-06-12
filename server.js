const app = require('./app'); // Import the Express app instance
const PORT = process.env.PORT || 5000;

if (!app) {
  console.error('Failed to import the Express app instance from app.js');
  process.exit(1); // Exit with error
}

if (typeof app.listen !== 'function') {
  console.error('app.listen is not a function. Check if app.js exports an Express app instance correctly.');
  process.exit(1); // Exit with error
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
