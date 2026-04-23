const store = {
  exercises: [],
  exercisePlans: [],
};

function getAll(collection) {
  return store[collection];
}

function getById(collection, id) {
  return store[collection].find((item) => item.id === id) || null;
}

function create(collection, item) {
  store[collection].push(item);
  return item;
}

function update(collection, id, updates) {
  const index = store[collection].findIndex((item) => item.id === id);
  if (index === -1) return null;
  store[collection][index] = { ...store[collection][index], ...updates };
  return store[collection][index];
}

function remove(collection, id) {
  const index = store[collection].findIndex((item) => item.id === id);
  if (index === -1) return null;
  const [removed] = store[collection].splice(index, 1);
  return removed;
}

function resetStore() {
  store.exercises = [];
  store.exercisePlans = [];
}

module.exports = { getAll, getById, create, update, remove, resetStore };
