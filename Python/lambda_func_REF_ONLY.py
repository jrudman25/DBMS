import json
import pyodbc

def lambda_handler(event, context):
    if 'headers' in event:
        event = json.loads(event['body'])
    
    conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=stsdb.cm6uzfkbt628.us-east-1.rds.amazonaws.com,1433;DATABASE=SlayTheSpireStats;UID=admin;PWD=FLycb7A2hEUWV*NmpZcb')
    cursor = conn.cursor()
        
    if event['TYPE'] == 'INSERT':
        insert_row(cursor, event)
        
    statusCode = 200
    message = 'Success'
    try:
        conn.commit()
    except MySQLdb.IntegrityError:
        statusCode = 400
        message = 'Commit Failed'
    
    cursor.close()
    return {
        'statusCode': statusCode,
        'body': message
    }

def insert_row(cursor, query):
    # Query here is in JSON format
    
    values = []
    for value in query['VALUES']:
        try:
            int(value)
            values.append(value)
        except:
            values.append("'" + value + "'")
    
    SQL_statement = f"INSERT INTO {query['TABLE']}({', '.join(query['COLUMNS'])}) VALUES ({', '.join(values)});"
    cursor.execute(SQL_statement)
    
    