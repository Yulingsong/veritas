/**
 * File Watcher
 */

import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter } from 'events';

/**
 * File watcher events
 */
export interface FileChangeEvent {
  type: 'add' | 'change' | 'unlink';
  path: string;
  timestamp: Date;
}

/**
 * File watcher
 */
export class FileWatcher extends EventEmitter {
  private watchers: Map<string, fs.FSWatcher> = new Map();
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private debounceMs: number;

  constructor(debounceMs: number = 100) {
    super();
    this.debounceMs = debounceMs;
  }

  /**
   * Watch file or directory
   */
  watch(targetPath: string, recursive: boolean = false): void {
    if (this.watchers.has(targetPath)) {
      return;
    }

    const watcher = fs.watch(targetPath, { recursive }, (eventType, filename) => {
      if (!filename) return;
      
      const fullPath = path.join(targetPath, filename);
      this.handleChange(eventType as any, fullPath);
    });

    this.watchers.set(targetPath, watcher);
  }

  /**
   * Handle file change
   */
  private handleChange(type: 'add' | 'change' | 'unlink', filePath: string): void {
    // Debounce
    const existing = this.debounceTimers.get(filePath);
    if (existing) {
      clearTimeout(existing);
    }

    const timer = setTimeout(() => {
      this.emit('change', {
        type,
        path: filePath,
        timestamp: new Date()
      } as FileChangeEvent);
      this.debounceTimers.delete(filePath);
    }, this.debounceMs);

    this.debounceTimers.set(filePath, timer);
  }

  /**
   * Stop watching
   */
  unwatch(targetPath?: string): void {
    if (targetPath) {
      const watcher = this.watchers.get(targetPath);
      if (watcher) {
        watcher.close();
        this.watchers.delete(targetPath);
      }
    } else {
      // Close all
      for (const watcher of this.watchers.values()) {
        watcher.close();
      }
      this.watchers.clear();
    }
  }

  /**
   * Watch glob pattern
   */
  watchGlob(patterns: string[]): void {
    // Simple implementation - could be enhanced with glob
    for (const pattern of patterns) {
      const dir = path.dirname(pattern);
      this.watch(dir, true);
    }
  }
}

export default FileWatcher;
