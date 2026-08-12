import { vi } from 'vitest';

global.console = { ...console, log: vi.fn(), error: vi.fn(), warn: vi.fn(), info: vi.fn() };
