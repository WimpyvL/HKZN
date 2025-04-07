import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname functionality for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// PORT environment variable is crucial for cPanel Node.js integration
const port = process.env.PORT || 3000;

// Define the path to the static build directory
const buildPath = path.join(__dirname, 'dist');

// Serve static files (CSS, JS, images) from the 'dist' directory
app.use(express.static(buildPath));

// API requests are assumed to be handled by the separate PHP API deployment
// No proxying needed in this server.

// For any other request (that doesn't match a static file),
// send the index.html file. This allows React Router to handle routing.
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send(err);
    }
  });
});

app.listen(port, () => {
  console.log(`[HKZN Frontend Server] Listening on port ${port}`);
  console.log(`[HKZN Frontend Server] Serving static files from: ${buildPath}`);
});
