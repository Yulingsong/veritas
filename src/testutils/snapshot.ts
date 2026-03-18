/**
 * Snapshot Testing Utilities
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Snapshot state manager
 */
export class SnapshotState {
  private snapshots: Map<string, string> = new Map();
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.load();
  }

  /**
   * Load snapshots from file
   */
  private load(): void {
    if (fs.existsSync(this.filePath)) {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      const data = JSON.parse(content);
      this.snapshots = new Map(Object.entries(data));
    }
  }

  /**
   * Save snapshots to file
   */
  save(): void {
    const data = Object.fromEntries(this.snapshots);
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  /**
   * Get snapshot
   */
  get(name: string): string | undefined {
    return this.snapshots.get(name);
  }

  /**
   * Set snapshot
   */
  set(name: string, value: string): void {
    this.snapshots.set(name, value);
  }

  /**
   * Check if snapshot exists
   */
  has(name: string): boolean {
    return this.snapshots.has(name);
  }

  /**
   * Get all snapshot names
   */
  keys(): string[] {
    return Array.from(this.snapshots.keys());
  }
}

/**
 * Inline snapshot updater
 */
export class InlineSnapshot {
  /**
   * Update inline snapshots in file
   */
  static update(filePath: string, snapshots: Record<string, string>): void {
    let content = fs.readFileSync(filePath, 'utf-8');

    for (const [name, value] of Object.entries(snapshots)) {
      const regex = new RegExp(`(toMatchInlineSnapshot\\()([^)]*\\))`);
      content = content.replace(regex, `$1${JSON.stringify(value)}$2`);
    }

    fs.writeFileSync(filePath, content);
  }

  /**
   * Extract inline snapshots from file
   */
  static extract(filePath: string): Record<string, string> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const snapshots: Record<string, string> = {};

    const regex = /toMatchInlineSnapshot\((["'`])((?:(?!\1).)+)\1\)/g;
    let match;
    let index = 0;

    while ((match = regex.exec(content)) !== null) {
      snapshots[`snapshot_${index}`] = match[2];
      index++;
    }

    return snapshots;
  }
}

/**
 * Snapshot serializer
 */
export const serializers = {
  /**
   * Serialize DOM element
   */
  element(element: any): string {
    if (!element) return 'null';
    
    const tag = element.tagName?.toLowerCase() || 'unknown';
    const id = element.id ? `#${element.id}` : '';
    const classes = element.className ? `.${element.className.split(' ').join('.')}` : '';
    
    return `<${tag}${id}${classes}>`;
  },

  /**
   * Serialize error
   */
  error(error: Error): string {
    return `${error.name}: ${error.message}`;
  },

  /**
   * Serialize date
   */
  date(date: Date): string {
    return date.toISOString();
  },

  /**
   * Serialize object (sorted keys)
   */
  object(obj: any): string {
    return JSON.stringify(obj, Object.keys(obj).sort(), 2);
  }
};

export default { SnapshotState, InlineSnapshot, serializers };
