/**
 * Color & Formatting Utilities
 */

import * as readline from 'readline';

/**
 * Console colors
 */
export const Colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  // Foreground
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m'
  },

  // Background
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m'
  }
};

/**
 * Format text
 */
export function format(text: string, options: {
  color?: keyof typeof Colors.fg;
  bg?: keyof typeof Colors.bg;
  bold?: boolean;
  dim?: boolean;
  underline?: boolean;
} = {}): string {
  let result = '';

  if (options.bold) result += Colors.bright;
  if (options.dim) result += Colors.dim;
  if (options.underline) result += Colors.underscore;
  if (options.color) result += Colors.fg[options.color];
  if (options.bg) result += Colors.bg[options.bg];

  result += text + Colors.reset;

  return result;
}

/**
 * Progress bar
 */
export class ProgressBar {
  private total: number;
  private current: number = 0;
  private width: number;
  private startTime: number;

  constructor(total: number, width: number = 40) {
    this.total = total;
    this.width = width;
    this.startTime = Date.now();
  }

  /**
   * Update progress
   */
  update(current: number): void {
    this.current = current;
    this.render();
  }

  /**
   * Increment progress
   */
  increment(): void {
    this.current++;
    this.render();
  }

  /**
   * Render progress bar
   */
  private render(): void {
    const percent = Math.min(100, (this.current / this.total) * 100);
    const filled = Math.floor((this.width * this.current) / this.total);
    const bar = '█'.repeat(filled) + '░'.repeat(this.width - filled);
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);

    readline.clearLine(process.stdout, 0);
    process.stdout.write(`\r[${bar}] ${percent.toFixed(1)}% (${this.current}/${this.total}) ${elapsed}s`);

    if (this.current >= this.total) {
      process.stdout.write('\n');
    }
  }

  /**
   * Stop progress bar
   */
  stop(): void {
    this.current = this.total;
    this.render();
  }
}

/**
 * Spinner
 */
export class Spinner {
  private frames: string[] = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private index: number = 0;
  private interval?: NodeJS.Timeout;
  private message: string;

  constructor(message: string = 'Loading...') {
    this.message = message;
  }

  /**
   * Start spinner
   */
  start(): void {
    this.interval = setInterval(() => {
      readline.clearLine(process.stdout, 0);
      process.stdout.write(`\r${this.frames[this.index]} ${this.message}`);
      this.index = (this.index + 1) % this.frames.length;
    }, 80);
  }

  /**
   * Stop spinner
   */
  stop(message?: string): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    readline.clearLine(process.stdout, 0);
    if (message) {
      console.log(message);
    }
  }
}

/**
 * Table printer
 */
export function printTable(headers: string[], rows: string[][]): void {
  const colWidths = headers.map((h, i) => 
    Math.max(h.length, ...rows.map(r => (r[i] || '').length))
  );

  // Header
  console.log(colWidths.map((w, i) => headers[i].padEnd(w)).join(' | '));
  console.log(colWidths.map(w => '-'.repeat(w)).join('-+-'));

  // Rows
  for (const row of rows) {
    console.log(row.map((c, i) => (c || '').padEnd(colWidths[i])).join(' | '));
  }
}

export default { Colors, format, ProgressBar, Spinner, printTable };
