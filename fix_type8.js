const fs = require('fs');

function fix() {
    let s6 = fs.readFileSync('screens/Screen6.tsx', 'utf8');
    s6 = s6.replace(/<BottomNavBar tabs=\{NAV_TABS\} activeTab="Learn" onTabPress=\{\(route: any\) => navigation.navigate\(route as never\)\} \/>/, '<BottomNavBar tabs={NAV_TABS} activeTab="Learn" />');
    fs.writeFileSync('screens/Screen6.tsx', s6);

    let s7 = fs.readFileSync('screens/Screen7.tsx', 'utf8');
    s7 = s7.replace(/<BottomNavBar tabs=\{NAV_TABS\} activeTab="Explore" onTabPress=\{\(route: any\) => navigation.navigate\(route as never\)\} \/>/, '<BottomNavBar tabs={NAV_TABS} activeTab="Explore" />');
    fs.writeFileSync('screens/Screen7.tsx', s7);

    let s9 = fs.readFileSync('screens/Screen9.tsx', 'utf8');
    s9 = s9.replace(/<BottomNavBar tabs=\{NAV_TABS\} activeTab="Badges" onTabPress=\{\(route: any\) => navigation.navigate\(route as never\)\} \/>/, '<BottomNavBar tabs={NAV_TABS} activeTab="Badges" />');
    fs.writeFileSync('screens/Screen9.tsx', s9);
}
fix();
