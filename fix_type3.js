const fs = require('fs');

function fix() {
    let s1 = fs.readFileSync('screens/Screen1.tsx', 'utf8');
    s1 = s1.replace(/if \(selectedPathId !== null\) \{/, 'if (selectedOption !== null) {');
    s1 = s1.replace(/PATH_OPTIONS\.find\(p => p\.id === selectedPathId\)\?\.id/, 'PATH_OPTIONS[selectedOption]?.id');
    fs.writeFileSync('screens/Screen1.tsx', s1);

    let s2 = fs.readFileSync('screens/Screen2.tsx', 'utf8');
    s2 = s2.replace(/if \(selectedLevelId !== null\) \{/, 'if (selectedOption !== null) {');
    s2 = s2.replace(/LEVELS\.find\(l => l\.id === selectedLevelId\)\?\.id/, 'LEVEL_OPTIONS[selectedOption]?.id');
    fs.writeFileSync('screens/Screen2.tsx', s2);

    let s3 = fs.readFileSync('screens/Screen3.tsx', 'utf8');
    s3 = s3.replace(/if \(selectedGoalId !== null\) \{/, 'if (selectedOption !== null) {');
    s3 = s3.replace(/GOALS\.find\(g => g\.id === selectedGoalId\)\?\.id/, 'GOAL_OPTIONS[selectedOption]?.id');
    fs.writeFileSync('screens/Screen3.tsx', s3);

    let s6 = fs.readFileSync('screens/Screen6.tsx', 'utf8');
    s6 = s6.replace(/activeTab="Learn" onTabPress=\{\(route: any\) => navigation.navigate\(route\)\}/, 'activeTab="Learn" onTabPress={(route: any) => navigation.navigate(route as any)}');
    fs.writeFileSync('screens/Screen6.tsx', s6);

    let s7 = fs.readFileSync('screens/Screen7.tsx', 'utf8');
    s7 = s7.replace(/activeTab="Explore" onTabPress=\{\(route: any\) => navigation.navigate\(route\)\}/, 'activeTab="Explore" onTabPress={(route: any) => navigation.navigate(route as any)}');
    fs.writeFileSync('screens/Screen7.tsx', s7);

    let s9 = fs.readFileSync('screens/Screen9.tsx', 'utf8');
    s9 = s9.replace(/activeTab="Badges" onTabPress=\{\(route: any\) => navigation.navigate\(route\)\}/, 'activeTab="Badges" onTabPress={(route: any) => navigation.navigate(route as any)}');
    fs.writeFileSync('screens/Screen9.tsx', s9);
}

fix();
