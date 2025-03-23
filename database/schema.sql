DROP TABLE IF EXISTS appointments, prescriptions, pharmacy_orders, emergency_requests, user_roles, users, records, patients, hospitals, doctors, departments CASCADE;

CREATE TABLE hospitals (
    hospital_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location TEXT,
    contact_number VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    coordinates POINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    hospital_id INT REFERENCES hospitals(hospital_id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    head_doctor VARCHAR(100)
);

CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY,
    hospital_id INT REFERENCES hospitals(hospital_id),
    department_id INT REFERENCES departments(department_id),
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    contact_number VARCHAR(15),
    email VARCHAR(100),
    available_hours TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    contact_number VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    medical_id VARCHAR(10) UNIQUE NOT NULL,
    blood_group VARCHAR(5),
    allergies TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_number VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    patient_id INT REFERENCES patients(patient_id),
    doctor_id INT REFERENCES doctors(doctor_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    role_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    role_name VARCHAR(20) NOT NULL, -- 'admin', 'doctor', 'patient', 'staff'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE records (
    record_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(patient_id),
    hospital_id INT REFERENCES hospitals(hospital_id),
    doctor_id INT REFERENCES doctors(doctor_id),
    diagnosis TEXT,
    treatment TEXT,
    record_date DATE DEFAULT CURRENT_DATE,
    uploaded_by VARCHAR(50),
    notes TEXT,
    follow_up_date DATE,
    attachments TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prescriptions (
    prescription_id SERIAL PRIMARY KEY,
    record_id INT REFERENCES records(record_id),
    patient_id INT REFERENCES patients(patient_id),
    doctor_id INT REFERENCES doctors(doctor_id),
    medication_name VARCHAR(100),
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration VARCHAR(50),
    instructions TEXT,
    issued_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pharmacy_orders (
    order_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(patient_id),
    prescription_id INT REFERENCES prescriptions(prescription_id),
    pharmacy_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'cancelled'
    total_cost DECIMAL(10, 2),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_address TEXT,
    delivery_date DATE
);

CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(patient_id),
    doctor_id INT REFERENCES doctors(doctor_id),
    hospital_id INT REFERENCES hospitals(hospital_id),
    appointment_date TIMESTAMP NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'rescheduled'
    notes TEXT,
    is_teleconsultation BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emergency_requests (
    request_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(patient_id),
    location TEXT,
    coordinates POINT,
    request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'dispatched', 'completed', 'cancelled'
    emergency_type VARCHAR(50),
    notes TEXT,
    responded_by VARCHAR(100)
);

-- Indexes for performance optimization
CREATE INDEX idx_medical_id ON patients(medical_id);
CREATE INDEX idx_patient_id ON records(patient_id);
CREATE INDEX idx_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_prescription_patient ON prescriptions(patient_id);
CREATE INDEX idx_emergency_status ON emergency_requests(status);

-- Sample data for development
INSERT INTO hospitals (name, location, contact_number, email, address) VALUES 
    ('City Hospital', 'Delhi', '9111234567', 'info@cityhospital.com', '123 Main Street, Delhi'),
    ('Green Clinic', 'Mumbai', '9222345678', 'contact@greenclinic.com', '456 Park Avenue, Mumbai'),
    ('Central Medical Center', 'Bangalore', '9333456789', 'info@centralmedical.com', '789 Tech Park, Bangalore');

INSERT INTO departments (hospital_id, name, description, head_doctor) VALUES
    (1, 'Cardiology', 'Heart and cardiovascular system', 'Dr. Sharma'),
    (1, 'Neurology', 'Brain and nervous system', 'Dr. Patel'),
    (2, 'Orthopedics', 'Bones and joints', 'Dr. Kumar'),
    (3, 'Pediatrics', 'Child healthcare', 'Dr. Singh');

INSERT INTO doctors (hospital_id, department_id, name, specialization, contact_number, email, available_hours) VALUES
    (1, 1, 'Dr. Ravi Sharma', 'Cardiologist', '9444567890', 'dr.sharma@cityhospital.com', 'Mon-Fri 9AM-5PM'),
    (1, 2, 'Dr. Neha Patel', 'Neurologist', '9555678901', 'dr.patel@cityhospital.com', 'Mon-Wed 10AM-6PM'),
    (2, 3, 'Dr. Anil Kumar', 'Orthopedic Surgeon', '9666789012', 'dr.kumar@greenclinic.com', 'Tue-Sat 8AM-4PM'),
    (3, 4, 'Dr. Priya Singh', 'Pediatrician', '9777890123', 'dr.singh@centralmedical.com', 'Mon-Fri 9AM-7PM');

INSERT INTO patients (name, date_of_birth, gender, contact_number, email, medical_id, blood_group, allergies) VALUES 
    ('Adarsh Singh', '2000-05-15', 'M', '9888901234', 'adarsh@email.com', 'MED123', 'O+', 'None'),
    ('Priya Sharma', '1998-09-22', 'F', '9999012345', 'priya@email.com', 'MED456', 'B+', 'Penicillin'),
    ('Rajesh Kumar', '1985-03-10', 'M', '9000123456', 'rajesh@email.com', 'MED789', 'A-', 'Pollen'),
    ('Meera Patel', '1992-11-05', 'F', '9111234567', 'meera@email.com', 'MED101', 'AB+', 'Shellfish');

INSERT INTO users (username, password_hash, email, patient_id) VALUES
    ('adarsh', '$2a$10$hgKj.z6SVxQ3RZlCEVebX.WnnOYwF1h3iRjxLnCJBBxUbhD3.wP9q', 'adarsh@email.com', 1), -- password: password123
    ('priya', '$2a$10$hgKj.z6SVxQ3RZlCEVebX.WnnOYwF1h3iRjxLnCJBBxUbhD3.wP9q', 'priya@email.com', 2);

INSERT INTO users (username, password_hash, email, doctor_id) VALUES
    ('dr.sharma', '$2a$10$hgKj.z6SVxQ3RZlCEVebX.WnnOYwF1h3iRjxLnCJBBxUbhD3.wP9q', 'dr.sharma@cityhospital.com', 1),
    ('dr.patel', '$2a$10$hgKj.z6SVxQ3RZlCEVebX.WnnOYwF1h3iRjxLnCJBBxUbhD3.wP9q', 'dr.patel@cityhospital.com', 2);

INSERT INTO user_roles (user_id, role_name) VALUES
    (1, 'patient'),
    (2, 'patient'),
    (3, 'doctor'),
    (4, 'doctor');

INSERT INTO records (patient_id, hospital_id, doctor_id, diagnosis, treatment, uploaded_by, notes, follow_up_date) VALUES 
    (1, 1, 1, 'Hypertension', 'Prescribed Amlodipine 5mg daily', 'Dr. Sharma', 'Patient should monitor blood pressure daily', '2023-10-15'),
    (2, 2, 3, 'Sprained ankle', 'Rest, Ice, Compression, Elevation', 'Dr. Kumar', 'Avoid weight bearing for 2 weeks', '2023-09-30'),
    (3, 3, 4, 'Common cold', 'Symptomatic treatment with antihistamines', 'Dr. Singh', 'Increase fluid intake', NULL),
    (4, 1, 2, 'Migraine', 'Sumatriptan 50mg as needed', 'Dr. Patel', 'Avoid triggers like bright lights', '2023-10-10');

INSERT INTO prescriptions (record_id, patient_id, doctor_id, medication_name, dosage, frequency, duration, instructions) VALUES
    (1, 1, 1, 'Amlodipine', '5mg', 'Once daily', '30 days', 'Take in the morning with food'),
    (2, 2, 3, 'Ibuprofen', '400mg', 'Three times daily', '7 days', 'Take after meals'),
    (4, 4, 2, 'Sumatriptan', '50mg', 'As needed', '30 days', 'Take at onset of migraine, maximum 2 tablets per day');

INSERT INTO appointments (patient_id, doctor_id, hospital_id, appointment_date, reason, status) VALUES
    (1, 1, 1, '2023-10-15 10:00:00', 'Follow-up for hypertension', 'scheduled'),
    (2, 3, 2, '2023-09-30 14:30:00', 'Check ankle healing progress', 'scheduled'),
    (4, 2, 1, '2023-10-10 11:15:00', 'Follow-up for migraine treatment', 'scheduled'),
    (3, 4, 3, '2023-09-25 09:30:00', 'Vaccination', 'scheduled');