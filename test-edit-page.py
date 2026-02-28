import requests
import json

# Test the edit page API endpoints
API_URL = "https://portfolio-builder-7i56.onrender.com"

# Test authentication first
print("Testing authentication...")
login_data = {
    "username": "testuser",  # Replace with actual username
    "password": "testpass"   # Replace with actual password
}

try:
    response = requests.post(f"{API_URL}/accounts/login/", json=login_data)
    if response.status_code == 200:
        token = response.json().get("token")
        print("✅ Login successful")
        
        # Test getting publications
        headers = {"Authorization": f"Token {token}"}
        pub_response = requests.get(f"{API_URL}/publications/mine/", headers=headers)
        
        if pub_response.status_code == 200:
            publications = pub_response.json()
            print(f"✅ Found {len(publications)} publications")
            
            if publications:
                pub_id = publications[0]["id"]
                print(f"✅ Testing edit API for publication ID: {pub_id}")
                
                # Test get publication
                detail_response = requests.get(f"{API_URL}/publications/{pub_id}/", headers=headers)
                if detail_response.status_code == 200:
                    pub_detail = detail_response.json()
                    print(f"✅ Publication details: {pub_detail.get('name', 'No name')}")
                    print(f"✅ Image: {pub_detail.get('image', 'No image')}")
                else:
                    print(f"❌ Failed to get publication details: {detail_response.status_code}")
            else:
                print("⚠️ No publications found to edit")
        else:
            print(f"❌ Failed to get publications: {pub_response.status_code}")
    else:
        print(f"❌ Login failed: {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"❌ Error: {e}")
