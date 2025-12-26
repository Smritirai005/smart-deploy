const Groq = require('groq-sdk');

// Validate API key on module load
if (!process.env.GROQ_API_KEY) {
  console.error('⚠️  WARNING: GROQ_API_KEY environment variable is not set');
}

const groq = process.env.GROQ_API_KEY 
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

async function planDeployment(userRequest) {
  // Check if API key is configured
  if (!groq || !process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured. Please set it in your environment variables.');
  }

  // Validate input
  if (!userRequest || typeof userRequest !== 'string' || userRequest.trim().length === 0) {
    throw new Error('User request cannot be empty');
  }

  try {
    console.log('🤖 Planning deployment for:', userRequest);
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a deployment planner expert. Analyze deployment requests and create structured plans. 
Always respond with ONLY valid JSON, no markdown, no code blocks, no extra text.`
        },
        {
          role: 'user',
          content: `Analyze this deployment request and create a structured plan:

"${userRequest}"

Return ONLY a JSON object with this exact structure:
{
  "framework": "nextjs|react|node|python|vue|angular",
  "deploymentTarget": "railway|vercel|docker|aws|heroku",
  "steps": [
    {"step": 1, "action": "analyze_project", "description": "Analyze project structure and dependencies"},
    {"step": 2, "action": "generate_dockerfile", "description": "Generate optimized Dockerfile for production"},
    {"step": 3, "action": "setup_ci_cd", "description": "Configure CI/CD pipeline"},
    {"step": 4, "action": "deploy", "description": "Deploy to platform"}
  ],
  "requirements": ["docker", "cli-tools", "git"],
  "estimatedTime": "5-10 minutes"
}

Base your response on the user's request. Return ONLY the JSON, nothing else.`
        }
      ],
      model: 'llama-3.3-70b-versatile', // Fast and capable
      temperature: 0.3, // Low temperature for consistent JSON
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    console.log('📝 Raw Groq response:', response.substring(0, 200) + '...');
    
    // Clean response - remove markdown code blocks if present
    let cleanedResponse = response.trim();
    cleanedResponse = cleanedResponse.replace(/```json\n?/gi, '');
    cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    cleanedResponse = cleanedResponse.trim();
    
    // Extract JSON from response
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const plan = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully parsed deployment plan');
        return plan;
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('Response text:', response);
        throw new Error('Failed to parse deployment plan response. The AI response was not valid JSON.');
      }
    }
    
    throw new Error('Failed to extract JSON from AI response. The response format was unexpected.');
  } catch (error) {
    // Handle specific Groq API errors
    if (error.message && error.message.includes('API_KEY')) {
      throw new Error('Invalid or missing Groq API key. Please check your GROQ_API_KEY environment variable.');
    }
    if (error.message && (error.message.includes('quota') || error.message.includes('rate limit'))) {
      throw new Error('Groq API rate limit exceeded. Please wait a moment and try again.');
    }
    
    // Re-throw with more context
    console.error('❌ Deployment planning error:', error);
    throw new Error(`Failed to generate deployment plan: ${error.message}`);
  }
}

module.exports = { planDeployment };