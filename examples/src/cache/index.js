import { Chain, ChainCacheEnabled, ChainStrictModeEnabled, ExecuteChain } from 'fluid-chains';

import fs from 'fs';
import path from 'path';
import profiler from 'v8-profiler';

new Chain('$001', (context, param, next) => {
    console.log('context.$owner()', context.$owner());
    for (let i = 0; i < 800; i++) {
        context.set('$' + i, 'hello');
    }
    setTimeout(() => {
        next();
    }, 800);
}, '$002');
new Chain('$002', (context, param, next) => {
    console.log('context.$owner()', context.$owner());
    for (let i = 0; i < 800; i++) {
        context.set('$' + i, 'hello');
    }
    setTimeout(() => {
        next();
    }, 800);
}, '$003');

new Chain('$003', (context, param, next) => {
    console.log('context.$owner()', context.$owner());
    for (let i = 0; i < 800; i++) {
        context.set('$' + i, 'hello');
    }
    setTimeout(() => {
        next();
    }, 800);
}, '$004');

new Chain('$004', (context, param, next) => {
    console.log('context.$owner()', context.$owner());
    for (let i = 0; i < 800; i++) {
        context.set('$' + i, 'hello');
    }
    setTimeout(() => {
        next();
    }, 800);
});


ExecuteChain('$001', {}, () => {
    let snapshot = profiler.takeSnapshot();
    snapshot.export()
        .pipe(fs.createWriteStream('snapshot.heapsnapshot'));
});


