const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fleetRoutes = require('./routes/fleet');

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use('/api/fleets', fleetRoutes);
