const fs = require('fs');

function fix() {
    let s6 = fs.readFileSync('screens/Screen6.tsx', 'utf8');
    s6 = s6.replace(/\$\{'Learn' === 'Profile' \? 'text-\[\#1CB0F6\]' : 'text-slate-400'\}/g, 'text-slate-400');
    fs.writeFileSync('screens/Screen6.tsx', s6);

    let s7 = fs.readFileSync('screens/Screen7.tsx', 'utf8');
    s7 = s7.replace(/\$\{'Explore' === 'Profile' \? 'text-\[\#1CB0F6\]' : 'text-slate-400'\}/g, 'text-slate-400');
    fs.writeFileSync('screens/Screen7.tsx', s7);

    let s9 = fs.readFileSync('screens/Screen9.tsx', 'utf8');
    s9 = s9.replace(/\$\{'Badges' === 'Profile' \? 'text-\[\#1CB0F6\]' : 'text-slate-400'\}/g, 'text-slate-400');
    fs.writeFileSync('screens/Screen9.tsx', s9);
}
fix();
