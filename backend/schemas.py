from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

# Hospital Schema
class HospitalBase(BaseModel):
    name: str
    address: str
    phone: Optional[str] = None

class HospitalCreate(HospitalBase):
    pass

class HospitalResponse(HospitalBase):
    id: int

    class Config:
        from_attributes = True


# Doctor Schema
class DoctorBase(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    specialization: str
    hospital_id: int

class DoctorCreate(DoctorBase):
    pass

class DoctorResponse(DoctorBase):
    id: int
    hospital: Optional[HospitalResponse] = None  # Fix: Allow None to avoid conversion issues

    class Config:
        from_attributes = True


# Patient Schema
class PatientBase(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    medical_id: str = Field(..., min_length=6, max_length=20)
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    age: Optional[int] = None  # Added
    gender: Optional[str] = None  # Added

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int

    class Config:
        from_attributes = True
