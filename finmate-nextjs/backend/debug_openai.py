import os
from openai import OpenAI
import logging

try:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    print(f"Client created. Has responses? {hasattr(client, 'responses')}")
    if hasattr(client, 'responses'):
        print(dir(client.responses))
    else:
        print("client.responses does not exist.")
        
    # Check what is available
    print("Available attributes:", dir(client))
except Exception as e:
    print(f"Error: {e}")
