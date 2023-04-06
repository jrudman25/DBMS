import requests
import json

def insert_demo():
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
    resp = requests.post('https://y6tjzscvy4arbpupgs34cul4ju0csosw.lambda-url.us-east-1.on.aws/', json=data)
    print(resp.text)

def query_demo():
    data = {
        "TYPE": "QUERY",
        "QUERY": "SELECT TOP (1000) [Run_ID] ,[CardName] ,[Frequency] FROM [SlayTheSpireStats].[dbo].[CARDS]"
    }
    resp = requests.post('https://y6tjzscvy4arbpupgs34cul4ju0csosw.lambda-url.us-east-1.on.aws/', json=data)
    print(resp.text)

query_demo()