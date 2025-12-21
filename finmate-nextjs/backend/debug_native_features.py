import os
import logging
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    print(f"Client initialized.")
    
    # Check attributes
    print(f"Has 'responses'? {hasattr(client, 'responses')}")
    print(f"Has 'beta'? {hasattr(client, 'beta')}")
    
    if hasattr(client, 'responses'):
        print("Attempting client.responses.create...")
        try:
            resp = client.responses.create(
                model="gpt-4o",
                input=[{"role":"user", "content":"What is the price of Bitcoin today?"}],
                tools=[{"type":"web_search"}]
            )
            print("Response:", resp)
        except Exception as inner_e:
            print(f"Call failed: {inner_e}")
    else:
        print("client.responses does NOT exist.")
        # Check if it's under beta?
        # print("Dir of client:", dir(client))

except Exception as e:
    print(f"General Error: {e}")
