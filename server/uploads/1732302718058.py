import requests

proxy_ip = "192.168.1.1"

for port in range(10000):
    proxy = f"http://{proxy_ip}:{str(port).zfill(4)}"
    proxies = {
        'http': proxy,
        'https': proxy,
    }
    try:
        response = requests.get('http://www.google.com', proxies=proxies,timeout=3)
        if response.status_code == 200:
            print(f'Successful connection using {proxy}')
    except requests.exceptions.RequestException as err:
        print(f'Failed to connect using {proxy}     :      {err}')

