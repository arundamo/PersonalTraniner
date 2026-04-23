const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../data/store');
const { createExercise } = require('../models/exercise');
const { validateExercise } = require('../middleware/validation');

router.get('/', (req, res) => {
  res.json(getAll('exercises'));
});

router.get('/:id', (req, res) => {
  const exercise = getById('exercises', req.params.id);
  if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
  res.json(exercise);
});

router.post('/', validateExercise, (req, res) => {
  const exercise = createExercise(req.body);
  create('exercises', exercise);
  res.status(201).json(exercise);
});

router.put('/:id', (req, res) => {
  const updates = { ...req.body, updatedAt: new Date().toISOString() };
  const exercise = update('exercises', req.params.id, updates);
  if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
  res.json(exercise);
});

router.delete('/:id', (req, res) => {
  const exercise = remove('exercises', req.params.id);
  if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
  res.json({ message: 'Exercise deleted successfully' });
});

module.exports = router;
