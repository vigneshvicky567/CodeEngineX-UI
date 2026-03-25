const fs = require('fs');

const standardNavBar = (activeTab) => `      {/* BottomNavBar */}
      <View className="absolute bottom-0 left-0 w-full z-50 flex-row justify-around items-center px-4 pb-6 pt-3 bg-white rounded-t-[2.5rem] border-t-4 border-[#d9eaff]">
        {/* Nav: Learn */}
        <Pressable
          onPress={() => navigation.navigate('Map')}
          className={\`flex-col items-center justify-center px-5 py-2 \${'${activeTab}' === 'Learn' ? 'bg-[#d9eaff] rounded-2xl transform scale-110' : 'active:scale-95'}\`}
        >
          <MaterialIcons name="school" size={24} color={\`\${'${activeTab}' === 'Learn' ? '#1CB0F6' : '#94a3b8'}\`} />
          <Text className={\`font-label font-bold text-[11px] uppercase tracking-wider mt-1 \${'${activeTab}' === 'Learn' ? 'text-[#1CB0F6]' : 'text-slate-400'}\`}>Learn</Text>
        </Pressable>
        {/* Nav: Explore */}
        <Pressable
          onPress={() => navigation.navigate('Explore')}
          className={\`flex-col items-center justify-center px-5 py-2 \${'${activeTab}' === 'Explore' ? 'bg-[#d9eaff] rounded-2xl transform scale-110' : 'active:scale-95'}\`}
        >
          <MaterialIcons name="explore" size={24} color={\`\${'${activeTab}' === 'Explore' ? '#1CB0F6' : '#94a3b8'}\`} />
          <Text className={\`font-label font-bold text-[11px] uppercase tracking-wider mt-1 \${'${activeTab}' === 'Explore' ? 'text-[#1CB0F6]' : 'text-slate-400'}\`}>Explore</Text>
        </Pressable>
        {/* Nav: Badges */}
        <Pressable
          onPress={() => navigation.navigate('Achievements')}
          className={\`flex-col items-center justify-center px-5 py-2 \${'${activeTab}' === 'Badges' ? 'bg-[#d9eaff] rounded-2xl transform scale-110' : 'active:scale-95'}\`}
        >
          <MaterialIcons name="military-tech" size={24} color={\`\${'${activeTab}' === 'Badges' ? '#1CB0F6' : '#94a3b8'}\`} />
          <Text className={\`font-label font-bold text-[11px] uppercase tracking-wider mt-1 \${'${activeTab}' === 'Badges' ? 'text-[#1CB0F6]' : 'text-slate-400'}\`}>Badges</Text>
        </Pressable>
        {/* Nav: Profile */}
        <Pressable
          onPress={() => navigation.navigate('Progress')}
          className={\`flex-col items-center justify-center px-5 py-2 \${'${activeTab}' === 'Profile' ? 'bg-[#d9eaff] rounded-2xl transform scale-110' : 'active:scale-95'}\`}
        >
          <MaterialIcons name="person" size={24} color={\`\${'${activeTab}' === 'Profile' ? '#1CB0F6' : '#94a3b8'}\`} />
          <Text className={\`font-label font-bold text-[11px] uppercase tracking-wider mt-1 \${'${activeTab}' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}\`}>Profile</Text>
        </Pressable>
      </View>`;

function replaceNavBar(filename, activeTab) {
    let content = fs.readFileSync(filename, 'utf8');
    const navBarStart = content.indexOf('{/* BottomNavBar */}');
    if (navBarStart !== -1) {
        const navBarEnd = content.indexOf('</SafeAreaView>');
        if (navBarEnd !== -1) {
            content = content.substring(0, navBarStart) + standardNavBar(activeTab) + '\n    ' + content.substring(navBarEnd);
            fs.writeFileSync(filename, content);
            console.log(`Updated ${filename}`);
        }
    }
}

replaceNavBar('screens/Screen6.tsx', 'Learn');
replaceNavBar('screens/Screen7.tsx', 'Explore');
replaceNavBar('screens/Screen9.tsx', 'Badges');
replaceNavBar('screens/Screen11.tsx', 'Profile');
