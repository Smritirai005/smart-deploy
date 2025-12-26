const express = require('express');
const router = express.Router();
const RailwayMCP = require('../../mcp-server/railway-mcp');

const railway = new RailwayMCP(process.env.RAILWAY_API_TOKEN);

router.get('/:deploymentId/logs', async (req, res) => {
  try {
    const logs = await railway.getDeploymentLogs(req.params.deploymentId);
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;