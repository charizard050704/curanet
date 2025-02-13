import os
import psycopg2
from dotenv import load_dotenv

# Get the CuraNet root directory (Moves up one level from 'backend')
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)  # Moves up one level to 'curanet/'

# Load .env file from CuraNet root
load_dotenv(os.path.join(ROOT_DIR, ".env"))

# Get database credentials from .env
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

# Connect to PostgreSQL
try:
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    print("✅ Database connected successfully!")

except Exception as e:
    print(f"❌ Database connection error: {e}")
    exit(1)
