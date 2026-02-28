import requests

def test_new_backend():
    base_url = "https://portfolio-builder-7i56.onrender.com"
    
    print("=== TESTING NEW BACKEND URL ===")
    print(f"URL: {base_url}")
    
    try:
        response = requests.get(f"{base_url}/health/", timeout=15)
        print(f"Health Status: {response.status_code}")
        print(f"Health Response: {response.text}")
        
        # Test CORS preflight
        headers = {
            "Origin": "https://buildmyfolio.vercel.app",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type"
        }
        response = requests.options(f"{base_url}/accounts/login/", headers=headers, timeout=15)
        print(f"CORS Preflight Status: {response.status_code}")
        cors_headers = {k: v for k, v in response.headers.items() if 'access-control' in k.lower()}
        print(f"CORS Headers: {cors_headers}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_new_backend()
