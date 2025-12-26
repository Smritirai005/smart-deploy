const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const deploymentRoutes = require('./routes/deployment');
const statusRoutes = require('./routes/status');
const inngestServe = require('./inngest/serve');

app.use('/api/deployment', deploymentRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/inngest', inngestServe);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});