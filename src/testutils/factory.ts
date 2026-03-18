/**
 * Test Data Factory
 */

import { generateRandom } from './fixtures.js';

/**
 * Factory for creating test data
 */
export class DataFactory<T> {
  private defaults: Partial<T>;
  private sequence: number = 0;

  constructor(defaults: Partial<T> = {}) {
    this.defaults = defaults;
  }

  /**
   * Create single instance
   */
  create(overrides: Partial<T> = {}): T {
    this.sequence++;
    return {
      ...this.defaults,
      ...overrides,
      id: this.sequence
    } as T;
  }

  /**
   * Create multiple instances
   */
  createMany(count: number, overrides: Partial<T> = {}): T[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create with sequence
   */
  createSequence(overrides: Partial<T> = {}): T {
    return this.create(overrides);
  }
}

/**
 * Built-in factories
 */
export const factories = {
  user(overrides: any = {}): any {
    return {
      id: generateRandom.id(),
      name: generateRandom.name(),
      email: generateRandom.email(),
      ...overrides
    };
  },

  post(overrides: any = {}): any {
    return {
      id: generateRandom.id(),
      title: `Post Title ${Math.floor(Math.random() * 1000)}`,
      content: 'Post content...',
      author: generateRandom.name(),
      published: generateRandom.boolean(),
      createdAt: generateRandom.date().toISOString(),
      ...overrides
    };
  },

  comment(overrides: any = {}): any {
    return {
      id: generateRandom.id(),
      body: 'Comment body...',
      postId: generateRandom.id(),
      author: generateRandom.name(),
      createdAt: generateRandom.date().toISOString(),
      ...overrides
    };
  },

  product(overrides: any = {}): any {
    return {
      id: generateRandom.id(),
      name: `Product ${Math.floor(Math.random() * 1000)}`,
      price: parseFloat((Math.random() * 100).toFixed(2)),
      sku: `SKU-${Math.floor(Math.random() * 10000)}`,
      inStock: generateRandom.boolean(),
      ...overrides
    };
  },

  order(overrides: any = {}): any {
    return {
      id: generateRandom.id(),
      userId: generateRandom.id(),
      items: [],
      total: parseFloat((Math.random() * 500).toFixed(2)),
      status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
      createdAt: generateRandom.date().toISOString(),
      ...overrides
    };
  }
};

/**
 * Sequence generator
 */
export class Sequence {
  private current: number = 0;

  next(): number {
    return ++this.current;
  }

  reset(): void {
    this.current = 0;
  }

  set(value: number): void {
    this.current = value;
  }
}

/**
 * Faker wrapper (simple implementation)
 */
export const faker = {
  name: () => generateRandom.name(),
  email: () => generateRandom.email(),
  id: () => generateRandom.id(),
  date: () => generateRandom.date(),
  boolean: () => generateRandom.boolean(),
  phone: () => generateRandom.phone(),
  url: () => generateRandom.url(),
  
  // Custom methods
  word: () => {
    const words = ['hello', 'world', 'test', 'data', 'user', 'post', 'comment', 'product'];
    return words[Math.floor(Math.random() * words.length)];
  },
  
  sentence: () => {
    const count = Math.floor(Math.random() * 10) + 3;
    return Array.from({ length: count }, () => faker.word()).join(' ');
  },
  
  paragraph: () => {
    const count = Math.floor(Math.random() * 5) + 2;
    return Array.from({ length: count }, () => faker.sentence()).join('. ');
  },
  
  address: () => {
    return `${Math.floor(Math.random() * 1000)} ${faker.word()} St, ${faker.word()} City`;
  },
  
  company: () => {
    const prefixes = ['Tech', 'Digital', 'Global', 'Smart'];
    const suffixes = ['Corp', 'Inc', 'Labs', 'Solutions'];
    return `${faker.word()} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  }
};

// Re-export from fixtures
const { generators: generateRandom } = require('./fixtures');

export default { DataFactory, factories, Sequence, faker };
