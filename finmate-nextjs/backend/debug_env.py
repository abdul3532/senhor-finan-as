from dotenv import load_dotenv
import os
from pathlib import Path

# Try strictly local .env
env_path = Path(".env")
print(f"Checking {env_path.absolute()}")
print(f"Exists: {env_path.exists()}")

# Try loading
success = load_dotenv(dotenv_path=env_path, override=True)
print(f"Load success: {success}")

# Check key
key = os.environ.get('OPENAI_API_KEY')
print(f"Key present: {key is not None}")

if key:
    print(f"Key length: {len(key)}")
    print(f"First 10 chars: {key[:10]}")
else:
    # Read file manually to check content
    if env_path.exists():
        try:
            content = env_path.read_text(encoding='utf-8')
            print("File content (first 50 chars):", content[:50])
        except Exception as e:
            print(f"Error reading file utf-8: {e}")
            try:
                content = env_path.read_text(encoding='utf-16')
                print("File content (utf-16):", content[:50])
            except Exception as e2:
                print(f"Error reading file utf-16: {e2}")
