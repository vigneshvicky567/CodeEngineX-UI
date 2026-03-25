const fs = require('fs');

function fixNavBarTypeErrors2(filename, activeTab) {
    let content = fs.readFileSync(filename, 'utf8');

    // Clean up residual `flex-col items-center justify-center px-5 py-2 active:scale-95`
    // My previous string replacement probably didn't handle the exact pattern.
    // Let's just generate the right navbar text directly using JS and no bash template literals

    function generateNavBar(active) {
        const isLearn = active === 'Learn';
        const isExplore = active === 'Explore';
        const isBadges = active === 'Badges';
        const isProfile = active === 'Profile';

        return `      {/* BottomNavBar */}
      <View className="absolute bottom-0 left-0 w-full z-50 flex-row justify-around items-center px-4 pb-6 pt-3 bg-white rounded-t-[2.5rem] border-t-4 border-[#d9eaff]">
        {/* Nav: Learn */}
        <Pressable
          onPress={() => navigation.navigate('Map')}
          className="flex-col items-center justify-center px-5 py-2 ${isLearn ? 'bg-[#d9eaff] rounded-2xl transform scale-110' : 'active:scale-95'}"
        >
          <MaterialIcons name="school" size={24} color="${isLearn ? '#1CB0F6' : '#94a3b8'}" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider mt-1 ${isLearn ? 'text-[#1CB0F6]' : 'text-slate-400'}">Learn</Text>
        </Pressable>
        {/* Nav: Explore */}
        <Pressable
          onPress={() => navigation.navigate('Explore')}
          className="flex-col items-center justify-center px-5 py-2 ${isExplore ? 'bg-[#d9eaff] rounded-2xl transform scale-110' : 'active:scale-95'}"
        >
          <MaterialIcons name="explore" size={24} color="${isExplore ? '#1CB0F6' : '#94a3b8'}" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider mt-1 ${isExplore ? 'text-[#1CB0F6]' : 'text-slate-400'}">Explore</Text>
        </Pressable>
        {/* Nav: Badges */}
        <Pressable
          onPress={() => navigation.navigate('Achievements')}
          className="flex-col items-center justify-center px-5 py-2 ${isBadges ? 'bg-[#d9eaff] rounded-2xl transform scale-110' : 'active:scale-95'}"
        >
          <MaterialIcons name="military-tech" size={24} color="${isBadges ? '#1CB0F6' : '#94a3b8'}" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider mt-1 ${isBadges ? 'text-[#1CB0F6]' : 'text-slate-400'}">Badges</Text>
        </Pressable>
        {/* Nav: Profile */}
        <Pressable
          onPress={() => navigation.navigate('Progress')}
          className="flex-col items-center justify-center px-5 py-2 ${isProfile ? 'bg-[#d9eaff] rounded-2xl transform scale-110' : 'active:scale-95'}"
        >
          <MaterialIcons name="person" size={24} color="${isProfile ? '#1CB0F6' : '#94a3b8'}" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider mt-1 ${isProfile ? 'text-[#1CB0F6]' : 'text-slate-400'}">Profile</Text>
        </Pressable>
      </View>`;
    }

    const navBarStart = content.indexOf('{/* BottomNavBar */}');
    if (navBarStart !== -1) {
        const navBarEnd = content.indexOf('</SafeAreaView>');
        if (navBarEnd !== -1) {
            content = content.substring(0, navBarStart) + generateNavBar(activeTab) + '\n    ' + content.substring(navBarEnd);
            fs.writeFileSync(filename, content);
            console.log(`Updated ${filename}`);
        }
    }
}

fixNavBarTypeErrors2('screens/Screen6.tsx', 'Learn');
fixNavBarTypeErrors2('screens/Screen7.tsx', 'Explore');
fixNavBarTypeErrors2('screens/Screen9.tsx', 'Badges');
fixNavBarTypeErrors2('screens/Screen11.tsx', 'Profile');
