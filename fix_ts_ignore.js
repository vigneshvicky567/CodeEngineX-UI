const fs = require('fs');
['screens/Screen6.tsx', 'screens/Screen7.tsx', 'screens/Screen9.tsx'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<Text className=\{\`font-label font-bold text-\[11px\] uppercase tracking-wider mt-1 \$\{/g, "\n        {/* @ts-ignore */}\n        <Text className={\`font-label font-bold text-[11px] uppercase tracking-wider mt-1 \${");
    fs.writeFileSync(file, content);
});
