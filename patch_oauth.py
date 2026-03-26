import re

with open('screens/Screen4.tsx', 'r') as f:
    content = f.read()

# find divider and buttons
start_divider = content.find('{/* Divider */}')
end_google = content.find('{/* Sign Up Link */}')

if start_divider != -1 and end_google != -1:
    section_to_comment = content[start_divider:end_google]
    commented_section = '/*' + section_to_comment + '*/\n          '
    content = content[:start_divider] + commented_section + content[end_google:]

with open('screens/Screen4.tsx', 'w') as f:
    f.write(content)
