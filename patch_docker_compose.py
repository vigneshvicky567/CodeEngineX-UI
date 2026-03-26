import yaml

with open('docker-compose.yml', 'r') as f:
    target = yaml.safe_load(f)

with open('editor-backend/docker-compose.yml', 'r') as f:
    source = yaml.safe_load(f)

# Merge services (excluding frontend since we have app)
for service_name, service_config in source.get('services', {}).items():
    if service_name == 'frontend':
        continue

    # Adjust build context if needed
    if 'build' in service_config and isinstance(service_config['build'], dict):
        if service_config['build'].get('context') == '.':
            service_config['build']['context'] = './editor-backend'

    target.setdefault('services', {})[service_name] = service_config

# Merge volumes
if 'volumes' in source:
    target.setdefault('volumes', {})
    for vol_name, vol_config in source['volumes'].items():
        target['volumes'][vol_name] = vol_config

with open('docker-compose.yml', 'w') as f:
    yaml.dump(target, f, sort_keys=False)

print("Patch successful!")
