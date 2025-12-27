const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const AdmZip = require('adm-zip');
const simpleGit = require('simple-git');
const codeAnalyzer = require('../agents/codeAnalyzer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Upload and analyze code
router.post('/upload-code', upload.array('files', 50), async (req, res) => {
  try {
    console.log('📤 Received file upload');
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Create project directory
    const projectId = `project-${Date.now()}`;
    const projectPath = path.join(__dirname, '../../uploads', projectId);
    await fs.mkdir(projectPath, { recursive: true });

    // Process uploaded files
    for (const file of req.files) {
      if (file.originalname.endsWith('.zip')) {
        // Extract ZIP
        console.log('📦 Extracting ZIP file...');
        const zip = new AdmZip(file.path);
        zip.extractAllTo(projectPath, true);
        await fs.unlink(file.path); // Delete ZIP after extraction
      } else {
        // Move individual file
        const destPath = path.join(projectPath, file.originalname);
        await fs.rename(file.path, destPath);
      }
    }

    // Analyze the code
    const analysis = await codeAnalyzer.analyzeProject(projectPath);

    res.json({
      success: true,
      projectId,
      projectPath,
      analysis
    });
    
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clone and analyze GitHub repo
router.post('/clone-github', async (req, res) => {
  try {
    const { githubUrl } = req.body;
    
    if (!githubUrl) {
      return res.status(400).json({ error: 'GitHub URL is required' });
    }

    console.log('📥 Cloning GitHub repo:', githubUrl);

    // Create project directory
    const projectId = `github-${Date.now()}`;
    const projectPath = path.join(__dirname, '../../uploads', projectId);
    await fs.mkdir(projectPath, { recursive: true });

    // Clone repo
    const git = simpleGit();
    await git.clone(githubUrl, projectPath);

    // Analyze the code
    const analysis = await codeAnalyzer.analyzeProject(projectPath);

    res.json({
      success: true,
      projectId,
      projectPath,
      analysis
    });
    
  } catch (error) {
    console.error('❌ GitHub clone error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;