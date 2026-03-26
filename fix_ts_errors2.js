const fs = require('fs');

function revert(file, from, to) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(from, to);
    fs.writeFileSync(file, content);
}

revert('screens/Screen6.tsx', /\$\{\('Learn' as string\) === 'Profile' \? 'text-\[#1CB0F6\]' : 'text-slate-400'\}/, "\${'Learn' === ('Profile' as string) ? 'text-[#1CB0F6]' : 'text-slate-400'}");
revert('screens/Screen7.tsx', /\$\{\('Learn' as string\) === 'Profile' \? 'text-\[#1CB0F6\]' : 'text-slate-400'\}/, "\${'Explore' === ('Profile' as string) ? 'text-[#1CB0F6]' : 'text-slate-400'}");
revert('screens/Screen9.tsx', /\$\{\('Learn' as string\) === 'Profile' \? 'text-\[#1CB0F6\]' : 'text-slate-400'\}/, "\${'Badges' === ('Profile' as string) ? 'text-[#1CB0F6]' : 'text-slate-400'}");
