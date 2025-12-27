const { serve } = require('inngest/express');
const inngest = require('./client');
const { deploymentWorkflow } = require('./functions');

module.exports = serve({
  client: inngest,
  functions: [deploymentWorkflow],
});