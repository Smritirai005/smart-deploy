const axios = require('axios');

const RAILWAY_API_URL = 'https://backboard.railway.app/graphql';

class RailwayMCP {
  constructor(apiToken) {
    this.apiToken = apiToken;
  }

  async createProject(name) {
    const mutation = `
      mutation CreateProject($name: String!) {
        projectCreate(input: { name: $name }) {
          id
          name
        }
      }
    `;

    return this.request(mutation, { name });
  }

  async deployService(projectId, dockerfile, envVars = {}) {
    const mutation = `
      mutation DeployService($projectId: String!, $source: ServiceSourceInput!) {
        serviceCreate(input: { projectId: $projectId, source: $source }) {
          id
          name
        }
      }
    `;

    const variables = {
      projectId,
      source: {
        image: dockerfile
      }
    };

    return this.request(mutation, variables);
  }

  async getDeploymentLogs(deploymentId) {
    const query = `
      query GetLogs($deploymentId: String!) {
        deployment(id: $deploymentId) {
          logs {
            message
            timestamp
          }
        }
      }
    `;

    return this.request(query, { deploymentId });
  }

  async request(query, variables) {
    try {
      const response = await axios.post(
        RAILWAY_API_URL,
        { query, variables },
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Railway API Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = RailwayMCP;