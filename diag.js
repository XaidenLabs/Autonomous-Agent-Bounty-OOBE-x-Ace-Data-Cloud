const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const lines = c.split('\n');

let depth = 0;
let inBody = false;

lines.forEach((l, i) => {
  if (l.includes('<body>')) { inBody = true; return; }
  if (!inBody) return;
  
  const lineNum = i + 1;
  const o = (l.match(/<div/g) || []).length;
  const cl = (l.match(/<\/div>/g) || []).length;
  
  if (l.includes('<div class="wrap"')) {
    console.log('WRAP OPENS at line', lineNum, 'depth before:', depth);
  }
  
  const prevDepth = depth;
  depth += o - cl;
  
  if (lineNum >= 1436 && depth === 0 && prevDepth > 0) {
    console.log('Depth returns to 0 at line', lineNum, 'content:', l.trim().substring(0,80));
  }
});
