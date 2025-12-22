import logging
import time
from services.portfolio_service import fetch_company_profile, load_profiles
from db.client import supabase

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TICKER = "JPM"

print(f"--- Debugging Profile Fetch for {TICKER} ---")

# 1. Fetch
print(f"Fetching profile for {TICKER}...")
profile = fetch_company_profile(TICKER)
print("Fetch Result:", profile)

# 2. Check DB directly
if supabase:
    try:
        print("Checking DB for record...")
        res = supabase.table("company_profiles").select("*").eq("ticker", TICKER).execute()
        print("DB Result:", res.data)
        
        if not res.data:
            print("ERROR: Profile not found in DB after fetch!")
        else:
            print("SUCCESS: Profile verified in DB.")
    except Exception as e:
        print(f"DB Check Failed: {e}")
else:
    print("CRITICAL: Supabase client is not initialized!")

# 3. Check load_profiles service
print("Checking load_profiles() service...")
all_profiles = load_profiles()
if TICKER in all_profiles:
    print(f"SUCCESS: {TICKER} found in load_profiles()")
else:
    print(f"FAILURE: {TICKER} NOT found in load_profiles()")
