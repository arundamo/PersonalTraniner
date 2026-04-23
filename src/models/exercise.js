const { v4: uuidv4 } = require('uuid');

function createExercise({ name, description = '', muscleGroup = '', sets = 0, reps = 0, durationSeconds = 0 }) {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    name,
    description,
    muscleGroup,
    sets,
    reps,
    durationSeconds,
    createdAt: now,
    updatedAt: now,
  };
}

module.exports = { createExercise };
