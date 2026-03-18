/**
 * CI/CD Integrations
 */

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * GitHub Actions Integration
 */
export class GitHubActions {
  private workflowPath: string;

  constructor(workflowPath: string = '.github/workflows') {
    this.workflowPath = workflowPath;
  }

  /**
   * Create test workflow
   */
  createTestWorkflow(): void {
    const workflow = {
      name: 'Test',
      on: ['push', 'pull_request'],
      jobs: {
        test: {
          'runs-on': 'ubuntu-latest',
          steps: [
            { uses: 'actions/checkout@v4' },
            {
              uses: 'actions/setup-node@v4',
              with: { 'node-version': '20' }
            },
            { run: 'npm ci' },
            { run: 'npm test' }
          ]
        }
      }
    };

    const dir = path.join(process.cwd(), this.workflowPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(dir, 'test.yml'),
      JSON.stringify(workflow, null, 2)
    );
  }

  /**
   * Create CI workflow with Veritas
   */
  createVeritasWorkflow(): void {
    const workflow = {
      name: 'Veritas Tests',
      on: ['push', 'pull_request'],
      jobs: {
        'generate-tests': {
          'runs-on': 'ubuntu-latest',
          steps: [
            { uses: 'actions/checkout@v4' },
            {
              uses: 'actions/setup-node@v4',
              with: { 'node-version': '20' }
            },
            { run: 'npm ci' },
            {
              run: 'npx veritas auto src/ --url ${{ secrets.APP_URL }}',
              env: {
                OPENAI_API_KEY: '${{ secrets.OPENAI_API_KEY }}'
              }
            },
            { uses: 'actions/upload-artifact@v4', with: { name: 'tests', path: 'tests/' } }
          ]
        },
        'run-tests': {
          'runs-on': 'ubuntu-latest',
          needs: ['generate-tests'],
          steps: [
            { uses: 'actions/checkout@v4' },
            {
              uses: 'actions/setup-node@v4',
              with: { 'node-version': '20' }
            },
            { run: 'npm ci' },
            { uses: 'actions/download-artifact@v4', with: { name: 'tests' } },
            { run: 'npm test' }
          ]
        }
      }
    };

    const dir = path.join(process.cwd(), this.workflowPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(dir, 'veritas.yml'),
      JSON.stringify(workflow, null, 2)
    );
  }
}

/**
 * GitLab CI Integration
 */
export class GitLabCI {
  /**
   * Create .gitlab-ci.yml
   */
  createCI(): void {
    const ci = {
      stages: ['test'],
      'veritas-test': {
        stage: 'test',
        image: 'node:20',
        script: [
          'npm ci',
          'npx veritas auto src/',
          'npm test'
        ],
        artifacts: {
          paths: ['tests/'],
          when: 'always'
        }
      }
    };

    fs.writeFileSync(
      path.join(process.cwd(), '.gitlab-ci.yml'),
      JSON.stringify(ci, null, 2)
    );
  }
}

/**
 * Jenkins Integration
 */
export class Jenkins {
  /**
   * Create Jenkinsfile
   */
  createJenkinsfile(): void {
    const jenkinsfile = `
pipeline {
  agent any
  
  stages {
    stage('Generate Tests') {
      steps {
        sh 'npm ci'
        sh 'npx veritas auto src/'
      }
    }
    
    stage('Run Tests') {
      steps {
        sh 'npm test'
      }
    }
  }
  
  post {
    always {
      junit 'tests/**/*.xml'
      archiveArtifacts artifacts: 'tests/**', fingerprint: true
    }
  }
}
`;

    fs.writeFileSync(
      path.join(process.cwd(), 'Jenkinsfile'),
      jenkinsfile
    );
  }
}

/**
 * CircleCI Integration
 */
export class CircleCI {
  /**
   * Create .circleci/config.yml
   */
  createConfig(): void {
    const config = {
      version: 2.1,
      jobs: {
        test: {
          docker: [{ image: 'node:20' }],
          steps: [
            'checkout',
            'run: npm ci',
            'run: npx veritas auto src/',
            'run: npm test'
          ]
        }
      },
      workflows: {
        version: 2,
        test: {
          jobs: ['test']
        }
      }
    };

    const dir = path.join(process.cwd(), '.circleci');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(dir, 'config.yml'),
      JSON.stringify(config, null, 2)
    );
  }
}

/**
 * Create all CI/CD configurations
 */
export function createAllIntegrations(): void {
  const integrations = [
    new GitHubActions(),
    new GitLabCI(),
    new Jenkins(),
    new CircleCI()
  ];

  // GitHub Actions workflows
  (integrations[0] as GitHubActions).createTestWorkflow();
  (integrations[0] as GitHubActions).createVeritasWorkflow();

  // Other integrations
  (integrations[1] as GitLabCI).createCI();
  (integrations[2] as Jenkins).createJenkinsfile();
  (integrations[3] as CircleCI).createConfig();

  console.log('CI/CD configurations created!');
}
