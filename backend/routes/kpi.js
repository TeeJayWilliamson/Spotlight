const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Create KPI Schema
const kpiSchema = new mongoose.Schema({
  title: String,
  field1: String,
  field2: String,
  field3: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const KPI = mongoose.model('KPI', kpiSchema);

// POST route to create KPI entry
router.post('/kpi', async (req, res) => {
  try {
    const kpi = new KPI(req.body);
    await kpi.save();
    res.status(201).json(kpi);
  } catch (error) {
    res.status(500).json({ message: 'Error saving KPI data', error });
  }
});

// GET route to fetch all KPI entries
router.get('/scorecard', async (req, res) => {
  try {
    const kpis = await KPI.find().sort({ timestamp: -1 });
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scorecard data', error });
  }
});

module.exports = router;