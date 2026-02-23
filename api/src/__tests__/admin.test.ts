import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { initializeCurrencyConfig } from '../config';
import { Application } from 'express';

describe('Admin API Routes', () => {
  let app: Application;

  beforeAll(() => {
    process.env.CURRENCY_CONFIG_PATH = './config/currencies.json';
    initializeCurrencyConfig();
    app = createApp();
  });

  describe('GET /api/admin/stats', () => {
    it('should return platform statistics', async () => {
      const response = await request(app).get('/api/admin/stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('platform');
      expect(response.body.data).toHaveProperty('currencies');
      expect(response.body.data).toHaveProperty('system');
      expect(response.body.timestamp).toBeDefined();
    });

    it('should include platform status', async () => {
      const response = await request(app).get('/api/admin/stats');

      expect(response.body.data.platform.status).toBe('operational');
      expect(response.body.data.platform.uptime).toBeGreaterThanOrEqual(0);
      expect(response.body.data.platform.version).toBeDefined();
    });

    it('should include currency statistics', async () => {
      const response = await request(app).get('/api/admin/stats');

      expect(response.body.data.currencies.total).toBeGreaterThan(0);
      expect(Array.isArray(response.body.data.currencies.supported)).toBe(true);
    });

    it('should include system information', async () => {
      const response = await request(app).get('/api/admin/stats');

      expect(response.body.data.system.memory).toHaveProperty('used');
      expect(response.body.data.system.memory).toHaveProperty('total');
      expect(response.body.data.system.node_version).toBeDefined();
      expect(response.body.data.system.environment).toBeDefined();
    });
  });

  describe('GET /api/admin/health', () => {
    it('should return health check information', async () => {
      const response = await request(app).get('/api/admin/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('healthy');
      expect(response.body.data.checks).toBeDefined();
    });

    it('should include configuration health check', async () => {
      const response = await request(app).get('/api/admin/health');

      expect(response.body.data.checks.configuration).toHaveProperty('status');
      expect(response.body.data.checks.configuration).toHaveProperty('currencies_loaded');
      expect(response.body.data.checks.configuration.status).toBe('pass');
    });

    it('should include memory health check', async () => {
      const response = await request(app).get('/api/admin/health');

      expect(response.body.data.checks.memory).toHaveProperty('status');
      expect(response.body.data.checks.memory).toHaveProperty('usage_percent');
      expect(['pass', 'warn']).toContain(response.body.data.checks.memory.status);
    });

    it('should include uptime health check', async () => {
      const response = await request(app).get('/api/admin/health');

      expect(response.body.data.checks.uptime).toHaveProperty('status');
      expect(response.body.data.checks.uptime).toHaveProperty('seconds');
      expect(response.body.data.checks.uptime.status).toBe('pass');
      expect(response.body.data.checks.uptime.seconds).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /api/admin/config', () => {
    it('should return configuration summary', async () => {
      const response = await request(app).get('/api/admin/config');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('currencies');
      expect(response.body.data).toHaveProperty('environment');
      expect(response.body.data).toHaveProperty('rate_limiting');
    });

    it('should include currency configuration', async () => {
      const response = await request(app).get('/api/admin/config');

      expect(response.body.data.currencies.count).toBeGreaterThan(0);
      expect(Array.isArray(response.body.data.currencies.codes)).toBe(true);
    });

    it('should include environment configuration', async () => {
      const response = await request(app).get('/api/admin/config');

      expect(response.body.data.environment).toHaveProperty('node_env');
      expect(response.body.data.environment).toHaveProperty('port');
      expect(response.body.data.environment).toHaveProperty('config_path');
      expect(response.body.data.environment).toHaveProperty('overrides_enabled');
    });

    it('should include rate limiting configuration', async () => {
      const response = await request(app).get('/api/admin/config');

      expect(response.body.data.rate_limiting).toHaveProperty('window_ms');
      expect(response.body.data.rate_limiting).toHaveProperty('max_requests');
      expect(typeof response.body.data.rate_limiting.window_ms).toBe('number');
      expect(typeof response.body.data.rate_limiting.max_requests).toBe('number');
    });
  });

  describe('Response Format Consistency', () => {
    it('should return consistent response format across all endpoints', async () => {
      const endpoints = ['/api/admin/stats', '/api/admin/health', '/api/admin/config'];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);

        expect(response.body).toHaveProperty('success');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body.success).toBe(true);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', async () => {
      // This test verifies error handling structure
      // In a real scenario, we'd mock a failure condition
      const response = await request(app).get('/api/admin/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
