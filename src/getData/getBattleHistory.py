import requests
from time import sleep
import json
import sys

url = "https://3ds.pokemon-gl.com/frontendApi/mypage/getGbuBattleList"

with open('./headers.json', 'r') as f:
    headers = json.load(f)

with open('./form.json', 'r') as f:
    payload = json.load(f)

# print(args[1])
# payload = args[2]

r = requests.post(url, headers=headers, data=payload)
j = r.json()

print(json.dumps(j, indent=2))
print()
print('total battle num:', j['totalCount'])
