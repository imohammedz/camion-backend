const express = require('express');
const { PrismaClient } = require('@prisma/client');  // Import Prisma Client
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package

// Import your routes
const authRoutes = require('./routes/auth');  // Add auth routes
const userRoutes = require('./routes/user'); // Add user routes
const fleetRoutes = require('./routes/fleet');
const truckRoutes = require('./routes/truck');
const driverRoutes = require('./routes/driver');
const shiftRoutes = require('./routes/shift');
const driverShiftRoutes = require('./routes/driverShift');

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Initialize Prisma Client
const prisma = new PrismaClient();

const port = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
    allowedHeaders: 'Content-Type,Authorization' // Allow specific headers
}));

// Use routes
app.use('/api/auth', authRoutes);   // Use auth routes
app.use('/api/user', userRoutes);  // Use user routes (protected)
app.use('/api/fleets', fleetRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/driverShifts', driverShiftRoutes);

app.use(express.json()); // Ensure request body is parsed

// Global error handling middleware (optional, for debugging)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
