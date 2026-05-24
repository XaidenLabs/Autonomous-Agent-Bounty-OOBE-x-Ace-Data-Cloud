const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Xaiden Labs/.gemini/antigravity-ide/brain/83c67266-3ff8-4c50-ac8c-705178980d36/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');
console.log(lines.find(l => l.includes('step_index":585')).substring(4000, 6000));
