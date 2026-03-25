const fs = require('fs');

function fixNavBarTypeErrors(filename, activeTab) {
    let content = fs.readFileSync(filename, 'utf8');
    // Replace the problematic comparison ${'Learn' === 'Learn'} with actual logic since it currently has hardcoded ${'Learn'} instead of ${activeTab} due to bash variable escaping issue.
    // Notice in my previous script I used \${'${activeTab}' === ... which ended up literally writing ${'Learn' === 'Profile'}.
    // I need to just fix the template literal in the react components.

    // Replace all instances of `${'Learn' === ...}` or similar with proper React logic.
    // Wait, the file actually says: className={`flex-col items-center justify-center px-5 py-2 ${'Learn' === 'Profile' ? ... `
    // TypeScript complains about 'Learn' === 'Profile' because they have no overlap.

    // I will just read the file and do a regex replace to clean it up.

    content = content.replace(/\$\{'Learn' === 'Learn'/g, 'true');
    content = content.replace(/\$\{'Learn' === 'Explore'/g, 'false');
    content = content.replace(/\$\{'Learn' === 'Badges'/g, 'false');
    content = content.replace(/\$\{'Learn' === 'Profile'/g, 'false');

    content = content.replace(/\$\{'Explore' === 'Learn'/g, 'false');
    content = content.replace(/\$\{'Explore' === 'Explore'/g, 'true');
    content = content.replace(/\$\{'Explore' === 'Badges'/g, 'false');
    content = content.replace(/\$\{'Explore' === 'Profile'/g, 'false');

    content = content.replace(/\$\{'Badges' === 'Learn'/g, 'false');
    content = content.replace(/\$\{'Badges' === 'Explore'/g, 'false');
    content = content.replace(/\$\{'Badges' === 'Badges'/g, 'true');
    content = content.replace(/\$\{'Badges' === 'Profile'/g, 'false');

    content = content.replace(/\$\{'Profile' === 'Learn'/g, 'false');
    content = content.replace(/\$\{'Profile' === 'Explore'/g, 'false');
    content = content.replace(/\$\{'Profile' === 'Badges'/g, 'false');
    content = content.replace(/\$\{'Profile' === 'Profile'/g, 'true');

    // Remove false ? '...' : '...'
    // Simplify: `${true ? 'A' : 'B'}` -> `A`
    content = content.replace(/\$\{true \? '([^']+)' \: '([^']+)'\}/g, '$1');
    content = content.replace(/\$\{false \? '([^']+)' \: '([^']+)'\}/g, '$2');

    fs.writeFileSync(filename, content);
}

fixNavBarTypeErrors('screens/Screen6.tsx', 'Learn');
fixNavBarTypeErrors('screens/Screen7.tsx', 'Explore');
fixNavBarTypeErrors('screens/Screen9.tsx', 'Badges');
fixNavBarTypeErrors('screens/Screen11.tsx', 'Profile');
