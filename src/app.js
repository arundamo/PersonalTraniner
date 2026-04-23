const express = require('express');
const app = express();

app.use(express.json());

const exerciseRoutes = require('./routes/exercises');
const exercisePlanRoutes = require('./routes/exercisePlans');

app.use('/api/exercises', exerciseRoutes);
app.use('/api/exercise-plans', exercisePlanRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
