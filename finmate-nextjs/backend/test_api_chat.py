import requests
import json
import uuid

BASE_URL = "http://localhost:8000/api/chat"

def test_chat_flow():
    print("--- Testing Chat Persistence ---")
    
    # 1. Start New Chat
    print("\n1. Starting New Chat...")
    payload_new = {
        "query": "Hello, this is a test session.",
        "portfolio": ["AAPL"]
    }
    response = requests.post(BASE_URL, json=payload_new)
    
    if response.status_code != 200:
        print(f"FAILED to start chat: {response.text}")
        return
        
    data = response.json()
    conv_id = data.get("conversation_id")
    print(f"   Success! Conversation ID: {conv_id}")
    print(f"   Response: {data.get('content')[:50]}...")

    if not conv_id:
        print("   ERROR: No conversation_id returned.")
        return

    # 2. Verify History
    print("\n2. Verifying History...")
    res_history = requests.get(f"{BASE_URL}/history")
    if res_history.status_code == 200:
        history = res_history.json()
        found = any(c['id'] == conv_id for c in history)
        print(f"   History Count: {len(history)}")
        print(f"   Found new conversation in history: {found}")
    else:
        print(f"   FAILED to get history: {res_history.text}")

    # 3. Continue Chat
    print("\n3. Sending Follow-up...")
    payload_follow = {
        "query": "What did I just say?",
        "conversation_id": conv_id
    }
    res_follow = requests.post(BASE_URL, json=payload_follow)
    if res_follow.status_code == 200:
        print("   Success! Follow-up response received.")
    else:
        print(f"   FAILED follow-up: {res_follow.text}")

    # 4. Verify Messages
    print("\n4. Retrieving Message Log...")
    res_msgs = requests.get(f"{BASE_URL}/{conv_id}/messages")
    if res_msgs.status_code == 200:
        msgs = res_msgs.json()
        print(f"   Total Messages: {len(msgs)}")
        for m in msgs:
            print(f"   - [{m['role']}]: {m['content'][:30]}...")
    else:
        print(f"   FAILED to get messages: {res_msgs.text}")

if __name__ == "__main__":
    test_chat_flow()
