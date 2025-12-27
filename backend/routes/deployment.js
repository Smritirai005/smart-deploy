const express = require('express');
const router = express.Router();
const { planDeployment } = require('../agents/planner');
const { generateDockerfile, generateGitHubActions, generateRailwayConfig } = require('../agents/configGenerator');
const dockerBuilder = require('../agents/dockerBuilder');
const inngest = require('../inngest/client');

// ... existing /plan route ...

router.post('/generate-plan', async (req, res) => {
  try {
    console.log('✅ /generate-plan endpoint hit');
    console.log('Request body:', req.body);

    const { request } = req.body;
    if (!request || typeof request !== 'string') {
      return res.status(400).json({ error: 'Request text is required' });
    }

    const plan = await planDeployment(request);

    res.json({ success: true, plan });
  } catch (error) {
    console.error('❌ Error in /generate-plan:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-configs', async (req, res) => {
  try {
    console.log('✅ /generate-configs endpoint hit');
    console.log('Request body:', req.body);
    
    const { framework, projectDetails, codeAnalysis } = req.body;
    
    if (!framework) {
      return res.status(400).json({ error: 'Framework is required' });
    }
    
    console.log('Generating Dockerfile...');
    // Pass code analysis to config generator for smarter Dockerfile
    const dockerfile = await generateDockerfile(framework, {
      ...projectDetails,
      codeAnalysis
    });
    
    console.log('Generating GitHub Actions...');
    const githubActions = await generateGitHubActions(framework);
    
    console.log('Generating Railway config...');
    const railwayConfig = await generateRailwayConfig(projectDetails?.serviceName || 'my-app');

    console.log('✅ All configs generated successfully');
    res.json({
      success: true,
      configs: { 
        dockerfile, 
        githubActions, 
        railwayConfig,
        codePath: codeAnalysis?.projectPath 
      }
    });
  } catch (error) {
    console.error('❌ Error in /generate-configs:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/deploy', async (req, res) => {
  try {
    const { projectName, dockerfile, uploadedCodePath, githubUrl, envVars, webhookUrl } = req.body;
    
    // Build Docker image if code was uploaded
    if (uploadedCodePath) {
      console.log('🐳 Building Docker image...');
      const imageName = `${projectName}:latest`;
      
      await dockerBuilder.buildImage(uploadedCodePath, imageName, dockerfile);
      
      // Trigger Inngest workflow with built image
      await inngest.send({
        name: 'deployment/requested',
        data: { 
          projectName, 
          imageName,
          dockerfile, 
          envVars, 
          webhookUrl 
        }
      });
    } else if (githubUrl) {
      // Deploy from GitHub
      await inngest.send({
        name: 'deployment/requested',
        data: { 
          projectName, 
          githubUrl,
          dockerfile, 
          envVars, 
          webhookUrl 
        }
      });
    } else {
      return res.status(400).json({ error: 'Either uploadedCodePath or githubUrl is required' });
    }

    res.json({
      success: true,
      message: 'Deployment started',
      trackingId: `deploy-${Date.now()}`
    });
  } catch (error) {
    console.error('❌ Error in /deploy:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;