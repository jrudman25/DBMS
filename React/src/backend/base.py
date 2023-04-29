# Import flask and datetime module for showing date and time

import pandas as pd
import pyodbc
import sys
from flask import Flask, render_template

conn = None
cursor = None
id_arr = []
maxId = 0
userMaxId = 0
  
  
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
    maxId = total
    Gold = gold / total
    close_connection()
    return {
        "Gold":Gold,
        "Floor":floor/total,
        "GamesPlayed":total + 1,
        "Name":name,
        "Wins":wins
    }

@app.route('/userAll')
def get_user_all():
    username = "admin"
    password = "FLycb7A2hEUWV*NmpZcb"
    open_connection(username, password)
    cursor.execute("SELECT * FROM [SlayTheSpireStats].[dbo].[RUN] WHERE [Username] LIKE 'tylermwulff';")
    ans = cursor.fetchall()
    gold = 0
    floor = 0
    total = 0
    name = ""
    wins = 0
    print(ans)
    for i in ans:
        gold = gold + i[4]
        floor = floor + i[5]
        total = total + 1
        name = i[6]
        if i[1] == 1:
            wins = wins + 1
    print(total)
    userMaxId = total
    Gold = gold / total
    close_connection()
    print(wins)
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


@app.route('/user')
def get_user():
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

@app.route('/userRelics')
def get_user_relics():
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
        date.append(str(i[0]) + " " + str(i[1]) + " " + str(i[2]) + " " + str(i[4]) + " " +  str(i[5]) + " " + str(i[6]))
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


@app.route('/allUserRuns')
def get_user_runs():
    username = "admin"
    password = "FLycb7A2hEUWV*NmpZcb"
    open_connection(username, password)
    cursor.execute("""
        SELECT * FROM [SlayTheSpireStats].[dbo].[RUN] WHERE [Username] LIKE 'tylermwulff';""")
    ans = cursor.fetchall()
    date = []
    success = []
    duration = []
    gold = []
    maxfloor = []
    username = []
    

    for i in ans:
        date.append(str(i[0]) + " " + str(i[1]) + " " + str(i[2]) + " " + str(i[4]) + " " +  str(i[5]) + " " + str(i[6]))
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

@app.route('/cardNum')
def card_rate():
    username = "admin"
    password = "FLycb7A2hEUWV*NmpZcb"
    open_connection(username, password)
    cursor.execute("""
        SELECT R.[Run_ID], [CardName]
        FROM [SlayTheSpireStats].[dbo].[RUN] R
        INNER JOIN [SlayTheSpireStats].[dbo].[CARDS] 
        ON R.[Run_ID] = [SlayTheSpireStats].[dbo].[CARDS].[Run_ID]
        WHERE [SuccessOrFail] = 1;""")
    ans = cursor.fetchall()
    close_connection()
    total = 0
    for i in ans:
        total = total + 1
    print(total)
    return {
        "Card": total/2
    }

@app.route('/userCardNum')
def user_card_rate():
    username = "admin"
    password = "FLycb7A2hEUWV*NmpZcb"
    open_connection(username, password)
    cursor.execute("""
SELECT R.[Run_ID], [CardName], [Username]
FROM [SlayTheSpireStats].[dbo].[RUN] R
INNER JOIN [SlayTheSpireStats].[dbo].[CARDS] 
ON R.[Run_ID] = [SlayTheSpireStats].[dbo].[CARDS].[Run_ID]
WHERE [SuccessOrFail] = 1 AND [Username] = 'tylermwulff';
""")
    ans = cursor.fetchall()
    close_connection()
    total = 0
    for i in ans:
        total = total + 1
    print(total)
    return {
        "Card": total
    }


@app.route('/winRate')
def win_rate():
    username = "admin"
    password = "FLycb7A2hEUWV*NmpZcb"
    open_connection(username, password)
    cursor.execute("""
        SELECT [SuccessOrFail] as users FROM [SlayTheSpireStats].[dbo].[RUN];""")
    ans = cursor.fetchall()
    print(type(ans[0][0]))
    win = 0
    totl = 0
    for i in ans:
        print(i[0])
        if (i[0] == b'\x01'):
            win = win + 1
        totl = totl + 1
    win = win / totl
    close_connection()
    return {
        "Rate": win
    }
    print(ans)

@app.route('/userWinRate')
def user_win_rate():
    username = "admin"
    password = "FLycb7A2hEUWV*NmpZcb"
    open_connection(username, password)
    cursor.execute("""
        SELECT [SuccessOrFail] as users FROM [SlayTheSpireStats].[dbo].[RUN] WHERE [Username] LIKE 'tylermwulff';""")
    ans = cursor.fetchall()
    win = 0
    totl = 0
    for i in ans:
        print(i[0])
        if (i[0] == b'\x01'):
            win = win + 1
        totl = totl + 1
    win = win / totl
    close_connection()
    return {
        "Rate": win
    }

@app.route('/delete')
def delete_recent():
    global conn
    global cursor
    global id_arr
    username = "admin"
    password = "FLycb7A2hEUWV*NmpZcb"
    open_connection(username, password)
    cursor.execute("""
        SELECT MAX([Run_ID])
        FROM [SlayTheSpireStats].[dbo].[RUN]""")
    ans = cursor.fetchall()
    close_connection()
   
    print(ans[0][0])
    open_connection(username, password)
    cursor.execute("""
        DELETE FROM [SlayTheSpireStats].[dbo].[RUN]
        WHERE [Run_ID]=?""", ans[0][0])
    close_connection()
    return ""
    
@app.route('/userDelete')
def delete_user_recent():
    global conn
    global cursor
    global id_arr
    username = "admin"
    password = "FLycb7A2hEUWV*NmpZcb"
    open_connection(username, password)
    cursor.execute("""
        SELECT MAX([Run_ID])
        FROM [SlayTheSpireStats].[dbo].[RUN] WHERE [Username] LIKE 'tylermwulff'""")
    ans = cursor.fetchall()
    close_connection()
   
    print(ans[0][0])
    open_connection(username, password)
    cursor.execute("""
        DELETE FROM [SlayTheSpireStats].[dbo].[RUN]
        WHERE [Run_ID]=?""", ans[0][0])
    close_connection()
    return ""
    
# Running app
if __name__ == '__main__':
    #invoke by python parser.py filename username password
    # python parser.py data/run_info.txt admin FLycb7A2hEUWV*NmpZcb

    app.run(debug=True)

