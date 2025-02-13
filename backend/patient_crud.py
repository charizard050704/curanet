from db import execute_query

# 🔹 Create (Insert) a New Patient
def add_patient(name, date_of_birth, gender, contact_info, address, medical_history):
    query = """
    INSERT INTO patients (name, date_of_birth, gender, contact_info, address, medical_history)
    VALUES (%s, %s, %s, %s, %s, %s) RETURNING patient_id;
    """
    return execute_query(query, (name, date_of_birth, gender, contact_info, address, medical_history), fetch_one=True)

# 🔹 Read (Retrieve) a Patient by ID
def get_patient(patient_id):
    query = "SELECT * FROM patients WHERE patient_id = %s;"
    return execute_query(query, (patient_id,), fetch_one=True)

# 🔹 Update Patient Contact Info
def update_patient(patient_id, new_contact_info):
    query = "UPDATE patients SET contact_info = %s WHERE patient_id = %s;"
    execute_query(query, (new_contact_info, patient_id))

# 🔹 Delete a Patient
def delete_patient(patient_id):
    query = "DELETE FROM patients WHERE patient_id = %s;"
    execute_query(query, (patient_id,))
