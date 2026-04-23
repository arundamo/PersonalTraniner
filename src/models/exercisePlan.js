const { v4: uuidv4 } = require('uuid');

function createExercisePlan({ name, description = '', exercises = [], difficulty = 'beginner' }) {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    name,
    description,
    exercises,
    difficulty,
    createdAt: now,
    updatedAt: now,
  };
}

module.exports = { createExercisePlan };
