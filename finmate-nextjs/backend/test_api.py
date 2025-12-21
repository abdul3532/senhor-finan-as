import requests
import json

def test_api():
    try:
        response = requests.get("http://localhost:8000/api/portfolio")
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print("KEYS:", data.keys())
        print("TICKERS:", data.get("tickers"))
        profiles = data.get("profiles", {})
        print("PROFILES KEYS:", profiles.keys())
        
        if "PLTR" in profiles:
            print("PLTR PROFILE FOUND:")
            print(json.dumps(profiles["PLTR"], indent=2))
        else:
            print("PLTR PROFILE MISSING!")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
