import requests

def test_backend_status():
    base_url = "https://portfolio-backend.onrender.com"
    
    print("Testing backend availability...")
    
    # Test with different headers to see if it's a host issue
    headers_list = [
        {},
        {"Host": "portfolio-backend.onrender.com"},
        {"User-Agent": "Mozilla/5.0"},
    ]
    
    for i, headers in enumerate(headers_list):
        try:
            response = requests.get(base_url, headers=headers, timeout=10)
            print(f"Test {i+1}: Status {response.status_code}")
            print(f"Headers: {dict(response.headers)}")
            print(f"Response: {response.text[:100]}")
            print("---")
        except Exception as e:
            print(f"Test {i+1}: Error - {e}")
            print("---")

if __name__ == "__main__":
    test_backend_status()
