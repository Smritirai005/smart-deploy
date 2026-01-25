const express = require('express');
const router = express.Router();
const { generateREADME, generateAPIDocs, generateArchitectureDiagram } = require('../agents/documentGenerator');
const codeAnalyzer = require('../agents/codeAnalyzer');

/**
 * Generate README for a project
 */
router.post('/generate-readme', async (req, res) => {
  try {
    console.log('✅ /generate-readme endpoint hit');
    console.log('Request body:', req.body);

    const { projectDetails, codeAnalysis, projectPath } = req.body;
    
    if (!projectDetails) {
      return res.status(400).json({ error: 'Project details are required' });
    }

    // If projectPath is provided, analyze the code first
    let analysis = codeAnalysis;
    if (projectPath && !codeAnalysis) {
      try {
        analysis = await codeAnalyzer.analyzeProject(projectPath);
      } catch (error) {
        console.log('⚠️ Could not analyze project, proceeding without analysis');
      }
    }

    console.log('Generating README...');
    const readme = await generateREADME(projectDetails, analysis || {});

    res.json({
      success: true,
      readme
    });
  } catch (error) {
    console.error('❌ Error in /generate-readme:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate API documentation
 */
router.post('/generate-api-docs', async (req, res) => {
  try {
    console.log('✅ /generate-api-docs endpoint hit');
    console.log('Request body:', req.body);

    const { projectDetails, codeAnalysis, projectPath } = req.body;
    
    if (!projectDetails) {
      return res.status(400).json({ error: 'Project details are required' });
    }

    // If projectPath is provided, analyze the code first
    let analysis = codeAnalysis;
    if (projectPath && !codeAnalysis) {
      try {
        analysis = await codeAnalyzer.analyzeProject(projectPath);
      } catch (error) {
        console.log('⚠️ Could not analyze project, proceeding without analysis');
      }
    }

    console.log('Generating API Documentation...');
    const apiDocs = await generateAPIDocs(projectDetails, analysis || {});

    res.json({
      success: true,
      apiDocs
    });
  } catch (error) {
    console.error('❌ Error in /generate-api-docs:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate architecture diagram
 */
router.post('/generate-architecture-diagram', async (req, res) => {
  try {
    console.log('✅ /generate-architecture-diagram endpoint hit');
    console.log('Request body:', req.body);

    const { projectDetails, codeAnalysis, projectPath } = req.body;
    
    if (!projectDetails) {
      return res.status(400).json({ error: 'Project details are required' });
    }

    // If projectPath is provided, analyze the code first
    let analysis = codeAnalysis;
    if (projectPath && !codeAnalysis) {
      try {
        analysis = await codeAnalyzer.analyzeProject(projectPath);
      } catch (error) {
        console.log('⚠️ Could not analyze project, proceeding without analysis');
      }
    }

    console.log('Generating Architecture Diagram...');
    const diagram = await generateArchitectureDiagram(projectDetails, analysis || {});

    res.json({
      success: true,
      diagram,
      format: 'mermaid'
    });
  } catch (error) {
    console.error('❌ Error in /generate-architecture-diagram:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate all documentation (README, API docs, architecture diagram)
 */
router.post('/generate-all', async (req, res) => {
  try {
    console.log('✅ /generate-all endpoint hit');
    console.log('Request body:', req.body);

    const { projectDetails, codeAnalysis, projectPath } = req.body;
    
    if (!projectDetails) {
      return res.status(400).json({ error: 'Project details are required' });
    }

    // If projectPath is provided, analyze the code first
    let analysis = codeAnalysis;
    if (projectPath && !codeAnalysis) {
      try {
        analysis = await codeAnalyzer.analyzeProject(projectPath);
      } catch (error) {
        console.log('⚠️ Could not analyze project, proceeding without analysis');
      }
    }

    console.log('Generating all documentation...');
    const [readme, apiDocs, diagram] = await Promise.all([
      generateREADME(projectDetails, analysis || {}),
      generateAPIDocs(projectDetails, analysis || {}),
      generateArchitectureDiagram(projectDetails, analysis || {})
    ]);

    res.json({
      success: true,
      documentation: {
        readme,
        apiDocs,
        architectureDiagram: diagram,
        format: 'mermaid'
      }
    });
  } catch (error) {
    console.error('❌ Error in /generate-all:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
