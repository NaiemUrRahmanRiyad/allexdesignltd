import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {businessSchema} from '../shared/business-schema.js';

test('business and service schema resolves to visible service anchors on each deployment',()=>{
  const html=fs.readFileSync('dist/index.html','utf8');
  for(const origin of ['https://www.allexdesign.com','https://allexdesignltd-preview.netlify.app']){
    const graph=businessSchema(origin)['@graph'];
    const business=graph.find(item=>item['@type']==='LocalBusiness');
    assert.equal(business.address.addressLocality,'Dhaka');
    const services=graph.filter(item=>item['@type']==='Service');
    assert.equal(services.length,3);
    for(const service of services){
      assert.ok(html.includes(`id="${new URL(service.url).hash.slice(1)}"`));
      assert.equal(service.provider['@id'],business['@id']);
      assert.ok(graph.some(item=>item['@id']===service['@id']));
    }
    assert.ok(!JSON.stringify(graph).includes('aggregateRating'));
  }
});
