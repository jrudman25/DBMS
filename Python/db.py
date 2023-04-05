import pyodbc
import tkinter as tk

conn = None
cursor = None

def open_connection():
    global conn
    global cursor
    try:
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=stsdb.cm6uzfkbt628.us-east-1.rds.amazonaws.com,1433;DATABASE=SlayTheSpireStats;UID=admin;PWD=FLycb7A2hEUWV*NmpZcb')
        cursor = conn.cursor()
        status_label.config(text="Connected", fg="green")

    except:
        status_label.config(text="Not Connected", fg="red")

def close_connection():
    global conn
    conn.close()
    status_label.config(text="Not Connected", fg="red", font=("Arial", int(screen_height/20)))

if __name__ == '__main__':
    root = tk.Tk()

    # set window size to the size of the screen
    screen_width = root.winfo_screenwidth()
    screen_height = root.winfo_screenheight()
    root.geometry(f"{screen_width}x{screen_height}")

    # configure grid
    root.columnconfigure(0, weight=1)
    root.rowconfigure(0, weight=1)
    root.rowconfigure(1, weight=1)
    root.rowconfigure(2, weight=1)

    open_button = tk.Button(root, text="Open Connection", command=open_connection, width=20, font=("Arial", 20))
    open_button.grid(row=0, column=0, sticky="nsew")

    close_button = tk.Button(root, text="Close Connection", command=close_connection, width=20, font=("Arial", 20))
    close_button.grid(row=1, column=0, sticky="nsew")

    status_label = tk.Label(root, text="Not Connected", fg="red", font=("Arial", int(screen_height/20)))
    status_label.grid(row=2, column=0, sticky="nsew")

    root.mainloop()