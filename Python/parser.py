import pyodbc
import sys

conn = None
cursor = None
id_arr = []

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

if __name__ == '__main__':
    #invoke by python parser.py filename username password
    # python parser.py data/run_info.txt admin FLycb7A2hEUWV*NmpZcb
    filename = sys.argv[1]
    username = sys.argv[2]
    password = sys.argv[3]

    # filename = 'data/database.txt'
    # username = "admin"
    # password = "FLycb7A2hEUWV*NmpZcb"
    
    open_connection(username, password)

    parse(filename)


    close_connection()


    

