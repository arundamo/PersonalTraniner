const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../data/store');
const { createExercisePlan } = require('../models/exercisePlan');
const { validateExercisePlan, validateExerciseInPlan } = require('../middleware/validation');

router.get('/', (req, res) => {
  res.json(getAll('exercisePlans'));
});

router.get('/:id', (req, res) => {
  const plan = getById('exercisePlans', req.params.id);
  if (!plan) return res.status(404).json({ error: 'Exercise plan not found' });
  res.json(plan);
});

router.post('/', validateExercisePlan, (req, res) => {
  const plan = createExercisePlan(req.body);
  create('exercisePlans', plan);
  res.status(201).json(plan);
});

router.put('/:id', (req, res) => {
  const updates = { ...req.body, updatedAt: new Date().toISOString() };
  const plan = update('exercisePlans', req.params.id, updates);
  if (!plan) return res.status(404).json({ error: 'Exercise plan not found' });
  res.json(plan);
});

router.delete('/:id', (req, res) => {
  const plan = remove('exercisePlans', req.params.id);
  if (!plan) return res.status(404).json({ error: 'Exercise plan not found' });
  res.json({ message: 'Exercise plan deleted successfully' });
});

router.post('/:id/exercises', validateExerciseInPlan, (req, res) => {
  const plan = getById('exercisePlans', req.params.id);
  if (!plan) return res.status(404).json({ error: 'Exercise plan not found' });

  const { exerciseId, sets = 0, reps = 0, durationSeconds = 0 } = req.body;
  const entry = { exerciseId, sets, reps, durationSeconds };
  plan.exercises.push(entry);
  plan.updatedAt = new Date().toISOString();
  res.json(plan);
});

router.delete('/:id/exercises/:exerciseId', (req, res) => {
  const plan = getById('exercisePlans', req.params.id);
  if (!plan) return res.status(404).json({ error: 'Exercise plan not found' });

  const before = plan.exercises.length;
  plan.exercises = plan.exercises.filter((e) => e.exerciseId !== req.params.exerciseId);
  if (plan.exercises.length === before) {
    return res.status(404).json({ error: 'Exercise not found in plan' });
  }
  plan.updatedAt = new Date().toISOString();
  res.json(plan);
});

module.exports = router;
