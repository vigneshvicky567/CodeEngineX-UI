const fs = require('fs');

function fix() {
    let s1 = fs.readFileSync('screens/Screen1.tsx', 'utf8');
    s1 = s1.replace(/if \(selectedPath !== null\) \{/, 'if (selectedPathId !== null) {');
    s1 = s1.replace(/PATH_OPTIONS\[selectedPath\]\?\.id/, 'PATH_OPTIONS.find((p: any) => p.id === selectedPathId)?.id');
    fs.writeFileSync('screens/Screen1.tsx', s1);

    let s2 = fs.readFileSync('screens/Screen2.tsx', 'utf8');
    s2 = s2.replace(/if \(selectedOption !== null\) \{/, 'if (selectedLevelId !== null) {');
    s2 = s2.replace(/LEVEL_OPTIONS\[selectedOption\]\?\.id/, 'LEVELS.find((l: any) => l.id === selectedLevelId)?.id');
    fs.writeFileSync('screens/Screen2.tsx', s2);

    let s12 = fs.readFileSync('screens/Screen12.tsx', 'utf8');
    s12 = s12.replace("import React from 'react';\nimport { useState, useEffect } from 'react';\nimport { get, post } from '../lib/api';", "import React, { useState, useEffect } from 'react';\nimport { get, post } from '../lib/api';");
    fs.writeFileSync('screens/Screen12.tsx', s12);

    let s8 = fs.readFileSync('screens/Screen8.tsx', 'utf8');
    s8 = s8.replace("import React from 'react';\nimport { useState, useEffect } from 'react';\nimport { get, post } from '../lib/api';\nimport { useLessonStore } from '../store/lessonStore';", "import React, { useState, useEffect } from 'react';\nimport { get, post } from '../lib/api';\nimport { useLessonStore } from '../store/lessonStore';");
    // Completely nuke any existing handleCheck
    s8 = s8.replace(/const handleCheck = async \(\) => \{\n.*?\}\n    \}\n  \};\n/s, '');
    fs.writeFileSync('screens/Screen8.tsx', s8);
}
fix();
