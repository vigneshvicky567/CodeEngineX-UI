import re
import os

def fix_screen1():
    with open('screens/Screen1.tsx', 'r') as f:
        content = f.read()
    content = content.replace("selectedPath", "selectedOption")
    with open('screens/Screen1.tsx', 'w') as f:
        f.write(content)

def fix_screen2():
    with open('screens/Screen2.tsx', 'r') as f:
        content = f.read()
    content = content.replace("selectedLevel", "selectedOption")
    with open('screens/Screen2.tsx', 'w') as f:
        f.write(content)

def fix_screen12():
    with open('screens/Screen12.tsx', 'r') as f:
        content = f.read()
    if 'import { useState, useEffect }' not in content:
         content = content.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';\nimport { get, post } from '../lib/api';")
    with open('screens/Screen12.tsx', 'w') as f:
        f.write(content)

def fix_screen13():
    with open('screens/Screen13.tsx', 'r') as f:
        content = f.read()
    content = content.replace("response.message", "(response as any).message")
    with open('screens/Screen13.tsx', 'w') as f:
        f.write(content)

def fix_screen14():
    with open('screens/Screen14.tsx', 'r') as f:
        content = f.read()
    content = content.replace("response.message", "(response as any).message")
    with open('screens/Screen14.tsx', 'w') as f:
        f.write(content)

def fix_screen8():
    with open('screens/Screen8.tsx', 'r') as f:
        content = f.read()
    if 'import { useLessonStore }' not in content:
        content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useLessonStore } from '../store/lessonStore';\nimport { post } from '../lib/api';")
    # Remove duplicates
    content = re.sub(r'const handleCheck = \(\) => \{.*?(?=  const handleContinue)', '', content, flags=re.DOTALL)
    with open('screens/Screen8.tsx', 'w') as f:
        f.write(content)

fix_screen1()
fix_screen2()
fix_screen12()
fix_screen13()
fix_screen14()
fix_screen8()
