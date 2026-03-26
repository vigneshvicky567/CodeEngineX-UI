const fs = require('fs');
let file = fs.readFileSync('App.tsx', 'utf8');
file = file.replace(
`cssInterop(Path, { className: 'style' });
cssInterop(Rect, { className: 'style' });
cssInterop(Circle, { className: 'style' });`,
`cssInterop(Path, { className: { target: 'style' } as any });
cssInterop(Rect, { className: { target: 'style' } as any });
cssInterop(Circle, { className: { target: 'style' } as any });`
);
fs.writeFileSync('App.tsx', file);
