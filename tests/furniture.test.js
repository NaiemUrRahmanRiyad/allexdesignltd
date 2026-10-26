import test from 'node:test';
import assert from 'node:assert/strict';
import { furniture } from '../src/data/furniture.js';
import { filterFurniture } from '../src/data/filterFurniture.js';
test('search supports English and combines with collection groups', () => {
  assert.equal(filterFurniture(furniture.products).length,11);
  assert.equal(filterFurniture(furniture.products,'AF-800').length,1);
  assert.equal(filterFurniture(furniture.products,'sofa').length,2);
  assert.equal(filterFurniture(furniture.products,'','Lighting').length,0);
  assert.equal(filterFurniture(furniture.products,'sofa','Chairs').length,0);
  assert.equal(filterFurniture(furniture.products,'light brown','Sofas')[0].id,'light-brown-sofa');
  assert.equal(filterFurniture(furniture.products,'nonexistent').length,0);
});
