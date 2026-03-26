const fs = require('fs');

function fix() {
    let s1 = fs.readFileSync('screens/Screen1.tsx', 'utf8');
    s1 = s1.replace(/if \(selectedOption !== null\) \{/, 'if (selectedPath !== null) {');
    s1 = s1.replace(/PATH_OPTIONS\[selectedOption\]\?\.id/, 'PATH_OPTIONS[selectedPath]?.id');
    s1 = s1.replace('const handleContinue = async () => {\n    if (selectedPath !== null) {', 'const handleContinue = async () => {\n    if (selectedPath !== null) {');
    s1 = s1.replace('path: PATH_OPTIONS[selectedPath]?.id', 'path: PATH_OPTIONS[selectedPath]?.id');
    // Ensure PATH_OPTIONS exists or revert
    fs.writeFileSync('screens/Screen1.tsx', s1);

    let s12 = fs.readFileSync('screens/Screen12.tsx', 'utf8');
    if (!s12.includes("import { useState, useEffect } from 'react';")) {
        s12 = s12.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';");
    }
    if (!s12.includes("import { get, post } from '../lib/api';")) {
        s12 = s12.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { get, post } from '../lib/api';");
    }
    fs.writeFileSync('screens/Screen12.tsx', s12);

    let s8 = fs.readFileSync('screens/Screen8.tsx', 'utf8');
    if (!s8.includes("import { useState, useEffect } from 'react';")) {
        s8 = s8.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';");
    }
    if (!s8.includes("import { get, post } from '../lib/api';")) {
        s8 = s8.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { get, post } from '../lib/api';");
    }
    if (!s8.includes("import { useLessonStore } from '../store/lessonStore';")) {
        s8 = s8.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useLessonStore } from '../store/lessonStore';");
    }
    // Fix duplicate handleCheck
    s8 = s8.replace(/const handleCheck = \(\) => \{\n.*?\}\n  \};\n\n  const handleContinue/s, 'const handleContinue');
    fs.writeFileSync('screens/Screen8.tsx', s8);
}
fix();
