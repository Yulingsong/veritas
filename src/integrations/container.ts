/**
 * Docker Integration
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Docker Configuration
 */
export class Docker {
  /**
   * Create Dockerfile for Veritas
   */
  createDockerfile(): void {
    const dockerfile = `# Veritas - AI-Powered Frontend Testing

FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps chromium

# Default command
CMD ["npx", "veritas", "--help"]
`;

    fs.writeFileSync(
      path.join(process.cwd(), 'Dockerfile'),
      dockerfile
    );
  }

  /**
   * Create docker-compose.yml
   */
  createDockerCompose(): void {
    const compose = {
      version: '3.8',
      services: {
        'veritas': {
          build: '.',
          volumes: ['./src:/app/src', './tests:/app/tests'],
          environment: {
            'OPENAI_API_KEY': '${OPENAI_API_KEY}'
          },
          'working_dir': '/app'
        },
        'app': {
          image: 'node:20',
          ports: ['3000:3000'],
          volumes: ['./src:/app/src'],
          command: 'npm run dev'
        }
      }
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'docker-compose.yml'),
      JSON.stringify(compose, null, 2)
    );
  }

  /**
   * Create .dockerignore
   */
  createDockerIgnore(): void {
    const ignore = `
node_modules
dist
.git
*.log
.DS_Store
coverage
tests
!tests/*.test.ts
.vscode
.idea
*.md
`;

    fs.writeFileSync(
      path.join(process.cwd(), '.dockerignore'),
      ignore
    );
  }
}

/**
 * Kubernetes Integration
 */
export class Kubernetes {
  /**
   * Create Kubernetes deployment
   */
  createDeployment(): void {
    const deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: 'veritas'
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: { app: 'veritas' }
        },
        template: {
          metadata: {
            labels: { app: 'veritas' }
          },
          spec: {
            containers: [
              {
                name: 'veritas',
                image: 'veritas:latest',
                env: [
                  { name: 'OPENAI_API_KEY', valueFrom: { secretKeyRef: { name: 'veritas', key: 'api-key' } } }
                ]
              }
            ]
          }
        }
      }
    };

    const dir = path.join(process.cwd(), 'k8s');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(dir, 'deployment.yaml'),
      JSON.stringify(deployment, null, 2)
    );
  }
}

/**
 * Create all container configurations
 */
export function createAll(): void {
  const docker = new Docker();
  docker.createDockerfile();
  docker.createDockerCompose();
  docker.createDockerIgnore();

  const k8s = new Kubernetes();
  k8s.createDeployment();

  console.log('Container configurations created!');
}
