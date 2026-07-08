// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000';
const GENDERS = ['Male', 'Female', 'Other'];

function App() {
  // ---------- Admit / edit form state ----------
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: GENDERS[0],
    disease: '',
    doctorAssigned: '',
    roomNumber: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // ---------- Patient list state ----------
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---------- Dark mode ----------
  const [darkMode, setDarkMode] = useState(false);

  // Fetch one page of patients, respecting search + status filter
  const fetchPatients = async (pageToLoad = page, searchTerm = search, status = statusFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pageToLoad, limit: 5, search: searchTerm });
      if (status) params.append('status', status);

      const res = await fetch(`${API_URL}/patients?${params.toString()}`);
      const data = await res.json();
      setPatients(data.data);
      setTotalPages(data.totalPages);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load patients', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients(1, '', '');
  }, []);

  useEffect(() => {
    fetchPatients(page, search, statusFilter);
  }, [page]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Admit a new patient, or save edits to an existing one
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim() || !form.age || !form.disease.trim() || !form.doctorAssigned.trim()) {
      setFormError('Name, age, disease, and doctor are required.');
      return;
    }
    if (Number(form.age) <= 0) {
      setFormError('Age must be a positive number.');
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `${API_URL}/patients/${editingId}` : `${API_URL}/patients`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setFormError(errData.error || 'Something went wrong.');
        setSaving(false);
        return;
      }

      setForm({ name: '', age: '', gender: GENDERS[0], disease: '', doctorAssigned: '', roomNumber: '' });
      setEditingId(null);
      setPage(1);
      await fetchPatients(1, search, statusFilter);
    } catch (err) {
      console.error('Failed to save patient', err);
      setFormError('Could not reach the server.');
    }
    setSaving(false);
  };

  const handleEdit = (patient) => {
    setEditingId(patient._id);
    setForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      disease: patient.disease,
      doctorAssigned: patient.doctorAssigned,
      roomNumber: patient.roomNumber || '',
    });
    setFormError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', age: '', gender: GENDERS[0], disease: '', doctorAssigned: '', roomNumber: '' });
    setFormError('');
  };

  // Mark a patient as discharged
  const handleDischarge = async (id) => {
    try {
      await fetch(`${API_URL}/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Discharged' }),
      });
      await fetchPatients(page, search, statusFilter);
    } catch (err) {
      console.error('Failed to discharge patient', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/patients/${id}`, { method: 'DELETE' });
      await fetchPatients(page, search, statusFilter);
    } catch (err) {
      console.error('Failed to delete patient', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPatients(1, search, statusFilter);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
    fetchPatients(1, search, e.target.value);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <h1>🏥 Hospital Management</h1>

      {/* ---------- Admit / Edit form ---------- */}
      <div className="card">
        <h2>{editingId ? 'Edit Patient Record' : 'Admit a New Patient'}</h2>
        <form onSubmit={handleSubmit} className="patient-form">
          <input
            type="text"
            name="name"
            placeholder="Patient name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            min="0"
            value={form.age}
            onChange={handleChange}
          />
          <select name="gender" value={form.gender} onChange={handleChange}>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="disease"
            placeholder="Diagnosis / condition"
            value={form.disease}
            onChange={handleChange}
          />
          <input
            type="text"
            name="doctorAssigned"
            placeholder="Doctor assigned"
            value={form.doctorAssigned}
            onChange={handleChange}
          />
          <input
            type="text"
            name="roomNumber"
            placeholder="Room number (optional)"
            value={form.roomNumber}
            onChange={handleChange}
          />

          {formError && <p className="form-error">{formError}</p>}

          <div className="form-buttons">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : editingId ? 'Update Record' : 'Admit Patient'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ---------- Patient list ---------- */}
      <div className="card">
        <div className="section-header">
          <h2>📋 Patient Records</h2>
          {lastUpdated && <span className="last-updated">Last updated: {lastUpdated}</span>}
        </div>

        <div className="filters-row">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by name or disease..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">
              Search
            </button>
          </form>
          <select value={statusFilter} onChange={handleStatusFilterChange} className="status-select">
            <option value="">All Statuses</option>
            <option value="Admitted">Admitted</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>

        {loading ? (
          <p className="loading">Loading patients...</p>
        ) : patients.length === 0 ? (
          <p className="empty">No patients found.</p>
        ) : (
          <ul className="patient-list">
            {patients.map((patient) => (
              <li key={patient._id} className="patient-row">
                <div className="patient-info">
                  <div className="patient-top">
                    <span className="patient-name">{patient.name}</span>
                    <span className={`status-badge ${patient.status === 'Admitted' ? 'status-admitted' : 'status-discharged'}`}>
                      {patient.status}
                    </span>
                  </div>
                  <span className="patient-meta">
                    {patient.age} yrs · {patient.gender} · {patient.disease}
                  </span>
                  <span className="patient-meta">
                    Dr. {patient.doctorAssigned}
                    {patient.roomNumber && ` · Room ${patient.roomNumber}`}
                  </span>
                  <span className="patient-dates">
                    Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
                    {patient.dischargeDate &&
                      ` · Discharged: ${new Date(patient.dischargeDate).toLocaleDateString()}`}
                  </span>
                </div>
                <div className="patient-actions">
                  {patient.status === 'Admitted' && (
                    <button className="btn btn-success" onClick={() => handleDischarge(patient._id)}>
                      Discharge
                    </button>
                  )}
                  <button className="btn btn-secondary" onClick={() => handleEdit(patient)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(patient._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-secondary">
            ◀ Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="btn btn-secondary"
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;