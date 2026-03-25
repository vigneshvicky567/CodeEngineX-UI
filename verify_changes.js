const fs = require('fs');

function checkFile(filename, mustContain, mustNotContain) {
    const content = fs.readFileSync(filename, 'utf8');
    let ok = true;
    for (const c of mustContain) {
        if (!content.includes(c)) {
            console.log(`❌ ${filename} is missing expected content: ${c}`);
            ok = false;
        }
    }
    for (const nc of mustNotContain) {
        if (content.includes(nc)) {
            console.log(`❌ ${filename} contains unexpected content: ${nc}`);
            ok = false;
        }
    }
    if (ok) console.log(`✅ ${filename} looks good.`);
}

checkFile('screens/Screen6.tsx', ["<Text className={`font-label font-bold text-[11px] uppercase tracking-wider mt-1 ${'Learn' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}`}>Profile</Text>"], []);
checkFile('screens/Screen7.tsx', ["<Text className={`font-label font-bold text-[11px] uppercase tracking-wider mt-1 ${'Explore' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}`}>Profile</Text>"], []);
checkFile('screens/Screen9.tsx', ["<Text className={`font-label font-bold text-[11px] uppercase tracking-wider mt-1 ${'Badges' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}`}>Profile</Text>"], []);
checkFile('screens/Screen11.tsx', ["<Text className={`font-label font-bold text-[11px] uppercase tracking-wider mt-1 ${'Profile' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}`}>Profile</Text>"], []);

checkFile('screens/Screen5.tsx', [], ["{/* BottomNavBar */}"]);
checkFile('screens/Screen8.tsx', ["navigation.navigate('MobileIDE');"], ["navigation.navigate('LessonComplete');"]);
checkFile('screens/Screen12.tsx', ["navigation.navigate('LessonComplete')"], []);
checkFile('screens/Screen10.tsx', ["navigation.navigate('MainTabs', { screen: 'Map' })"], ["navigation.navigate('MobileIDE')"]);
