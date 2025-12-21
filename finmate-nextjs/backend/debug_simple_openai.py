import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("OPENAI_API_KEY")
print(f"API Key present: {bool(api_key)}")
if api_key:
    print(f"API Key starts with: {api_key[:8]}...")

try:
    client = OpenAI(api_key=api_key)
    print("Testing standard chat completion...")
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Hello, are you working?"}],
        max_tokens=10
    )
    print(f"Response received: {response.choices[0].message.content}")
except Exception as e:
    print(f"ERROR: {e}")
