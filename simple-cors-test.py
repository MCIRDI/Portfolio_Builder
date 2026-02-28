import requests

def test_backend():
    base_url = "https://portfolio-backend.onrender.com"
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health/", timeout=10)
        print(f"Health Status: {response.status_code}")
        print(f"Health Response: {response.text}")
    except Exception as e:
        print(f"Health Error: {e}")
    
    # Test login endpoint with CORS headers
    try:
        headers = {
            "Origin": "https://buildmyfolio.vercel.app",
            "Content-Type": "application/json"
        }
        data = {"username": "test", "password": "test"}
        response = requests.post(f"{base_url}/accounts/login/", json=data, headers=headers, timeout=10)
        print(f"Login Status: {response.status_code}")
        print(f"Login Headers: {dict(response.headers)}")
        print(f"Login Response: {response.text}")
    except Exception as e:
        print(f"Login Error: {e}")

if __name__ == "__main__":
    test_backend()
