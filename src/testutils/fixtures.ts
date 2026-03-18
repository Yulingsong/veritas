/**
 * Test Fixtures
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Fixture loader
 */
export class FixtureLoader {
  private fixturesDir: string;

  constructor(fixturesDir: string = '__fixtures__') {
    this.fixturesDir = fixturesDir;
  }

  /**
   * Load JSON fixture
   */
  loadJSON<T>(name: string): T {
    const filePath = path.join(this.fixturesDir, `${name}.json`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Fixture not found: ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  /**
   * Load text fixture
   */
  loadText(name: string): string {
    const filePath = path.join(this.fixturesDir, `${name}.txt`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Fixture not found: ${filePath}`);
    }
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Load file as buffer
   */
  loadBinary(name: string): Buffer {
    const filePath = path.join(this.fixturesDir, name);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Fixture not found: ${filePath}`);
    }
    return fs.readFileSync(filePath);
  }

  /**
   * List all fixtures
   */
  list(): string[] {
    if (!fs.existsSync(this.fixturesDir)) {
      return [];
    }
    return fs.readdirSync(this.fixturesDir);
  }
}

/**
 * Common test fixtures
 */
export const commonFixtures = {
  user: {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  },

  users: [
    { id: 1, name: 'User 1', email: 'user1@example.com' },
    { id: 2, name: 'User 2', email: 'user2@example.com' }
  ],

  post: {
    id: 1,
    title: 'Test Post',
    content: 'Post content',
    author: 'Test User',
    published: true
  },

  error: {
    code: 'ERROR_CODE',
    message: 'Test error message'
  }
};

/**
 * Mock data generators
 */
export const generators = {
  /**
   * Generate random ID
   */
  id(): string {
    return Math.random().toString(36).substring(2, 15);
  },

  /**
   * Generate random email
   */
  email(): string {
    return `test${Math.floor(Math.random() * 10000)}@example.com`;
  },

  /**
   * Generate random name
   */
  name(): string {
    const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie'];
    const lastNames = ['Smith', 'Doe', 'Johnson', 'Williams'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  },

  /**
   * Generate random date
   */
  date(): Date {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  },

  /**
   * Generate random boolean
   */
  boolean(): boolean {
    return Math.random() > 0.5;
  },

  /**
   * Generate random item from array
   */
  pick<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  },

  /**
   * Generate random phone number
   */
  phone(): string {
    return `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
  },

  /**
   * Generate random URL
   */
  url(): string {
    const protocols = ['http', 'https'];
    const domains = ['example.com', 'test.com', 'demo.org'];
    return `${generators.pick(protocols)}://${generators.pick(domains)}/${generators.id()}`;
  }
};

export default { FixtureLoader, commonFixtures, generators };
