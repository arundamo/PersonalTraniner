function validateExercise(req, res, next) {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'name is required and must be a non-empty string' });
  }
  next();
}

function validateExercisePlan(req, res, next) {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'name is required and must be a non-empty string' });
  }
  next();
}

function validateExerciseInPlan(req, res, next) {
  const { exerciseId } = req.body;
  if (!exerciseId) {
    return res.status(400).json({ error: 'exerciseId is required' });
  }
  next();
}

module.exports = { validateExercise, validateExercisePlan, validateExerciseInPlan };
