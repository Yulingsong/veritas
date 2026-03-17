// Traffic Recorder - Browser traffic capture with Playwright

import { chromium, type Browser, type Page, type CDPSession } from 'playwright';
import type { TrafficData, NetworkRequest, NetworkResponse } from '../types.js';

export class TrafficRecorder {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private requests: NetworkRequest[] = [];
  private responses: NetworkResponse[] = [];

  /**
   * Start recording traffic
   */
  async start(url: string, options: { headless?: boolean } = {}): Promise<void> {
    this.browser = await chromium.launch({ 
      headless: options.headless ?? true 
    });

    const context = await this.browser.newContext();
    this.page = await context.newPage();

    // Get CDP session
    const client = await context.newCDPSession(this.page);
    
    // Enable network tracking
    await client.send('Network.enable' as any);

    // Listen for requests
    client.on('Network.requestWillBeSent' as any, (params: any) => {
      this.requests.push({
        id: params.requestId,
        url: params.request.url,
        urlShort: this.shortenUrl(params.request.url),
        method: params.request.method,
        headers: params.request.headers,
        postData: params.request.postData,
        timestamp: params.timestamp
      });
    });

    // Listen for responses
    client.on('Network.responseReceived' as any, (params: any) => {
      this.responses.push({
        requestId: params.requestId,
        url: params.response.url,
        status: params.response.status,
        statusText: params.response.statusText,
        headers: params.response.headers,
        timing: 0
      });
    });

    // Navigate to URL
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Wait for interaction
   */
  async waitForInteraction(durationMs: number = 5000): Promise<void> {
    await this.page?.waitForTimeout(durationMs);
  }

  /**
   * Get traffic data
   */
  async stop(): Promise<TrafficData> {
    // Get storage
    let localStorage: Record<string, string> = {};
    let sessionStorage: Record<string, string> = {};

    if (this.page) {
      try {
        const storage = await this.page.evaluate(() => {
          const local: Record<string, string> = {};
          const session: Record<string, string> = {};
          return { local, session };
        });
        localStorage = storage.local;
        sessionStorage = storage.session;
      } catch {}
    }

    const stats = {
      totalRequests: this.requests.length,
      byMethod: this.requests.reduce((acc, r) => {
        acc[r.method] = (acc[r.method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byStatus: this.responses.reduce((acc, r) => {
        const cat = Math.floor(r.status / 100) + 'xx';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      slowRequests: 0
    };

    const data: TrafficData = {
      requests: this.requests,
      responses: this.responses,
      localStorage,
      sessionStorage,
      cookies: {},
      stats
    };

    await this.browser?.close();
    this.browser = null;
    this.page = null;

    return data;
  }

  private shortenUrl(url: string): string {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  }
}

export default TrafficRecorder;
