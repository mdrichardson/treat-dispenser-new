#!/bin/bash
sed -i "/onFetch(event) {/,/const req = event.request;/c onFetch(event){const req=event.request;const whitelist=['particle','api','3000', 'youtube'];if(whitelist.some(word=>req.url.toLowerCase().includes(word.toLowerCase()))){return}" ./dist/treat-dispenser/ngsw-worker.js
echo Added whitelist to ngsw-worker.js
sed -i -e "/\/\/# sourceMappingURL=ngsw_worker.es6.js.map/d" ./dist/treat-dispenser/ngsw-worker.js
echo Removed sourceMapping from ngsw-worker.js