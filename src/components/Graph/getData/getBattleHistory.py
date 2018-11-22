import requests
from time import sleep
import json
import sys

url = "https://3ds.pokemon-gl.com/frontendApi/mypage/getGbuBattleList"

with open('./src/components/Graph/data/headers.json', 'r') as f:
    headers = json.load(f)

with open('./src/components/Graph/data/form.json', 'r') as f:
    payload = json.load(f)

r = requests.post(url, headers=headers, data=payload)
j = r.json()

with open('./src/components/Graph/data/battleHistory.json', 'w') as f:
    f.write(json.dumps(j, indent=2))

print(json.dumps(j, indent=2))
