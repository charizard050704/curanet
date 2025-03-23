export function bfsSearch(records, startMedicalId) {
    const queue = [startMedicalId];
    const visited = new Set();
    const result = [];
  
    while (queue.length > 0) {
      const current = queue.shift();
      if (!visited.has(current)) {
        visited.add(current);
        const patientRecords = records.filter(r => r.medical_id === current);
        result.push(...patientRecords);
      }
    }
    return result;
  }