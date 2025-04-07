import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname functionality for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000; // Use port provided by environment or default to 3000

// Define the path to the static build directory
const buildPath = path.join(__dirname, 'dist');

// Serve static files from the React app build directory
app.use(express.static(buildPath));

// Handle API requests or other server routes here if needed in the future
// For now, we assume the PHP API is handled separately

// Send the index.html for any other requests (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Serving static files from: ${buildPath}`);
});
