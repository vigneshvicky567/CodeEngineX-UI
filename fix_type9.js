const fs = require('fs');

function fix() {
    let s6 = fs.readFileSync('screens/Screen6.tsx', 'utf8');
    s6 = s6.replace(/\{ name: 'Profile', icon: 'person', route: 'Progress' \}/, "{ name: 'Progress', icon: 'person', route: 'Progress' }");
    fs.writeFileSync('screens/Screen6.tsx', s6);

    let s7 = fs.readFileSync('screens/Screen7.tsx', 'utf8');
    s7 = s7.replace(/\{ name: 'Profile', icon: 'person', route: 'Progress' \}/, "{ name: 'Progress', icon: 'person', route: 'Progress' }");
    fs.writeFileSync('screens/Screen7.tsx', s7);

    let s9 = fs.readFileSync('screens/Screen9.tsx', 'utf8');
    s9 = s9.replace(/\{ name: 'Profile', icon: 'person', route: 'Progress' \}/, "{ name: 'Progress', icon: 'person', route: 'Progress' }");
    fs.writeFileSync('screens/Screen9.tsx', s9);
}
fix();
