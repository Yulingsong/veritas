/**
 * HTTP Client
 */

import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';

/**
 * HTTP Client options
 */
export interface HttpClientOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: string | Buffer;
  timeout?: number;
  followRedirects?: boolean;
  rejectUnauthorized?: boolean;
}

/**
 * HTTP Client response
 */
export interface HttpResponse<T = any> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: T;
  raw: string;
}

/**
 * HTTP Client
 */
export class HttpClient {
  private baseUrl?: string;
  private defaultHeaders: Record<string, string> = {};

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set default headers
   */
  setHeader(key: string, value: string): this {
    this.defaultHeaders[key] = value;
    return this;
  }

  /**
   * Set authorization header
   */
  setAuth(token: string): this {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    return this;
  }

  /**
   * Set content type
   */
  setContentType(contentType: string): this {
    this.defaultHeaders['Content-Type'] = contentType;
    return this;
  }

  /**
   * Make request
   */
  request<T = any>(url: string, options: HttpClientOptions = {}): Promise<HttpResponse<T>> {
    return new Promise((resolve, reject) => {
      const fullUrl = this.baseUrl ? new URL(url, this.baseUrl).toString() : url;
      const parsedUrl = new URL(fullUrl);
      const isHttps = parsedUrl.protocol === 'https:';
      const client = isHttps ? https : http;

      const headers = { ...this.defaultHeaders, ...options.headers };
      const body = options.body;

      if (body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      const req = client.request(
        {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || (isHttps ? 443 : 80),
          path: parsedUrl.pathname + parsedUrl.search,
          method: options.method || 'GET',
          headers,
          timeout: options.timeout || 30000,
          rejectUnauthorized: options.rejectUnauthorized !== false
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            const responseHeaders: Record<string, string> = {};
            Object.entries(res.headers).forEach(([key, value]) => {
              responseHeaders[key] = Array.isArray(value) ? value.join(', ') : value || '';
            });

            let body: any = data;
            if (responseHeaders['content-type']?.includes('application/json')) {
              try {
                body = JSON.parse(data);
              } catch {}
            }

            resolve({
              status: res.statusCode || 0,
              statusText: res.statusMessage || '',
              headers: responseHeaders,
              body,
              raw: data
            });
          });
        }
      );

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (body) {
        req.write(body);
      }

      req.end();
    });
  }

  /**
   * GET request
   */
  get<T = any>(url: string, options?: HttpClientOptions): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  post<T = any>(url: string, body?: any, options?: HttpClientOptions): Promise<HttpResponse<T>> {
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    return this.request<T>(url, { ...options, method: 'POST', body: bodyStr });
  }

  /**
   * PUT request
   */
  put<T = any>(url: string, body?: any, options?: HttpClientOptions): Promise<HttpResponse<T>> {
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    return this.request<T>(url, { ...options, method: 'PUT', body: bodyStr });
  }

  /**
   * DELETE request
   */
  delete<T = any>(url: string, options?: HttpClientOptions): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  patch<T = any>(url: string, body?: any, options?: HttpClientOptions): Promise<HttpResponse<T>> {
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    return this.request<T>(url, { ...options, method: 'PATCH', body: bodyStr });
  }
}

/**
 * Create HTTP client
 */
export function createClient(baseUrl?: string): HttpClient {
  return new HttpClient(baseUrl);
}

export default { HttpClient, createClient };
