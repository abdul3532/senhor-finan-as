import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("OPENAI_API_KEY")
print(f"Loaded Key: {api_key[:10]}...{api_key[-5:] if api_key else 'None'}")

client = OpenAI(api_key=api_key)

try:
    print("Attempting to generate content with gpt-4o...")
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": "Explain 'API' in 5 words."}
        ]
    )
    print(f"Success! Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"Error: {e}")
