// backend/index.js
// Express server for the Hospital Management app.
// Connects to MongoDB Atlas (not SQLite) using Mongoose.

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors()); // allow the frontend (different port) to call this API
app.use(express.json()); // parse JSON request bodies

// ---------- Connect to MongoDB Atlas ----------
// Connection string is hardcoded here (no .env file) as requested.
const MONGODB_URI =
  'mongodb+srv://vidyahipparagi13_db_user:pLIrR7ditvvNOKWm@cluster0.m9fv4xb.mongodb.net/';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ---------- Patient schema & model ----------
// Each document represents one patient's hospital record.
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  disease: { type: String, required: true },
  doctorAssigned: { type: String, required: true },
  roomNumber: { type: String, default: '' },
  status: { type: String, enum: ['Admitted', 'Discharged'], default: 'Admitted' },
  admissionDate: { type: Date, default: Date.now },
  dischargeDate: { type: Date, default: null },
});

const Patient = mongoose.model('Patient', patientSchema);

// ---------- CREATE ----------
// Register (admit) a new patient
app.post('/patients', async (req, res) => {
  try {
    const { name, age, gender, disease, doctorAssigned, roomNumber } = req.body;

    if (!name || !age || !gender || !disease || !doctorAssigned) {
      return res.status(400).json({
        error: 'name, age, gender, disease, and doctorAssigned are all required',
      });
    }
    if (age <= 0) {
      return res.status(400).json({ error: 'age must be a positive number' });
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      disease,
      doctorAssigned,
      roomNumber: roomNumber || '',
    });

    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register patient' });
  }
});

// ---------- READ (all patients, paginated + searchable + filterable) ----------
// GET /patients?page=1&limit=5&search=fever&status=Admitted
app.get('/patients', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const { search, status } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { disease: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Patient.countDocuments(filter);
    const patients = await Patient.find(filter)
      .sort({ admissionDate: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: patients,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// ---------- READ (single patient by id) ----------
app.get('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(404).json({ error: 'Patient not found' });
  }
});

// ---------- UPDATE ----------
// Edit patient details, or discharge them (status -> "Discharged")
app.put('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const fields = ['name', 'age', 'gender', 'disease', 'doctorAssigned', 'roomNumber', 'status'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) patient[field] = req.body[field];
    });

    // Automatically stamp the discharge date the moment status flips to Discharged
    if (req.body.status === 'Discharged' && !patient.dischargeDate) {
      patient.dischargeDate = new Date();
    }
    // If a patient is re-admitted, clear the old discharge date
    if (req.body.status === 'Admitted') {
      patient.dischargeDate = null;
    }

    await patient.save();
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// ---------- DELETE ----------
app.delete('/patients/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: `Patient ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));