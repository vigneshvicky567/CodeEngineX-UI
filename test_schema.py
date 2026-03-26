import os
import re

alembic_file = "editor-backend/alembic/versions/0001_create_tables.py"
with open(alembic_file, "r") as f:
    content = f.read()

# SQLite doesn't support the ENUM type creation block or the DO block
content = re.sub(r'op\.execute\("""\s*DO \$\$[\s\S]*?\$\$;\s*"""\)', 'pass', content)
# It might also complain about postgresql_uuid, but let's test.

with open(alembic_file, "w") as f:
    f.write(content)
