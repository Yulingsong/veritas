/**
 * WebSocket Utilities
 */

/**
 * WebSocket client for testing
 */
export class WSClient {
  private socket: WebSocket | null = null;
  private messages: WSMessage[] = [];
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Connect to WebSocket
   */
  async connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      this.socket = new WebSocket(url);

      this.socket.onopen = () => resolve();
      this.socket.onerror = (err) => reject(err);
      this.socket.onmessage = (event) => {
        const message: WSMessage = {
          data: event.data,
          timestamp: Date.now()
        };
        this.messages.push(message);
        this.emit('message', message);
      };
      this.socket.onclose = () => {
        this.emit('close', {});
      };
    });
  }

  /**
   * Send message
   */
  send(data: any): void {
    if (this.socket) {
      this.socket.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }

  /**
   * Close connection
   */
  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    for (const cb of callbacks) {
      cb(data);
    }
  }

  /**
   * Get messages
   */
  getMessages(): WSMessage[] {
    return this.messages;
  }

  /**
   * Clear messages
   */
  clearMessages(): void {
    this.messages = [];
  }
}

export interface WSMessage {
  data: any;
  timestamp: number;
}

/**
 * Mock WebSocket for testing
 */
export class MockWebSocket {
  private messages: any[] = [];
  public readyState = 0; // CONNECTING

  send(data: any): void {
    this.messages.push(data);
  }

  close(): void {
    this.readyState = 3; // CLOSED
  }

  // Event handlers
  onopen: (() => void) | null = null;
  onmessage: ((event: any) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: ((error: any) => void) | null = null;

  // Simulate connection
  simulateOpen(): void {
    this.readyState = 1; // OPEN
    if (this.onopen) this.onopen();
  }

  simulateMessage(data: any): void {
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(data) });
    }
  }

  simulateClose(): void {
    this.readyState = 3;
    if (this.onclose) this.onclose();
  }
}

export default { WSClient, MockWebSocket };
