// Sample Data
const users = {
  patients: { "1234567890": { name: "John Doe", reports: ["03/15/2025 - Checkup"], vitals: { bp: [120, 122], pulse: [72, 75] } } },
  doctors: { "HOSP123": { name: "Dr. Smith" }, "HOSP124": { name: "Dr. Jones" } },
  hospitals: { "AADHAAR123": { name: "City Hospital", queue: ["John Doe - Waiting"] } }
};

let currentUser = null;
let currentType = null;

// Homepage Hologram
if (document.getElementById('hologram-bg')) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('hologram-bg'), alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0x00CED1, wireframe: true });
  const torus = new THREE.Mesh(geometry, material);
  scene.add(torus);
  camera.position.z = 5;
  gsap.to(torus.rotation, { x: 1, y: 1, duration: 10, repeat: -1, yoyo: true });
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

// Login Logic
function showForm(type) {
  currentType = type;
  const input = document.getElementById('login-input');
  input.placeholder = type === 'patient' ? 'Phone Number' : type === 'doctor' ? 'Hospital ID' : 'Aadhaar/Medical ID/Phone';
  gsap.from('#login-form', { opacity: 0, y: 50, duration: 0.5 });
}

function handleLogin() {
  const input = document.getElementById('login-input').value;
  if (currentType === 'patient' && users.patients[input]) {
    currentUser = users.patients[input];
    window.location.href = 'patient.html';
  } else if (currentType === 'doctor' && users.doctors[input]) {
    currentUser = users.doctors[input];
    window.location.href = 'doctor.html';
  } else if (currentType === 'hospital' && users.hospitals[input]) {
    currentUser = users.hospitals[input];
    window.location.href = 'hospital.html';
  } else {
    alert('Invalid Credentials');
  }
}

// Patient Dashboard
if (document.getElementById('patient-name')) {
  document.getElementById('patient-name').textContent = `Welcome, ${currentUser?.name || 'Patient'}`;
  const reportsDiv = document.getElementById('report-list');
  currentUser?.reports.forEach(report => {
    const div = document.createElement('div');
    div.className = 'report-card';
    div.textContent = report;
    reportsDiv.appendChild(div);
  });
  const ctx = document.getElementById('vitals-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Visit 1', 'Visit 2'],
      datasets: [
        { label: 'BP', data: currentUser?.vitals.bp || [120, 122], borderColor: '#00CED1' },
        { label: 'Pulse', data: currentUser?.vitals.pulse || [72, 75], borderColor: '#FF6F61' }
      ]
    },
    options: { animation: { duration: 2000, easing: 'easeInOutQuart' } }
  });
}

function showSection(section) {
  document.querySelectorAll('.dash-section').forEach(s => s.style.display = 'none');
  document.getElementById(section).style.display = 'block';
  gsap.from(`#${section}`, { opacity: 0, x: -50, duration: 0.5 });
}

function bookVisit() {
  const date = document.getElementById('visit-date').value;
  const doctor = document.getElementById('doctor-select').value;
  if (date) {
    alert(`Visit booked for ${date} with ${doctor === 'doc1' ? 'Dr. Smith' : 'Dr. Jones'}`);
  } else {
    alert('Please select a date');
  }
}

// Doctor Dashboard
if (document.getElementById('doctor-name')) {
  document.getElementById('doctor-name').textContent = `${currentUser?.name || 'Doctor'}'s Dashboard`;
  const holoScene = new THREE.Scene();
  const holoCamera = new THREE.PerspectiveCamera(75, 400 / 500, 0.1, 1000);
  const holoRenderer = new THREE.WebGLRenderer({ canvas: document.getElementById('body-hologram'), alpha: true });
  holoRenderer.setSize(400, 500);
  const holoGeometry = new THREE.BoxGeometry(1, 2, 0.5);
  const holoMaterial = new THREE.MeshBasicMaterial({ color: 0x00CED1, wireframe: true });
  const body = new THREE.Mesh(holoGeometry, holoMaterial);
  holoScene.add(body);
  holoCamera.position.z = 5;
  gsap.to(body.rotation, { y: 2, duration: 5, repeat: -1, yoyo: true });
  function holoAnimate() {
    requestAnimationFrame(holoAnimate);
    holoRenderer.render(holoScene, holoCamera);
  }
  holoAnimate();

  const graphCtx = document.getElementById('vitals-graph').getContext('2d');
  new Chart(graphCtx, {
    type: 'line',
    data: {
      labels: ['Day 1', 'Day 2'],
      datasets: [{ label: 'BP', data: [120, 122], borderColor: '#FF6F61' }]
    }
  });
  const pieCtx = document.getElementById('condition-pie').getContext('2d');
  new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: ['Normal', 'Issue'],
      datasets: [{ data: [70, 30], backgroundColor: ['#00CED1', '#FF6F61'] }]
    }
  });
}

function searchPatient() {
  const query = document.getElementById('patient-search').value;
  if (users.patients[query]) {
    alert(`Patient Found: ${users.patients[query].name}`);
  }
}

function saveVitals(event) {
  event.preventDefault();
  const bp = document.getElementById('bp').value;
  const pulse = document.getElementById('pulse').value;
  if (bp && pulse) {
    alert(`Vitals Saved - BP: ${bp}, Pulse: ${pulse}`);
  } else {
    alert('Please enter all vitals');
  }
}

// Hospital Dashboard
if (document.getElementById('queue-list')) {
  const queueList = document.getElementById('queue-list');
  currentUser?.queue.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    queueList.appendChild(li);
  });
  const queueCtx = document.getElementById('queue-chart').getContext('2d');
  new Chart(queueCtx, {
    type: 'bar',
    data: {
      labels: ['Waiting', 'Examined'],
      datasets: [{ label: 'Patients', data: [5, 3], backgroundColor: '#00CED1' }]
    }
  });
}

function registerPatient() {
  const phone = document.getElementById('patient-phone').value;
  if (users.patients[phone]) {
    currentUser.queue.push(`${users.patients[phone].name} - Waiting`);
    const li = document.createElement('li');
    li.textContent = `${users.patients[phone].name} - Waiting`;
    document.getElementById('queue-list').appendChild(li);
    alert('Patient Registered');
  } else {
    alert('Patient not found');
  }
}