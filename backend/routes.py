from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models
from backend import schemas

app = FastAPI()

# ✅ Route: Home
@app.get("/")
def read_root():
    return {"message": "Welcome to CuraNet API"}

# ✅ Route: Create a Hospital
@app.post("/hospitals/", response_model=schemas.Hospital)
def create_hospital(hospital: schemas.HospitalCreate, db: Session = Depends(get_db)):
    db_hospital = models.Hospital(name=hospital.name, address=hospital.address, phone=hospital.phone)
    db.add(db_hospital)
    db.commit()
    db.refresh(db_hospital)
    return db_hospital

# ✅ Route: Get all Hospitals
@app.get("/hospitals/", response_model=list[schemas.Hospital])
def get_hospitals(db: Session = Depends(get_db)):
    return db.query(models.Hospital).all()

# ✅ Route: Create a Doctor
@app.post("/doctors/", response_model=schemas.Doctor)
def create_doctor(doctor: schemas.DoctorCreate, db: Session = Depends(get_db)):
    # Check if the hospital exists before assigning a doctor
    hospital = db.query(models.Hospital).filter(models.Hospital.id == doctor.hospital_id).first()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")

    db_doctor = models.Doctor(
        first_name=doctor.first_name,
        last_name=doctor.last_name,
        specialization=doctor.specialization,
        hospital_id=doctor.hospital_id,
    )
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

# ✅ Route: Get all Doctors
@app.get("/doctors/", response_model=list[schemas.Doctor])
def get_doctors(db: Session = Depends(get_db)):
    return db.query(models.Doctor).all()

# ✅ Route: Create a Patient
@app.post("/patients/", response_model=schemas.Patient)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    # Ensure `medical_id` is unique before inserting
    existing_patient = db.query(models.Patient).filter(models.Patient.medical_id == patient.medical_id).first()
    if existing_patient:
        raise HTTPException(status_code=400, detail="Medical ID already exists")

    db_patient = models.Patient(
        first_name=patient.first_name,
        last_name=patient.last_name,
        medical_id=patient.medical_id,
        phone=patient.phone,
        email=patient.email,
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

# ✅ Route: Get all Patients
@app.get("/patients/", response_model=list[schemas.Patient])
def get_patients(db: Session = Depends(get_db)):
    return db.query(models.Patient).all()
