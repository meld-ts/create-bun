import { describe, expect, test } from 'bun:test';
import { getCurrentDir } from './index';

describe('getCurrentDir', () => {
  test('returns a non-empty string', () => {
    const dir = getCurrentDir();
    expect(typeof dir).toBe('string');
    expect(dir.length).toBeGreaterThan(0);
  });

  test('returns an absolute path', () => {
    const dir = getCurrentDir();
    expect(dir.startsWith('/') || /^[A-Z]:\\/i.test(dir)).toBe(true);
  });
});
