require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionsRouter = require('./routes/transactions');

const app = express();
app.use(cors());
app.use(express.json());

// API routes - Note the path change to include /api prefix
app.use('/api/transactions', transactionsRouter);

const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI;

mongoose.connect(URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send({ message: 'Financial Tracker API is running!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});