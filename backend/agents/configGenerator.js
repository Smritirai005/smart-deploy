const Groq = require('groq-sdk');

// Validate API key
if (!process.env.GROQ_API_KEY) {
  console.error('⚠️  WARNING: GROQ_API_KEY environment variable is not set');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function generateDockerfile(framework, projectDetails) {
  try {
    console.log(`🐳 Generating Dockerfile for ${framework}...`);
    
    const prompt = `
Generate a production-ready Dockerfile for a ${framework} application.

Project Details:
${JSON.stringify(projectDetails, null, 2)}

Return ONLY the Dockerfile content, no explanations, no markdown code blocks.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile', // ✅ Updated model
      temperature: 0.3,
      max_tokens: 1500,
    });

    let dockerfile = completion.choices[0].message.content;
    
    // Clean up markdown if present
    dockerfile = dockerfile.replace(/```dockerfile\n?/gi, '');
    dockerfile = dockerfile.replace(/```\n?/g, '');
    dockerfile = dockerfile.trim();
    
    console.log('✅ Dockerfile generated successfully');
    return dockerfile;
    
  } catch (error) {
    console.error('❌ Error generating Dockerfile:', error.message);
    throw new Error(`Failed to generate Dockerfile: ${error.message}`);
  }
}

async function generateGitHubActions(framework) {
  try {
    console.log(`⚙️ Generating GitHub Actions for ${framework}...`);
    
    const prompt = `
Generate a GitHub Actions workflow YAML for deploying a ${framework} app to Railway.

Include:
- Build step
- Docker image creation
- Railway deployment
- Environment variable handling

Return ONLY the YAML content, no markdown code blocks.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile', // ✅ Updated model
      temperature: 0.3,
      max_tokens: 1500,
    });

    let yaml = completion.choices[0].message.content;
    
    // Clean up markdown if present
    yaml = yaml.replace(/```yaml\n?/gi, '');
    yaml = yaml.replace(/```yml\n?/gi, '');
    yaml = yaml.replace(/```\n?/g, '');
    yaml = yaml.trim();
    
    console.log('✅ GitHub Actions workflow generated successfully');
    return yaml;
    
  } catch (error) {
    console.error('❌ Error generating GitHub Actions:', error.message);
    throw new Error(`Failed to generate GitHub Actions: ${error.message}`);
  }
}

async function generateRailwayConfig(serviceName) {
  try {
    console.log(`🚂 Generating Railway config for ${serviceName}...`);
    
    const config = {
      build: {
        builder: "DOCKERFILE",
        dockerfilePath: "Dockerfile"
      },
      deploy: {
        startCommand: "npm start",
        restartPolicyType: "ON_FAILURE",
        restartPolicyMaxRetries: 10
      },
      service: {
        name: serviceName
      }
    };

    console.log('✅ Railway config generated successfully');
    return JSON.stringify(config, null, 2);
    
  } catch (error) {
    console.error('❌ Error generating Railway config:', error.message);
    throw new Error(`Failed to generate Railway config: ${error.message}`);
  }
}

module.exports = {
  generateDockerfile,
  generateGitHubActions,
  generateRailwayConfig
};