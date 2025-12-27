const fs = require('fs').promises;
const path = require('path');

class CodeAnalyzer {
  async analyzeProject(projectPath) {
    console.log('🔍 Analyzing project at:', projectPath);
    
    try {
      const analysis = {
        framework: 'unknown',
        packageManager: 'npm',
        dependencies: [],
        scripts: {},
        port: 3000,
        buildCommand: null,
        startCommand: null,
        hasDockerfile: false,
        files: []
      };

      // Check for package.json
      const packageJsonPath = path.join(projectPath, 'package.json');
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        
        // Detect framework
        if (packageJson.dependencies) {
          if (packageJson.dependencies.next) {
            analysis.framework = 'nextjs';
            analysis.buildCommand = 'npm run build';
            analysis.startCommand = 'npm start';
          } else if (packageJson.dependencies.react) {
            analysis.framework = 'react';
            analysis.buildCommand = 'npm run build';
            analysis.startCommand = 'npm start';
          } else if (packageJson.dependencies.express) {
            analysis.framework = 'node';
            analysis.startCommand = 'node server.js';
          } else if (packageJson.dependencies.vue) {
            analysis.framework = 'vue';
            analysis.buildCommand = 'npm run build';
          }
          
          analysis.dependencies = Object.keys(packageJson.dependencies);
        }
        
        // Get scripts
        if (packageJson.scripts) {
          analysis.scripts = packageJson.scripts;
          
          // Try to detect port from start script
          const startScript = packageJson.scripts.start || packageJson.scripts.dev;
          if (startScript && startScript.includes('PORT=')) {
            const portMatch = startScript.match(/PORT=(\d+)/);
            if (portMatch) analysis.port = parseInt(portMatch[1]);
          }
        }
        
      } catch (error) {
        console.log('No package.json found, checking other indicators...');
      }

      // Check for Python projects
      const requirementsPath = path.join(projectPath, 'requirements.txt');
      try {
        await fs.access(requirementsPath);
        analysis.framework = 'python';
        analysis.packageManager = 'pip';
        analysis.startCommand = 'python app.py';
      } catch (error) {
        // Not a Python project
      }

      // Check for existing Dockerfile
      const dockerfilePath = path.join(projectPath, 'Dockerfile');
      try {
        await fs.access(dockerfilePath);
        analysis.hasDockerfile = true;
      } catch (error) {
        // No Dockerfile
      }

      // List project files
      const files = await this.listFiles(projectPath);
      analysis.files = files;

      console.log('✅ Analysis complete:', analysis);
      return analysis;
      
    } catch (error) {
      console.error('❌ Analysis error:', error);
      throw error;
    }
  }

  async listFiles(dir, fileList = [], baseDir = dir) {
    const files = await fs.readdir(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      
      // Skip node_modules, .git, etc.
      if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') {
        continue;
      }
      
      if (stat.isDirectory()) {
        await this.listFiles(filePath, fileList, baseDir);
      } else {
        fileList.push(path.relative(baseDir, filePath));
      }
    }
    
    return fileList;
  }
}

module.exports = new CodeAnalyzer();