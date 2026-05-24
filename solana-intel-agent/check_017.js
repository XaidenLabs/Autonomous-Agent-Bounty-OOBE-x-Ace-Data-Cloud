const { execSync } = require('child_process');
const fs = require('fs');
execSync('mkdir temp_sdk && cd temp_sdk && npm init -y && npm install @oobe-protocol-labs/synapse-sap-sdk@0.17.0');
const code = fs.readFileSync('./temp_sdk/node_modules/@oobe-protocol-labs/synapse-sap-sdk/dist/cjs/instructions/escrow.js', 'utf8');
console.log(code.substring(code.indexOf('settleCallsV2'), code.indexOf('settleCallsV2') + 500));
