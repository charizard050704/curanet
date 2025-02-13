import psycopg2
import os
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

def connect_db():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
        )
        cursor = conn.cursor()
        print("\u2705 Database connected successfully!")
        return conn, cursor
    except Exception as e:
        print("\u274C Database connection error:", e)
        return None, None

def insert_doctor(cursor, conn, doctor_id, doctor_name):
    try:
        cursor.execute("""
            INSERT INTO doctors (doctor_id, doctor_name)
            VALUES (%s, %s)
            ON CONFLICT (doctor_id) DO NOTHING;
        """, (doctor_id, doctor_name))
        conn.commit()
        print(f"✅ Doctor inserted with ID: {doctor_id}")
    except Exception as e:
        print("\u274C Database query error:", e)

def insert_patient(cursor, conn, first_name, last_name, dob, gender, email, phone, address, insurance_no):
    try:
        cursor.execute("""
            INSERT INTO patients (first_name, last_name, dob, gender, email, phone, address, insurance_no)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (email) DO NOTHING;
        """, (first_name, last_name, dob, gender, email, phone, address, insurance_no))
        conn.commit()
        print(f"✅ Inserted new patient with email: {email}")
    except Exception as e:
        print("\u274C Database query error:", e)

def insert_medical_record(cursor, conn, patient_id, doctor_id, diagnosis, treatment, prescriptions, doctor_notes):
    try:
        cursor.execute("""
            INSERT INTO medical_records (patient_id, doctor_id, diagnosis, treatment, prescriptions, doctor_notes)
            VALUES (%s, %s, %s, %s, %s, %s);
        """, (patient_id, doctor_id, diagnosis, treatment, prescriptions, doctor_notes))
        conn.commit()
        print("✅ Medical record added!")
    except Exception as e:
        print("\u274C Database query error:", e)

def main():
    conn, cursor = connect_db()
    if not conn:
        return

    insert_doctor(cursor, conn, 2, "Dr. Example")
    insert_patient(cursor, conn, "Adarsh", "Kumar", "2000-01-01", "Male", "adarsh@example.com", "9876543210", "Patna, India", "INS123987")
    insert_medical_record(cursor, conn, 1, 2, "Diabetes", "Insulin Therapy", "Metformin", "Regular exercise and diet control")

    cursor.close()
    conn.close()
    print("🔒 Database connection closed.")

if __name__ == "__main__":
    main()