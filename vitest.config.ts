/**
 * ========================================================================
 * Vitest Configuration
 * ========================================================================
 * Purpose: Test runner config for unit tests with coverage.
 * Docs:    https://vitest.dev/config/
 * ========================================================================
 */

import { resolve } from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Shorthand for src/ imports
  resolve: { alias: { '@': resolve(import.meta.dirname, 'src') } },

  // --- Tests Configs ---
  test: {
    // Node environment (no browser/DOM needed for CLI utils)
    environment: 'node',

    // Mocks console output to reduce test noise
    setupFiles: ['./vitest.setup.ts'],

    // Allow `describe`, `it`, `expect`, `vi` without imports
    globals: true,

    // Test file patterns
    include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],

    // V8-based coverage with text/JSON/HTML reports
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'node_modules/',
        'vitest.config.ts',
        'vitest.setup.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/dist/',
        '**/build/',
      ],
    },
  },
});
