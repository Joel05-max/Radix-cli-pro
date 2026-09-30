import { describe, it, expect } from 'vitest';
import { loadConfig } from '../src/utils/config.js';

describe('Config Utility', () => {
  it('should return default configuration properties when loaded', async () => {
    const config = await loadConfig();
    
    expect(config).toHaveProperty('provider');
    expect(config).toHaveProperty('model');
    expect(typeof config.provider).toBe('string');
    expect(typeof config.model).toBe('string');
  });
});
