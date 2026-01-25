const Groq = require('groq-sdk');

// Validate API key
if (!process.env.GROQ_API_KEY) {
  console.error('⚠️  WARNING: GROQ_API_KEY environment variable is not set');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Generate a comprehensive README file for a project
 * @param {Object} projectDetails - Project information including framework, dependencies, etc.
 * @param {Object} codeAnalysis - Code analysis results from codeAnalyzer
 * @returns {Promise<string>} Generated README content
 */
async function generateREADME(projectDetails, codeAnalysis = {}) {
  try {
    console.log('📝 Generating README...');
    
    const prompt = `
Generate a comprehensive, professional README.md file for a ${projectDetails.framework || 'web'} application.

Project Details:
${JSON.stringify(projectDetails, null, 2)}

Code Analysis:
${JSON.stringify(codeAnalysis, null, 2)}

The README should include:
- Project title and description
- Features list
- Tech stack
- Prerequisites
- Installation instructions
- Configuration/setup steps
- Usage examples
- API endpoints (if applicable)
- Project structure
- Contributing guidelines
- License information
- Author/credits

Make it professional, well-formatted with proper markdown, and include emojis for better readability.
Return ONLY the README content in markdown format, no code blocks, no explanations.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_tokens: 3000,
    });

    let readme = completion.choices[0].message.content;
    
    // Clean up markdown code blocks if present
    readme = readme.replace(/```markdown\n?/gi, '');
    readme = readme.replace(/```md\n?/gi, '');
    readme = readme.replace(/```\n?/g, '');
    readme = readme.trim();
    
    console.log('✅ README generated successfully');
    return readme;
    
  } catch (error) {
    console.error('❌ Error generating README:', error.message);
    throw new Error(`Failed to generate README: ${error.message}`);
  }
}

/**
 * Generate API documentation
 * @param {Object} projectDetails - Project information
 * @param {Object} codeAnalysis - Code analysis results
 * @returns {Promise<string>} Generated API documentation
 */
async function generateAPIDocs(projectDetails, codeAnalysis = {}) {
  try {
    console.log('📚 Generating API Documentation...');
    
    const prompt = `
Generate comprehensive API documentation for a ${projectDetails.framework || 'web'} application.

Project Details:
${JSON.stringify(projectDetails, null, 2)}

Code Analysis:
${JSON.stringify(codeAnalysis, null, 2)}

The API documentation should include:
- API overview and base URL
- Authentication methods (if applicable)
- Endpoint documentation with:
  * HTTP method and path
  * Description
  * Request parameters (query, body, headers)
  * Response format with status codes
  * Example requests and responses
- Error handling
- Rate limiting (if applicable)
- Versioning information

Format it as markdown with proper code blocks for examples.
Return ONLY the API documentation content in markdown format, no code blocks wrapper, no explanations.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 3000,
    });

    let apiDocs = completion.choices[0].message.content;
    
    // Clean up markdown code blocks if present
    apiDocs = apiDocs.replace(/```markdown\n?/gi, '');
    apiDocs = apiDocs.replace(/```md\n?/gi, '');
    apiDocs = apiDocs.replace(/```\n?/g, '');
    apiDocs = apiDocs.trim();
    
    console.log('✅ API Documentation generated successfully');
    return apiDocs;
    
  } catch (error) {
    console.error('❌ Error generating API docs:', error.message);
    throw new Error(`Failed to generate API documentation: ${error.message}`);
  }
}

/**
 * Generate architecture diagram in Mermaid format
 * @param {Object} projectDetails - Project information
 * @param {Object} codeAnalysis - Code analysis results
 * @returns {Promise<string>} Generated Mermaid diagram code
 */
async function generateArchitectureDiagram(projectDetails, codeAnalysis = {}) {
  try {
    console.log('🏗️ Generating Architecture Diagram...');
    
    const prompt = `
Generate a Mermaid architecture diagram for a ${projectDetails.framework || 'web'} application.

Project Details:
${JSON.stringify(projectDetails, null, 2)}

Code Analysis:
${JSON.stringify(codeAnalysis, null, 2)}

Create a comprehensive architecture diagram showing:
- System components (frontend, backend, database, etc.)
- Data flow between components
- External services and APIs
- Deployment infrastructure
- Technology stack visualization

Use Mermaid syntax (graph TB, flowchart TD, etc.) and make it detailed and professional.
Include proper styling and labels.
Return ONLY the Mermaid diagram code, no markdown code blocks, no explanations.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 2000,
    });

    let diagram = completion.choices[0].message.content;
    
    // Clean up markdown code blocks if present
    diagram = diagram.replace(/```mermaid\n?/gi, '');
    diagram = diagram.replace(/```\n?/g, '');
    diagram = diagram.trim();
    
    // Ensure it starts with a valid Mermaid directive
    if (!diagram.match(/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitgraph|journey)/i)) {
      // If it doesn't start with a Mermaid directive, wrap it in flowchart
      diagram = `flowchart TD\n${diagram}`;
    }
    
    console.log('✅ Architecture diagram generated successfully');
    return diagram;
    
  } catch (error) {
    console.error('❌ Error generating architecture diagram:', error.message);
    throw new Error(`Failed to generate architecture diagram: ${error.message}`);
  }
}

module.exports = {
  generateREADME,
  generateAPIDocs,
  generateArchitectureDiagram
};
