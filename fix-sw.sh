#!/bin/bash
sed -i "/onFetch(event) {/,/const req = event.request;/c onFetch(event){const req=event.request;const whitelist=['particle','api','3000'];if(whitelist.some(word=>req.url.toLowerCase().includes(word.toLowerCase()))){return}" ./dist/treat-dispenser/ngsw-worker.js