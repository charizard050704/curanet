const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'curanet',
  password: 'Adarsh',
  port: 5432,
});

// JWT Secret
const JWT_SECRET = 'curanet-secret-key'; // In production, use environment variable

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Role-based access control middleware
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

// User Authentication Routes
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Get user with role
    const userResult = await pool.query(
      `SELECT u.*, r.role_name
       FROM users u
       LEFT JOIN user_roles r ON u.user_id = r.user_id
       WHERE u.username = $1`,
      [username]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const user = userResult.rows[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.user_id, 
        username: user.username,
        role: user.role_name,
        patientId: user.patient_id,
        doctorId: user.doctor_id
      }, 
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role_name,
        patientId: user.patient_id,
        doctorId: user.doctor_id
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { username, password, email, name, dateOfBirth, gender, contactNumber, role } = req.body;
  
  try {
    // Start a transaction
    await pool.query('BEGIN');
    
    // Check if username or email already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (existingUser.rows.length > 0) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    
    // Generate medical ID for patients
    let medicalId = null;
    let patientId = null;
    
    if (role === 'patient') {
      medicalId = 'MED' + Math.floor(100000 + Math.random() * 900000);
      
      // Create patient record
      const patientResult = await pool.query(
        'INSERT INTO patients (name, date_of_birth, gender, contact_number, email, medical_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING patient_id',
        [name, dateOfBirth, gender, contactNumber, email, medicalId]
      );
      
      patientId = patientResult.rows[0].patient_id;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const userResult = await pool.query(
      'INSERT INTO users (username, password_hash, email, patient_id) VALUES ($1, $2, $3, $4) RETURNING user_id',
      [username, hashedPassword, email, patientId]
    );
    
    const userId = userResult.rows[0].user_id;
    
    // Assign role
    await pool.query(
      'INSERT INTO user_roles (user_id, role_name) VALUES ($1, $2)',
      [userId, role]
    );
    
    // Commit transaction
    await pool.query('COMMIT');
    
    res.status(201).json({ 
      message: 'User registered successfully',
      medicalId: medicalId
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

// Patient Routes
app.get('/api/patients/:medical_id', async (req, res) => {
  const { medical_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT p.*, r.diagnosis, r.treatment, r.record_date, r.follow_up_date, r.notes, ' +
      'd.name AS doctor_name, d.specialization, h.name AS hospital_name ' +
      'FROM patients p ' +
      'LEFT JOIN records r ON p.patient_id = r.patient_id ' +
      'LEFT JOIN hospitals h ON r.hospital_id = h.hospital_id ' +
      'LEFT JOIN doctors d ON r.doctor_id = d.doctor_id ' +
      'WHERE p.medical_id = $1',
      [medical_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/patients/:patient_id/records', authenticateToken, async (req, res) => {
  const { patient_id } = req.params;
  
  // Check authorization - only the patient themselves or medical staff can view
  if (req.user.role === 'patient' && req.user.patientId != patient_id) {
    return res.status(403).json({ error: 'Not authorized to view these records' });
  }
  
  try {
    const result = await pool.query(
      'SELECT r.*, h.name AS hospital_name, d.name AS doctor_name ' +
      'FROM records r ' +
      'LEFT JOIN hospitals h ON r.hospital_id = h.hospital_id ' +
      'LEFT JOIN doctors d ON r.doctor_id = d.doctor_id ' +
      'WHERE r.patient_id = $1 ' +
      'ORDER BY r.record_date DESC',
      [patient_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/patients/:patient_id/prescriptions', authenticateToken, async (req, res) => {
  const { patient_id } = req.params;
  
  // Check authorization
  if (req.user.role === 'patient' && req.user.patientId != patient_id) {
    return res.status(403).json({ error: 'Not authorized to view these prescriptions' });
  }
  
  try {
    const result = await pool.query(
      'SELECT p.*, d.name AS doctor_name, d.specialization ' +
      'FROM prescriptions p ' +
      'LEFT JOIN doctors d ON p.doctor_id = d.doctor_id ' +
      'WHERE p.patient_id = $1 ' +
      'ORDER BY p.issued_date DESC',
      [patient_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/patients/:patient_id/appointments', authenticateToken, async (req, res) => {
  const { patient_id } = req.params;
  
  // Check authorization
  if (req.user.role === 'patient' && req.user.patientId != patient_id) {
    return res.status(403).json({ error: 'Not authorized to view these appointments' });
  }
  
  try {
    const result = await pool.query(
      'SELECT a.*, d.name AS doctor_name, d.specialization, h.name AS hospital_name ' +
      'FROM appointments a ' +
      'LEFT JOIN doctors d ON a.doctor_id = d.doctor_id ' +
      'LEFT JOIN hospitals h ON a.hospital_id = h.hospital_id ' +
      'WHERE a.patient_id = $1 ' +
      'ORDER BY a.appointment_date',
      [patient_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Hospital and Doctor Routes
app.get('/api/hospitals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hospitals');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/hospitals/:hospital_id/doctors', async (req, res) => {
  const { hospital_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT d.*, dep.name AS department_name ' +
      'FROM doctors d ' +
      'LEFT JOIN departments dep ON d.department_id = dep.department_id ' +
      'WHERE d.hospital_id = $1',
      [hospital_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/doctors/:doctor_id/schedule', async (req, res) => {
  const { doctor_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT a.appointment_date, a.status, a.is_teleconsultation ' +
      'FROM appointments a ' +
      'WHERE a.doctor_id = $1 AND a.appointment_date >= CURRENT_DATE ' +
      'ORDER BY a.appointment_date',
      [doctor_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Medical Records Management
app.post('/api/records', authenticateToken, checkRole(['doctor', 'admin']), async (req, res) => {
  const { patient_id, diagnosis, treatment, notes, follow_up_date } = req.body;
  
  try {
    // Get doctor and hospital IDs
    const doctorId = req.user.doctorId;
    let hospitalId = null;
    
    if (doctorId) {
      const doctorResult = await pool.query(
        'SELECT hospital_id FROM doctors WHERE doctor_id = $1',
        [doctorId]
      );
      
      if (doctorResult.rows.length > 0) {
        hospitalId = doctorResult.rows[0].hospital_id;
      }
    }
    
    // Insert record
    await pool.query(
      'INSERT INTO records (patient_id, hospital_id, doctor_id, diagnosis, treatment, notes, follow_up_date, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [patient_id, hospitalId, doctorId, diagnosis, treatment, notes, follow_up_date, req.user.username]
    );
    
    res.status(201).json({ message: 'Record created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Appointment Management
app.post('/api/appointments', authenticateToken, async (req, res) => {
  const { patient_id, doctor_id, hospital_id, appointment_date, reason, is_teleconsultation } = req.body;
  
  // Check authorization for creating appointments
  if (req.user.role === 'patient' && req.user.patientId != patient_id) {
    return res.status(403).json({ error: 'Not authorized to create appointments for this patient' });
  }
  
  try {
    // Check if doctor is available at this time
    const conflictCheck = await pool.query(
      'SELECT * FROM appointments WHERE doctor_id = $1 AND appointment_date = $2',
      [doctor_id, appointment_date]
    );
    
    if (conflictCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Doctor is not available at this time' });
    }
    
    // Create appointment
    await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, hospital_id, appointment_date, reason, is_teleconsultation) VALUES ($1, $2, $3, $4, $5, $6)',
      [patient_id, doctor_id, hospital_id, appointment_date, reason, is_teleconsultation]
    );
    
    res.status(201).json({ message: 'Appointment scheduled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/appointments/:appointment_id', authenticateToken, async (req, res) => {
  const { appointment_id } = req.params;
  const { status, appointment_date } = req.body;
  
  try {
    // Get appointment to check permissions
    const appointmentCheck = await pool.query(
      'SELECT a.patient_id, a.doctor_id FROM appointments a WHERE a.appointment_id = $1',
      [appointment_id]
    );
    
    if (appointmentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const appointment = appointmentCheck.rows[0];
    
    // Check authorization
    if (req.user.role === 'patient' && req.user.patientId != appointment.patient_id) {
      return res.status(403).json({ error: 'Not authorized to modify this appointment' });
    }
    
    if (req.user.role === 'doctor' && req.user.doctorId != appointment.doctor_id) {
      return res.status(403).json({ error: 'Not authorized to modify this appointment' });
    }
    
    // Update appointment
    const updateFields = [];
    const values = [];
    let paramCounter = 1;
    
    if (status) {
      updateFields.push(`status = $${paramCounter++}`);
      values.push(status);
    }
    
    if (appointment_date) {
      updateFields.push(`appointment_date = $${paramCounter++}`);
      values.push(appointment_date);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(appointment_id);
    
    await pool.query(
      `UPDATE appointments SET ${updateFields.join(', ')} WHERE appointment_id = $${paramCounter}`,
      values
    );
    
    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Prescription Management
app.post('/api/prescriptions', authenticateToken, checkRole(['doctor', 'admin']), async (req, res) => {
  const { patient_id, record_id, medication_name, dosage, frequency, duration, instructions } = req.body;
  
  try {
    // Insert prescription
    await pool.query(
      'INSERT INTO prescriptions (record_id, patient_id, doctor_id, medication_name, dosage, frequency, duration, instructions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [record_id, patient_id, req.user.doctorId, medication_name, dosage, frequency, duration, instructions]
    );
    
    res.status(201).json({ message: 'Prescription created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Emergency Services
app.post('/api/emergency', authenticateToken, async (req, res) => {
  const { patient_id, location, coordinates, emergency_type, notes } = req.body;
  
  // Check authorization
  if (req.user.role === 'patient' && req.user.patientId != patient_id) {
    return res.status(403).json({ error: 'Not authorized to request emergency services for this patient' });
  }
  
  try {
    // Create emergency request
    await pool.query(
      'INSERT INTO emergency_requests (patient_id, location, coordinates, emergency_type, notes) VALUES ($1, $2, $3, $4, $5)',
      [patient_id, location, coordinates, emergency_type, notes]
    );
    
    res.status(201).json({ message: 'Emergency request sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/emergency/active', authenticateToken, checkRole(['admin', 'staff']), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT er.*, p.name, p.contact_number, p.medical_id ' +
      'FROM emergency_requests er ' +
      'JOIN patients p ON er.patient_id = p.patient_id ' +
      'WHERE er.status IN (\'pending\', \'dispatched\') ' +
      'ORDER BY er.request_time',
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/emergency/:request_id', authenticateToken, checkRole(['admin', 'staff']), async (req, res) => {
  const { request_id } = req.params;
  const { status, responded_by } = req.body;
  
  try {
    await pool.query(
      'UPDATE emergency_requests SET status = $1, responded_by = $2 WHERE request_id = $3',
      [status, responded_by, request_id]
    );
    
    res.json({ message: 'Emergency request updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pharmacy services
app.post('/api/pharmacy/orders', authenticateToken, async (req, res) => {
  const { patient_id, prescription_id, pharmacy_name, delivery_address } = req.body;
  
  // Check authorization
  if (req.user.role === 'patient' && req.user.patientId != patient_id) {
    return res.status(403).json({ error: 'Not authorized to place orders for this patient' });
  }
  
  try {
    // Create pharmacy order
    await pool.query(
      'INSERT INTO pharmacy_orders (patient_id, prescription_id, pharmacy_name, delivery_address) VALUES ($1, $2, $3, $4)',
      [patient_id, prescription_id, pharmacy_name, delivery_address]
    );
    
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pharmacy/orders/:patient_id', authenticateToken, async (req, res) => {
  const { patient_id } = req.params;
  
  // Check authorization
  if (req.user.role === 'patient' && req.user.patientId != patient_id) {
    return res.status(403).json({ error: 'Not authorized to view orders for this patient' });
  }
  
  try {
    const result = await pool.query(
      'SELECT po.*, p.medication_name, p.dosage ' +
      'FROM pharmacy_orders po ' +
      'JOIN prescriptions p ON po.prescription_id = p.prescription_id ' +
      'WHERE po.patient_id = $1 ' +
      'ORDER BY po.order_date DESC',
      [patient_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search API (for AI-powered search)
app.get('/api/search', authenticateToken, checkRole(['doctor', 'admin', 'staff']), async (req, res) => {
  const { keyword, type } = req.query;
  
  try {
    let results = [];
    
    if (type === 'patient' && keyword) {
      // Search for patients by name or medical ID
      results = await pool.query(
        'SELECT * FROM patients WHERE name ILIKE $1 OR medical_id ILIKE $1',
        [`%${keyword}%`]
      );
    } else if (type === 'doctor' && keyword) {
      // Search for doctors by name or specialization
      results = await pool.query(
        'SELECT d.*, h.name AS hospital_name FROM doctors d ' +
        'LEFT JOIN hospitals h ON d.hospital_id = h.hospital_id ' +
        'WHERE d.name ILIKE $1 OR d.specialization ILIKE $1',
        [`%${keyword}%`]
      );
    } else if (type === 'record' && keyword) {
      // Search medical records by diagnosis or treatment
      results = await pool.query(
        'SELECT r.*, p.name AS patient_name, p.medical_id, h.name AS hospital_name ' +
        'FROM records r ' +
        'JOIN patients p ON r.patient_id = p.patient_id ' +
        'LEFT JOIN hospitals h ON r.hospital_id = h.hospital_id ' +
        'WHERE r.diagnosis ILIKE $1 OR r.treatment ILIKE $1',
        [`%${keyword}%`]
      );
    }
    
    res.json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health statistics for AI insights
app.get('/api/statistics/patient/:patient_id', authenticateToken, async (req, res) => {
  const { patient_id } = req.params;
  
  // Check authorization
  if (req.user.role === 'patient' && req.user.patientId != patient_id) {
    return res.status(403).json({ error: 'Not authorized to view statistics for this patient' });
  }
  
  try {
    // Get all medical records
    const records = await pool.query(
      'SELECT * FROM records WHERE patient_id = $1 ORDER BY record_date',
      [patient_id]
    );
    
    // Get all prescriptions
    const prescriptions = await pool.query(
      'SELECT * FROM prescriptions WHERE patient_id = $1 ORDER BY issued_date',
      [patient_id]
    );
    
    // Calculate some simple statistics
    const recordCount = records.rows.length;
    const prescriptionCount = prescriptions.rows.length;
    
    // Get most common diagnoses
    const diagnoses = {};
    records.rows.forEach(record => {
      if (record.diagnosis) {
        diagnoses[record.diagnosis] = (diagnoses[record.diagnosis] || 0) + 1;
      }
    });
    
    const commonDiagnoses = Object.entries(diagnoses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([diagnosis, count]) => ({ diagnosis, count }));
    
    // Get most prescribed medications
    const medications = {};
    prescriptions.rows.forEach(prescription => {
      if (prescription.medication_name) {
        medications[prescription.medication_name] = (medications[prescription.medication_name] || 0) + 1;
      }
    });
    
    const commonMedications = Object.entries(medications)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([medication, count]) => ({ medication, count }));
    
    res.json({
      recordCount,
      prescriptionCount,
      commonDiagnoses,
      commonMedications
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));