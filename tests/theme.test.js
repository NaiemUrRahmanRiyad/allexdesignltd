import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveTheme } from '../shared/theme.js';
test('explicit theme overrides device preference; invalid/unset choice follows device', () => {
  assert.equal(resolveTheme('light',true),'light'); assert.equal(resolveTheme('dark',false),'dark'); assert.equal(resolveTheme(null,true),'dark'); assert.equal(resolveTheme(null,false),'light'); assert.equal(resolveTheme('invalid',true),'dark');
});
