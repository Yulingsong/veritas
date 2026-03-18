/**
 * Veritas Integrations
 * 
 * This module provides integrations with various tools and platforms.
 */

export * from './ci.js';
export * from './ide.js';
export * from './container.js';
export * from './lint.js';

/**
 * Create all integrations
 */
import { GitHubActions, GitLabCI, Jenkins, CircleCI, createAllIntegrations as createCI } from './ci.js';
import { VSCode, JetBrains, Vim, createAllIntegrations as createIDE } from './ide.js';
import { Docker, Kubernetes, createAll as createContainer } from './container.js';
import { ESLint, Prettier, EditorConfig, createAll as createLint } from './lint.js';

/**
 * Integration Manager
 */
export class IntegrationManager {
  /**
   * Create CI/CD integrations
   */
  static createCI(): void {
    createCI();
  }

  /**
   * Create IDE integrations
   */
  static createIDE(): void {
    createIDE();
  }

  /**
   * Create container integrations
   */
  static createContainer(): void {
    createContainer();
  }

  /**
   * Create linting configurations
   */
  static createLint(): void {
    createLint();
  }

  /**
   * Create all integrations
   */
  static createAll(): void {
    this.createCI();
    this.createIDE();
    this.createContainer();
    this.createLint();
  }
}

export default IntegrationManager;
