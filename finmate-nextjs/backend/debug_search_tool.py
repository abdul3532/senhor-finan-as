from tools.search import perform_web_search
import logging

# Configure logging to see output
logging.basicConfig(level=logging.INFO)

print("Testing Web Search Tool...")
try:
    result = perform_web_search("current stock price of Nvidia")
    print("\n--- RESULT ---")
    print(result)
except Exception as e:
    print(f"\n--- ERROR ---")
    print(e)
