import pyodbc

def run_insert(line, conn):
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO [SlayTheSpireStats].[dbo].[RUN] ([Time], [SuccessOrFail], [Duration], [Run_ID], [GoldBalance], [MaxFloorReached])
        VALUES ('2005-04-12', 1, '14:30:00.1230000', 0, 234, 5);""")
    conn.commit()
    print('got here')


def parse(filename, conn):
    print('got here')
    file1 = open(conn, 'r')
    Lines = file1.readlines()
    mode = ""

    for line in Lines:
        match line:
            case 'RUN':
                mode = 'RUN'
            case _:
                if mode == 'RUN':
                    run_insert(line);
    print('does it reach here')

