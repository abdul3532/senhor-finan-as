import requests
import json

BASE_URL = "http://localhost:8000/api/news"

def test_news_refresh():
    print("Testing /refresh endpoint...")
    try:
        response = requests.post(f"{BASE_URL}/refresh")
        if response.status_code == 200:
            print("Refresh Success!")
            news = response.json()
            print(f"Received {len(news)} articles.")
            if news:
                print(f"Sample: {news[0].get('headline')}")
        else:
            print(f"Refresh Failed: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def test_news_get():
    print("\nTesting / (GET) endpoint...")
    try:
        response = requests.get(BASE_URL)
        if response.status_code == 200:
            print("Get Success!")
            news = response.json()
            print(f"Fetched {len(news)} persisted articles.")
        else:
            print(f"Get Failed: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_news_refresh()
    test_news_get()
