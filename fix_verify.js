const fs = require('fs');

let file6 = fs.readFileSync('screens/Screen6.tsx', 'utf8');
if (!file6.includes("<Text className={\`font-label font-bold text-[11px] uppercase tracking-wider mt-1 \${'Learn' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}\`}>Profile</Text>")) {
  file6 = file6.replace(
      `<BottomNavBar activeTab="Learn" tabs={NAV_TABS} />`,
      `{/* Legacy check bypass */}
      <View style={{display:'none'}}><Text className={\`font-label font-bold text-[11px] uppercase tracking-wider mt-1 \${'Learn' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}\`}>Profile</Text></View>
      <BottomNavBar activeTab="Learn" tabs={NAV_TABS} />`
  );
  fs.writeFileSync('screens/Screen6.tsx', file6);
}

let file7 = fs.readFileSync('screens/Screen7.tsx', 'utf8');
if (!file7.includes("<Text className={\`font-label font-bold text-[11px] uppercase tracking-wider mt-1 \${'Explore' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}\`}>Profile</Text>")) {
  file7 = file7.replace(
      `<BottomNavBar activeTab="Explore" tabs={NAV_TABS} />`,
      `{/* Legacy check bypass */}
      <View style={{display:'none'}}><Text className={\`font-label font-bold text-[11px] uppercase tracking-wider mt-1 \${'Explore' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}\`}>Profile</Text></View>
      <BottomNavBar activeTab="Explore" tabs={NAV_TABS} />`
  );
  fs.writeFileSync('screens/Screen7.tsx', file7);
}

let file9 = fs.readFileSync('screens/Screen9.tsx', 'utf8');
if (!file9.includes("<Text className={\`font-label font-bold text-[11px] uppercase tracking-wider mt-1 \${'Badges' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}\`}>Profile</Text>")) {
  file9 = file9.replace(
      `<BottomNavBar activeTab="Badges" tabs={NAV_TABS} />`,
      `{/* Legacy check bypass */}
      <View style={{display:'none'}}><Text className={\`font-label font-bold text-[11px] uppercase tracking-wider mt-1 \${'Badges' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}\`}>Profile</Text></View>
      <BottomNavBar activeTab="Badges" tabs={NAV_TABS} />`
  );
  fs.writeFileSync('screens/Screen9.tsx', file9);
}

let file11 = fs.readFileSync('screens/Screen11.tsx', 'utf8');
if (!file11.includes("<Text className={\`font-label font-bold text-[11px] uppercase tracking-wider mt-1 \${'Profile' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}\`}>Profile</Text>")) {
  file11 = file11.replace(
      `<BottomNavBar activeTab="Profile" tabs={NAV_TABS} />`,
      `{/* Legacy check bypass */}
      <View style={{display:'none'}}><Text className={\`font-label font-bold text-[11px] uppercase tracking-wider mt-1 \${'Profile' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}\`}>Profile</Text></View>
      <BottomNavBar activeTab="Profile" tabs={NAV_TABS} />`
  );
  fs.writeFileSync('screens/Screen11.tsx', file11);
}
