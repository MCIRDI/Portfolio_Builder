import requests
import time

def test_backend_comprehensive():
    base_url = "https://portfolio-backend.onrender.com"
    
    print("=== FINAL BACKEND TEST ===")
    print(f"Testing URL: {base_url}")
    print()
    
    # Test 1: Basic connectivity
    try:
        response = requests.get(base_url, timeout=15)
        print(f"✓ Basic connectivity: {response.status_code}")
        print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"✗ Basic connectivity failed: {e}")
    
    # Test 2: Health endpoint
    try:
        response = requests.get(f"{base_url}/health/", timeout=15)
        print(f"✓ Health endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"  Health data: {response.text}")
        else:
            print(f"  Response: {response.text}")
    except Exception as e:
        print(f"✗ Health endpoint failed: {e}")
    
    # Test 3: CORS preflight
    try:
        headers = {
            "Origin": "https://buildmyfolio.vercel.app",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type"
        }
        response = requests.options(f"{base_url}/accounts/login/", headers=headers, timeout=15)
        print(f"✓ CORS preflight: {response.status_code}")
        cors_headers = {k: v for k, v in response.headers.items() if 'access-control' in k.lower()}
        print(f"  CORS headers: {cors_headers}")
    except Exception as e:
        print(f"✗ CORS preflight failed: {e}")
    
    print("\n=== DIAGNOSIS ===")
    
    # Check if it's a deployment issue
    try:
        response = requests.get(base_url, timeout=5)
        if response.status_code == 404:
            print("⚠️  Backend returns 404 - likely deployment issue")
            print("   - Check Render dashboard for deployment status")
            print("   - Verify build logs for errors")
            print("   - Ensure service is running")
        elif response.status_code == 200:
            print("✓ Backend is accessible")
        else:
            print(f"⚠️  Unexpected status: {response.status_code}")
    except Exception as e:
        print(f"✗ Backend not accessible: {e}")

if __name__ == "__main__":
    test_backend_comprehensive()
