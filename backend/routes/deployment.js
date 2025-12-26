const express = require('express');
const router = express.Router();
const { planDeployment } = require('../agents/planner');
const { generateDockerfile, generateGitHubActions, generateRailwayConfig } = require('../agents/configGenerator');
const inngest = require('../inngest/client');

router.post('/plan', async (req, res) => {
  try {
    const { request } = req.body;
    
    // Validate request parameter
    if (!request || typeof request !== 'string' || request.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Request parameter is required and cannot be empty' 
      });
    }
    
    const plan = await planDeployment(request.trim());
    res.json({ success: true, plan });
  } catch (error) {
    console.error('Error in /plan endpoint:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate deployment plan',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.post('/generate-configs', async (req, res) => {
  try {
    const { framework, projectDetails } = req.body;
    
    const [dockerfile, githubActions, railwayConfig] = await Promise.all([
      generateDockerfile(framework, projectDetails),
      generateGitHubActions(framework),
      generateRailwayConfig(projectDetails.serviceName)
    ]);

    res.json({
      success: true,
      configs: { dockerfile, githubActions, railwayConfig }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/deploy', async (req, res) => {
  try {
    const { projectName, dockerfile, envVars, webhookUrl } = req.body;
    
    // Trigger Inngest workflow
    await inngest.send({
      name: 'deployment/requested',
      data: { projectName, dockerfile, envVars, webhookUrl }
    });

    res.json({
      success: true,
      message: 'Deployment started',
      trackingId: `deploy-${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;