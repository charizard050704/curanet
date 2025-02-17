from sqlalchemy.orm import Session
from models import Hospital, Doctor, Patient
import schemas

# Create a hospital
def create_hospital(db: Session, hospital: schemas.HospitalCreate):
    db_hospital = Hospital(name=hospital.name, address=hospital.address, phone=hospital.phone)
    db.add(db_hospital)
    db.commit()
    db.refresh(db_hospital)
    return db_hospital

# Get all hospitals
def get_hospitals(db: Session):
    return db.query(Hospital).all()

# Get hospital by ID
def get_hospital_by_id(db: Session, hospital_id: int):
    return db.query(Hospital).filter(Hospital.id == hospital_id).first()

# Create a doctor
def create_doctor(db: Session, doctor: schemas.DoctorCreate):
    db_doctor = Doctor(
        first_name=doctor.first_name,
        last_name=doctor.last_name,
        specialization=doctor.specialization,
        hospital_id=doctor.hospital_id
    )
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

# Get all doctors
def get_doctors(db: Session):
    return db.query(Doctor).all()

# Get doctor by ID
def get_doctor_by_id(db: Session, doctor_id: int):
    return db.query(Doctor).filter(Doctor.id == doctor_id).first()

# Create a patient
def create_patient(db: Session, patient: schemas.PatientCreate):
    db_patient = Patient(
        first_name=patient.first_name,
        last_name=patient.last_name,
        medical_id=patient.medical_id,
        phone=patient.phone,
        email=patient.email
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

# Get all patients
def get_patients(db: Session):
    return db.query(Patient).all()

# Get patient by ID
def get_patient_by_id(db: Session, patient_id: int):
    return db.query(Patient).filter(Patient.id == patient_id).first()
