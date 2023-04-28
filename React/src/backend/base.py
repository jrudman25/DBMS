# Import flask and datetime module for showing date and time

import pandas as pd
import pyodbc
import sys
from flask import Flask, render_template

conn = None
cursor = None
id_arr = []
  
  
# Initializing flask app
app = Flask(__name__)
  
def execute(line):
    global conn
    global cursor
    
    try:
        cursor = conn.cursor()
        cursor.execute(line)
        conn.commit()
        print('Executed:', line)
    except Exception as e:
        print('Execute Error:', line)
        print('Error is:', e)


def parse(filename):
    global conn
    global cursor
    file1 = open(filename, 'r')
    Lines = file1.read().split(";")
    
    Lines = [line+";" for line in Lines]

    for line in Lines:
        execute(line)

def open_connection(username, password):
    global conn
    global cursor
    try:
        #conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=stsdb.cm6uzfkbt628.us-east-1.rds.amazonaws.com,1433;DATABASE=SlayTheSpireStats;UID=admin;PWD=FLycb7A2hEUWV*NmpZcb')
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=stsdb.cm6uzfkbt628.us-east-1.rds.amazonaws.com,1433;DATABASE=SlayTheSpireStats;UID='+username+';PWD=' + password)
        cursor = conn.cursor()
        #status_label.config(text="Connected", fg="green")

        # cursor.execute("""
        #     INSERT INTO [SlayTheSpireStats].[dbo].[RUN] ([Time], [SuccessOrFail], [Duration], [Run_ID], [GoldBalance], [MaxFloorReached])
        #     VALUES ('2005-04-12', 1, '14:30:00.1230000', 0, 234, 5);""")
        # conn.commit()
        
        # Use when parser works
        #parser.parse("data/run_info.txt", conn)

    except:
        print("Open Connection Error")

def close_connection():
    global conn
    # cursor.execute("""
    #     DELETE FROM [SlayTheSpireStats].[dbo].[RUN]
    #     WHERE [Run_ID]=0""")
    conn.commit()
    conn.close()
    #status_label.config(text="Not Connected", fg="red", font=("Arial", int(screen_height/20)))


# Route for seeing a data
@app.route('/data')
def get_time():
    filename = "data/database.txt"
    username = "admin"
    password = "FLycb7A2hEUWV*NmpZcb"

    open_connection(username, password)
    parse(filename)
    close_connection()

@app.route('/all')
def get_all():
    username = "admin"
    password = "FLycb7A2hEUWV*NmpZcb"
    open_connection(username, password)
    cursor.execute("SELECT * FROM [SlayTheSpireStats].[dbo].[RUN]")
    ans = cursor.fetchall()
    gold = 0
    floor = 0
    total = 1
    name = ""
    wins = 0

    for i in ans:
        gold = gold + i[4]
        floor = floor + i[5]
        total = total + 1
        name = i[6]
        if i[1] == 1:
            wins = wins + 1
    
    Gold = gold / total
    close_connection()
    
    return {
        "Gold":Gold,
        "Floor":floor/total,
        "GamesPlayed":total,
        "Name":name,
        "Wins":wins
    }

@app.route('/admin')
def get_admin():
    username = "admin"
    password = "FLycb7A2hEUWV*NmpZcb"
    open_connection(username, password)
    cursor.execute("""
        SELECT TOP (3) [CardName] FROM [SlayTheSpireStats].[dbo].[SHOP_CARDS]
        WHERE [Purchaed] = 1""")
    ans = cursor.fetchall()
    yup = []
    for i in ans:
        yup.append(i[0])
    close_connection()
    return {
        "Cards":yup
    }

@app.route('/relics')
def get_relics():
    username = "admin"
    password = "FLycb7A2hEUWV*NmpZcb"
    open_connection(username, password)
    cursor.execute("""
        SELECT TOP (3) [RelicName] FROM [SlayTheSpireStats].[dbo].[SHOP_RELIC]""")
    ans = cursor.fetchall()
    yup = []
    for i in ans:
        yup.append(i[0])
        print("HELLO")
    close_connection()
    return {
        "Relics":yup
    }

@app.route('/allRuns')
def get_runs():
    username = "admin"
    password = "FLycb7A2hEUWV*NmpZcb"
    open_connection(username, password)
    cursor.execute("""
        SELECT * FROM [SlayTheSpireStats].[dbo].[RUN]""")
    ans = cursor.fetchall()
    date = []
    success = []
    duration = []
    gold = []
    maxfloor = []
    username = []
    

    for i in ans:
        date.append(i[0])
        success.append(i[1])
        duration.append(i[2])
        gold.append(i[4])
        maxfloor.append(i[5])
        username.append(i[6])
        print("HELLO")
    close_connection()
    return {
        "Date":date,
        "Success":success,
        "Duration":duration,
        "Gold":gold,
        "MaxFloor":maxfloor,
        "Username":username
    }


# Running app
if __name__ == '__main__':
    #invoke by python parser.py filename username password
    # python parser.py data/run_info.txt admin FLycb7A2hEUWV*NmpZcb

    app.run(debug=True)

