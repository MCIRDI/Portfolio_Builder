import requests
import json

def test_cors():
    url = "https://portfolio-backend.onrender.com/accounts/login/"
    
    # Test OPTIONS request (CORS preflight)
    headers = {
        "Origin": "https://buildmyfolio.vercel.app",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type"
    }
    
    try:
        response = requests.options(url, headers=headers, timeout=10)
        print(f"OPTIONS Status: {response.status_code}")
        print(f"CORS Headers: {dict(response.headers)}")
        
        # Check for required CORS headers
        cors_headers = [
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Methods',
            'Access-Control-Allow-Headers'
        ]
        
        missing_headers = [h for h in cors_headers if h not in response.headers]
        if missing_headers:
            print(f"❌ Missing CORS headers: {missing_headers}")
        else:
            print("✅ All required CORS headers present")
            
    except Exception as e:
        print(f"❌ Error testing OPTIONS: {e}")
    
    # Test POST request
    try:
        data = {"username": "test", "password": "test"}
        headers = {
            "Origin": "https://buildmyfolio.vercel.app",
            "Content-Type": "application/json"
        }
        
        response = requests.post(url, json=data, headers=headers, timeout=10)
        print(f"POST Status: {response.status_code}")
        print(f"POST CORS Headers: {dict(response.headers)}")
        
        if 'Access-Control-Allow-Origin' in response.headers:
            print("✅ POST request has CORS headers")
        else:
            print("❌ POST request missing CORS headers")
            
    except Exception as e:
        print(f"❌ Error testing POST: {e}")

if __name__ == "__main__":
    test_cors()
