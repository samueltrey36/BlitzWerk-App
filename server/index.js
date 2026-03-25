import express from 'express';

const app = express();
app.use(express.json());

// In-memory global job state
let globalJob = {
  status: 'idle',
  issueType: '',
  location: '',
  eta: 0,
  price: 0,
  helperLocation: '',
  customerVehicle: '',
  customerName: '',
  helperName: '',
  helperVehicle: ''
};

// Get current job state
app.get('/api/job', (req, res) => {
  res.json(globalJob);
});

// Update current job state (PATCH behavior)
app.patch('/api/job', (req, res) => {
  globalJob = { ...globalJob, ...req.body };
  res.json(globalJob);
});

// Reset job state
app.post('/api/job/reset', (req, res) => {
  globalJob = {
    status: 'idle',
    issueType: '',
    location: '',
    eta: 0,
    price: 0,
    helperLocation: '',
    customerVehicle: '',
    customerName: '',
    helperName: '',
    helperVehicle: ''
  };
  res.json(globalJob);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
