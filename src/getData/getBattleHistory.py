import requests
from time import sleep
import json
import sys

url = "https://3ds.pokemon-gl.com/frontendApi/mypage/getGbuBattleList"

with open('./headers.json', 'r') as f:
    headers = json.load(f)

with open('./form.json', 'r') as f:
    payload = json.load(f)

r = requests.post(url, headers=headers, data=payload)
j = r.json()

with open('./battleHistory.json', 'w') as f:
    f.write(json.dumps(j, indent=2))

print(json.dumps(j, indent=2))
print('total battle num:', j['totalCount'])
