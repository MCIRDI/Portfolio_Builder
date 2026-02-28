import requests

def test_backend():
    base_url = "https://portfolio-backend.onrender.com"
    
    print("=== BACKEND TEST ===")
    print(f"URL: {base_url}")
    
    try:
        response = requests.get(base_url, timeout=15)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
        
        if response.status_code == 404:
            print("DIAGNOSIS: Backend returns 404")
            print("- Check Render dashboard for deployment status")
            print("- Verify build logs for errors")
            print("- Ensure service is running")
            print("- The service may not be deployed correctly")
        
    except Exception as e:
        print(f"Error: {e}")
        print("DIAGNOSIS: Backend not accessible")
        print("- Service may be down")
        print("- URL may be incorrect")
        print("- Network connectivity issue")

if __name__ == "__main__":
    test_backend()
