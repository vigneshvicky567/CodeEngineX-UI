import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Add auth check logic
import_logic = """
import { useAuthStore } from './store/authStore';
import { getToken } from './lib/auth';
"""

content = content.replace("import './global.css';", "import './global.css';\n" + import_logic)

boot_logic = """
  useEffect(() => {
    async function checkToken() {
      const token = await getToken();
      if (token) {
        useAuthStore.getState().setLoggedIn(true);
      }
    }
    checkToken();
  }, []);
"""

content = content.replace("export default function App() {", "export default function App() {\n" + boot_logic)

with open('App.tsx', 'w') as f:
    f.write(content)
