const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const deploymentRoutes = require('./routes/deployment');
const statusRoutes = require('./routes/status');
const uploadRoutes = require('./routes/upload');
const documentationRoutes = require('./routes/documentation');

// Use routes
app.use('/api/deployment', deploymentRoutes);
app.use('/api/deployment', uploadRoutes); // Add upload routes
app.use('/api/status', statusRoutes);
app.use('/api/documentation', documentationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
