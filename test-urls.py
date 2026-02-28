import requests

def test_urls():
    base_url = "https://portfolio-backend.onrender.com"
    
    urls_to_test = [
        "/",
        "/health/",
        "/accounts/login/",
        "/accounts/register/",
    ]
    
    for url_path in urls_to_test:
        try:
            full_url = f"{base_url}{url_path}"
            response = requests.get(full_url, timeout=10)
            print(f"{url_path}: {response.status_code} - {response.text[:50]}")
        except Exception as e:
            print(f"{url_path}: Error - {e}")

if __name__ == "__main__":
    test_urls()
