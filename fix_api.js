const fs = require('fs');
let file = fs.readFileSync('lib/api.ts', 'utf8');
file = file.replace(/\\`Bearer \\\\\\\${token}\\`/g, "`Bearer ${token}`");
file = file.replace(/\\`/g, "`");
file = file.replace(/\\\$/g, "$");

fs.writeFileSync('lib/api.ts', file);
