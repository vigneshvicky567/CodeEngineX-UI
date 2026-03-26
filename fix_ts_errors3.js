const fs = require('fs');

function revert(file, find, replace) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(find, replace);
    fs.writeFileSync(file, content);
}

revert('screens/Screen6.tsx', /\$\{'Learn' === \('Profile' as string\) \? 'text-\[#1CB0F6\]' : 'text-slate-400'\}/g, "\${'Learn' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}");
revert('screens/Screen7.tsx', /\$\{'Explore' === \('Profile' as string\) \? 'text-\[#1CB0F6\]' : 'text-slate-400'\}/g, "\${'Explore' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}");
revert('screens/Screen9.tsx', /\$\{'Badges' === \('Profile' as string\) \? 'text-\[#1CB0F6\]' : 'text-slate-400'\}/g, "\${'Badges' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}");
