import test from 'node:test';
import assert from 'node:assert/strict';
import { mobileViewportState } from '../shared/mobile-viewport.js';
test('visual viewport detects keyboard overlays and preserves iOS viewport offsets',()=>{
 assert.deepEqual(mobileViewportState({width:390,height:340,layoutHeight:844,baselineHeight:844,offsetTop:80,editable:true}),{mobile:true,height:340,top:80,keyboard:true});
 assert.equal(mobileViewportState({width:390,height:844,layoutHeight:844,baselineHeight:844,editable:true}).keyboard,false);
});
test('keyboard detection works when the browser also resizes its layout viewport',()=>{
 assert.equal(mobileViewportState({width:360,height:350,layoutHeight:350,baselineHeight:800,editable:true}).keyboard,true);
 assert.equal(mobileViewportState({width:360,height:800,layoutHeight:800,baselineHeight:800,editable:false}).keyboard,false);
});
test('desktop resizing and non-editable mobile browsing do not trigger keyboard layout',()=>{
 assert.equal(mobileViewportState({width:1280,height:400,layoutHeight:900,baselineHeight:900,editable:true}).keyboard,false);
 assert.equal(mobileViewportState({width:390,height:400,layoutHeight:844,baselineHeight:844,editable:false}).keyboard,false);
});
test('landscape phones also receive the keyboard-safe viewport layout',()=>{
 assert.equal(mobileViewportState({width:844,height:220,layoutHeight:390,baselineHeight:390,editable:true}).keyboard,true);
});
