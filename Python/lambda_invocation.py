import requests
import json

data = {
  "TYPE": "INSERT",
  "TABLE": "CARDS",
  "COLUMNS": [
    "Run_ID",
    "CardName",
    "Frequency"
  ],
  "VALUES": [
    "123123",
    "hello",
    "8"
  ]
}
print(json.dumps(data))
resp = requests.post('https://y6tjzscvy4arbpupgs34cul4ju0csosw.lambda-url.us-east-1.on.aws/', json=data)
print(resp.text)
