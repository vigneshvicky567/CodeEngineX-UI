const fs = require('fs');

function fix() {
    let s6 = fs.readFileSync('screens/Screen6.tsx', 'utf8');
    s6 = s6.replace(/\{ name: 'Profile', icon: 'person', route: 'Progress' \}/, "{ name: 'Progress', icon: 'person', route: 'Progress' }");
    s6 = s6.replace(/activeTab="Learn"/, 'activeTab="Learn"');
    fs.writeFileSync('screens/Screen6.tsx', s6);
}
fix();
