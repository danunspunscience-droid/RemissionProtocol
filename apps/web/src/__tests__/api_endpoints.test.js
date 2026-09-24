import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Remission Protocol API & Auth Middleware Contracts', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects unauthenticated requests to protected /api/client/metrics', async () => {
    const mockResponse = { error: 'Unauthorized: Missing authentication token' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => mockResponse,
    });

    const res = await fetch('/api/client/metrics');
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toContain('Unauthorized');
  });

  it('allows authenticated requests when Bearer token is provided', async () => {
    const mockPayload = {
      client: { name: 'Dr. Daniel Test Client', email: 'test@remissionprotocol.com' },
      metrics: [{ id: 'm1', metric_type: 'glucose', metric_value: 88.5, unit: 'mg/dL' }],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockPayload,
    });

    const res = await fetch('/api/client/metrics', {
      headers: { Authorization: 'Bearer valid_test_token' },
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.client.email).toBe('test@remissionprotocol.com');
    expect(data.metrics.length).toBeGreaterThan(0);
  });
});
