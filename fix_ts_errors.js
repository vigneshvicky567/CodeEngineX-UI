const fs = require('fs');
['screens/Screen6.tsx', 'screens/Screen7.tsx', 'screens/Screen9.tsx'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\${'[a-zA-Z]+' === 'Profile' \? 'text-\[#1CB0F6\]' : 'text-slate-400'}/g, "\${('Learn' as string) === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}");
    fs.writeFileSync(file, content);
});
