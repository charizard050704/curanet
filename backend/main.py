from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Hospital, Doctor, Patient
from .routes import router

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "CuraNet Backend is Running"}

@app.get("/hospitals/")
def get_hospitals(db: Session = Depends(get_db)):
    hospitals = db.query(Hospital).all()
    return hospitals
