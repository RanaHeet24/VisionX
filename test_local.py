import urllib.request
import traceback

def test_api():
    endpoints = [
        "http://localhost:8000/api/v1/crypto/top-coins",
        "http://localhost:8000/api/v1/crypto/summary/bitcoin",
        "http://localhost:8000/api/v1/crypto/whales/bitcoin",
        "http://localhost:8000/api/v1/crypto/market-status"
    ]
    for url in endpoints:
        print(f"Testing {url}")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                print(f"Status: {response.status}")
                print(f"Snippet: {response.read()[:50]}")
        except urllib.error.HTTPError as e:
            print(f"HTTPError: {e.code} - {e.reason}")
            try:
                print(f"Body: {e.read()}")
            except:
                pass
        except Exception as e:
            print(f"Exception: {e}")

if __name__ == "__main__":
    test_api()
