/**
 * Mocker Tests
 */

import { describe, it, expect } from 'vitest';
import { MockGenerator } from '../src/mocker/index.js';

describe('MockGenerator', () => {
  const mockTrafficData = {
    requests: [
      { url: 'https://api.example.com/users', method: 'GET' }
    ],
    responses: [
      { url: 'https://api.example.com/users', status: 200, body: '{"id":1,"name":"John"}' }
    ],
    stats: { totalRequests: 1 }
  };

  describe('toMSW', () => {
    it('should generate MSW handlers', () => {
      const generator = new MockGenerator(mockTrafficData as any);
      const result = generator.toMSW();
      expect(result).toContain('msw');
      expect(result).toContain('http.get');
    });
  });

  describe('toVitest', () => {
    it('should generate Vitest mocks', () => {
      const generator = new MockGenerator(mockTrafficData as any);
      const result = generator.toVitest();
      expect(result).toContain('vi.fn');
    });
  });

  describe('toJsonServer', () => {
    it('should generate JSON Server config', () => {
      const generator = new MockGenerator(mockTrafficData as any);
      const result = generator.toJsonServer();
      expect(result).toBeDefined();
    });
  });
});
