import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('measurement explanations are scoped to the two Retail scenes', () => {
  const content = readFileSync(new URL('../app/components/redesign/RetailMeasurementDetail.tsx', import.meta.url), 'utf8');
  assert.match(content, /segment !== "retail"\) return null/);
  assert.match(content, /scene === "retail-street-opportunity" \? "street" : scene === "retail-store-visits" \? "entrance" : null/);
  assert.match(content, /translations\[locale\]/);
});
