from db import get_db_connection

conn = get_db_connection()

if conn:
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    db_version = cursor.fetchone()
    print(f"Connected to: {db_version}")

    cursor.close()
    conn.close()
else:
    print("Failed to connect.")
