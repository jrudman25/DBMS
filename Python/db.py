import pyodbc
import tkinter as tk
from tkinter import filedialog
import parser

conn = None
cursor = None
id_arr = []

def open_connection():
    global conn
    global cursor
    try:
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=stsdb.cm6uzfkbt628.us-east-1.rds.amazonaws.com,1433;DATABASE=SlayTheSpireStats;UID=admin;PWD=FLycb7A2hEUWV*NmpZcb')
        cursor = conn.cursor()
        status_label.config(text="Connected", fg="green")

        # cursor.execute("""
        #     INSERT INTO [SlayTheSpireStats].[dbo].[RUN] ([Time], [SuccessOrFail], [Duration], [Run_ID], [GoldBalance], [MaxFloorReached])
        #     VALUES ('2005-04-12', 1, '14:30:00.1230000', 0, 234, 5);""")
        # conn.commit()
        
        # Use when parser works
        #parser.parse("data/run_info.txt", conn)

    except:
        status_label.config(text="Not Connected", fg="red")

def close_connection():
    global conn
    cursor.execute("""
        DELETE FROM [SlayTheSpireStats].[dbo].[RUN]
        WHERE [Run_ID]=0""")
    conn.commit()
    conn.close()
    status_label.config(text="Not Connected", fg="red", font=("Arial", int(screen_height/20)))

def insert_run():
    global conn
    global cursor
    global id_arr

    file_path = filedialog.askopenfilename()

    if len(id_arr) == 0:
        id_arr.append(0)
    else:
        id_arr.append(id_arr[-1] + 1)
    cursor.execute("""
        INSERT INTO [SlayTheSpireStats].[dbo].[RUN] ([Time], [SuccessOrFail], [Duration], [Run_ID], [GoldBalance], [MaxFloorReached])
        VALUES ('2005-04-12', 1, '14:30:00.1230000', ?, 234, 5);""", id_arr[-1])
    conn.commit()

def delete_run():
    global conn
    global cursor
    global id_arr
    if len(id_arr) > 0:
        cursor.execute("""
            DELETE FROM [SlayTheSpireStats].[dbo].[RUN]
            WHERE [Run_ID]=?""", id_arr[-1])
        conn.commit()
        id_arr.pop()

if __name__ == '__main__':
    root = tk.Tk()

    # set window size to the size of the screen
    screen_width = root.winfo_screenwidth()
    screen_height = root.winfo_screenheight()
    root.geometry(f"{screen_width}x{screen_height}")

    # configure grid
    root.columnconfigure(0, weight=1)
    root.columnconfigure(1, weight=1)
    root.rowconfigure(0, weight=1)
    root.rowconfigure(1, weight=1)
    root.rowconfigure(2, weight=1)

    open_button = tk.Button(root, text="Open Connection", command=open_connection, width=20, font=("Arial", 20))
    open_button.grid(row=0, column=0, sticky="nsew")

    close_button = tk.Button(root, text="Close Connection", command=close_connection, width=20, font=("Arial", 20))
    close_button.grid(row=0, column=1, sticky="nsew")

    insert_button = tk.Button(root, text="Insert New Run", command=insert_run, width=20, font=("Arial", 20))
    insert_button.grid(row=1, column=0, sticky="nsew")

    delete_button = tk.Button(root, text="Delete Most Recent Run", command=delete_run, width=20, font=("Arial", 20))
    delete_button.grid(row=1, column=1, sticky="nsew")

    status_label = tk.Label(root, text="Not Connected", fg="red", font=("Arial", int(screen_height/20)))
    status_label.grid(row=2, columnspan=2, sticky="nsew")

    root.mainloop()