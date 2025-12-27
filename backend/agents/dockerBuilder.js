const Docker = require('dockerode');
const tar = require('tar-fs');
const fs = require('fs');
const path = require('path');

class DockerBuilder {
  constructor() {
    this.docker = new Docker();
  }

  async buildImage(projectPath, imageName, dockerfile) {
    console.log(`🐳 Building Docker image: ${imageName}`);
    
    try {
      // Write Dockerfile if provided
      if (dockerfile) {
        const dockerfilePath = path.join(projectPath, 'Dockerfile');
        await fs.promises.writeFile(dockerfilePath, dockerfile);
      }

      // Create tar stream of project
      const tarStream = tar.pack(projectPath);

      // Build image
      const stream = await this.docker.buildImage(tarStream, {
        t: imageName,
        dockerfile: 'Dockerfile'
      });

      // Stream build logs
      await new Promise((resolve, reject) => {
        this.docker.modem.followProgress(
          stream,
          (err, res) => (err ? reject(err) : resolve(res)),
          (event) => {
            if (event.stream) {
              console.log(event.stream.trim());
            }
          }
        );
      });

      console.log('✅ Docker image built successfully');
      return { success: true, imageName };
      
    } catch (error) {
      console.error('❌ Docker build failed:', error);
      throw error;
    }
  }

  async pushImage(imageName, registry = 'docker.io') {
    console.log(`📤 Pushing image to ${registry}`);
    
    try {
      const image = this.docker.getImage(imageName);
      const stream = await image.push();

      await new Promise((resolve, reject) => {
        this.docker.modem.followProgress(
          stream,
          (err, res) => (err ? reject(err) : resolve(res)),
          (event) => {
            if (event.status) {
              console.log(event.status);
            }
          }
        );
      });

      console.log('✅ Image pushed successfully');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Push failed:', error);
      throw error;
    }
  }

  async runContainer(imageName, port = 3000) {
    console.log(`🚀 Running container from ${imageName}`);
    
    try {
      const container = await this.docker.createContainer({
        Image: imageName,
        ExposedPorts: { [`${port}/tcp`]: {} },
        HostConfig: {
          PortBindings: { [`${port}/tcp`]: [{ HostPort: `${port}` }] }
        }
      });

      await container.start();
      console.log('✅ Container started');
      
      return { success: true, containerId: container.id };
      
    } catch (error) {
      console.error('❌ Container start failed:', error);
      throw error;
    }
  }
}

module.exports = new DockerBuilder();