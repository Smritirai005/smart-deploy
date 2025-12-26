const { Inngest } = require('inngest');

const inngest = new Inngest({
  id: 'deployment-platform',
  eventKey: process.env.INNGEST_EVENT_KEY,
});

module.exports = inngest;