import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import type { BuildMeta, DataEntry } from '../../types';
import { Builder } from '../builder';

const entry: DataEntry = { id: 'test-entry', author: 'संत कबीर दास साहेब', content: ['कबीर का दोहा', 'अर्थ सहित'] };

const meta: BuildMeta = { fileName: 'test-assets', mdTitle: 'Test Collection', data: [entry], appendNumber: false };

describe('Builder', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
  });

  it('should generate all asset formats into the output directory', async () => {
    const outputDir = join(tmpdir(), `builder-test-${Date.now()}`);
    tempDirs.push(outputDir);

    await Builder.run(meta, outputDir);

    const expectedFiles = ['raw.json', 'json', 'txt', 'md', 'csv'].map((ext) => `test-assets.${ext}`).sort();
    const written = (await fs.readdir(outputDir)).sort();
    expect(written).toEqual(expectedFiles);

    const jsonRaw = JSON.parse(await fs.readFile(join(outputDir, 'test-assets.raw.json'), 'utf8'));
    expect(jsonRaw).toHaveLength(1);
    expect(jsonRaw[0].id).toBe('test-entry');

    const md = await fs.readFile(join(outputDir, 'test-assets.md'), 'utf8');
    expect(md).toContain('# Test Collection');
    expect(md).toContain('कबीर का दोहा');
  });
});
