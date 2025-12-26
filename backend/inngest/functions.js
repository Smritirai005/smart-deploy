const inngest = require('./client');
const RailwayMCP = require('../../mcp-server/railway-mcp');

const railway = new RailwayMCP(process.env.RAILWAY_API_TOKEN);

const deploymentWorkflow = inngest.createFunction(
  { id: 'deployment-workflow', retries: 3 },
  { event: 'deployment/requested' },
  async ({ event, step }) => {
    
    // Step 1: Create Railway project
    const project = await step.run('create-project', async () => {
      return railway.createProject(event.data.projectName);
    });

    // Step 2: Deploy service
    const deployment = await step.run('deploy-service', async () => {
      return railway.deployService(
        project.projectCreate.id,
        event.data.dockerfile,
        event.data.envVars
      );
    });

    // Step 3: Monitor deployment
    await step.run('monitor-deployment', async () => {
      await step.sleep('30s');
      const logs = await railway.getDeploymentLogs(deployment.serviceCreate.id);
      return logs;
    });

    // Step 4: Send webhook notification
    await step.run('send-notification', async () => {
      await fetch(event.data.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'success',
          deploymentId: deployment.serviceCreate.id,
          projectId: project.projectCreate.id
        })
      });
    });

    return { success: true, deployment };
  }
);

module.exports = { deploymentWorkflow };