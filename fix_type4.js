const fs = require('fs');

function fix() {
    let s12 = fs.readFileSync('screens/Screen12.tsx', 'utf8');
    if (!s12.includes("import React, { useState, useEffect } from 'react';")) {
       s12 = s12.replace("import React from 'react';\nimport { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';");
       if (!s12.includes("import { get, post } from '../lib/api';")) {
           s12 = s12.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { get, post } from '../lib/api';");
       }
    } else {
       if (!s12.includes("import { get, post } from '../lib/api';")) {
           s12 = s12.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { get, post } from '../lib/api';");
       }
    }
    fs.writeFileSync('screens/Screen12.tsx', s12);

    let s8 = fs.readFileSync('screens/Screen8.tsx', 'utf8');
    if (!s8.includes("import React, { useState, useEffect } from 'react';")) {
       s8 = s8.replace("import React from 'react';\nimport { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';");
    }
    if (!s8.includes("import { get, post } from '../lib/api';")) {
        s8 = s8.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { get, post } from '../lib/api';");
    }
    if (!s8.includes("import { useLessonStore } from '../store/lessonStore';")) {
        s8 = s8.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useLessonStore } from '../store/lessonStore';");
    }
    fs.writeFileSync('screens/Screen8.tsx', s8);
}
fix();
