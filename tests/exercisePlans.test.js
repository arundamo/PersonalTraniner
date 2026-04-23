const request = require('supertest');
const app = require('../src/app');
const { resetStore } = require('../src/data/store');

beforeEach(() => {
  resetStore();
});

describe('Exercise Plans API', () => {
  test('GET /api/exercise-plans returns empty array initially', async () => {
    const res = await request(app).get('/api/exercise-plans');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/exercise-plans creates plan with 201', async () => {
    const res = await request(app).post('/api/exercise-plans').send({ name: 'Beginner Plan', difficulty: 'beginner' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Beginner Plan');
    expect(res.body.id).toBeDefined();
  });

  test('POST /api/exercise-plans returns 400 if name missing', async () => {
    const res = await request(app).post('/api/exercise-plans').send({ difficulty: 'beginner' });
    expect(res.status).toBe(400);
  });

  test('GET /api/exercise-plans/:id returns plan', async () => {
    const created = await request(app).post('/api/exercise-plans').send({ name: 'Strength Plan' });
    const res = await request(app).get(`/api/exercise-plans/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Strength Plan');
  });

  test('GET /api/exercise-plans/:id returns 404 for missing', async () => {
    const res = await request(app).get('/api/exercise-plans/nonexistent-id');
    expect(res.status).toBe(404);
  });

  test('PUT /api/exercise-plans/:id updates plan', async () => {
    const created = await request(app).post('/api/exercise-plans').send({ name: 'Cardio Plan' });
    const res = await request(app).put(`/api/exercise-plans/${created.body.id}`).send({ name: 'Cardio Plan Updated', difficulty: 'advanced' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Cardio Plan Updated');
    expect(res.body.difficulty).toBe('advanced');
  });

  test('DELETE /api/exercise-plans/:id deletes plan', async () => {
    const created = await request(app).post('/api/exercise-plans').send({ name: 'Temp Plan' });
    const res = await request(app).delete(`/api/exercise-plans/${created.body.id}`);
    expect(res.status).toBe(200);
    const check = await request(app).get(`/api/exercise-plans/${created.body.id}`);
    expect(check.status).toBe(404);
  });

  test('POST /api/exercise-plans/:id/exercises adds exercise to plan', async () => {
    const plan = await request(app).post('/api/exercise-plans').send({ name: 'Full Body' });
    const exercise = await request(app).post('/api/exercises').send({ name: 'Push Up' });
    const res = await request(app)
      .post(`/api/exercise-plans/${plan.body.id}/exercises`)
      .send({ exerciseId: exercise.body.id, sets: 3, reps: 10 });
    expect(res.status).toBe(200);
    expect(res.body.exercises).toHaveLength(1);
    expect(res.body.exercises[0].exerciseId).toBe(exercise.body.id);
  });

  test('DELETE /api/exercise-plans/:id/exercises/:exerciseId removes exercise from plan', async () => {
    const plan = await request(app).post('/api/exercise-plans').send({ name: 'Full Body' });
    const exercise = await request(app).post('/api/exercises').send({ name: 'Push Up' });
    await request(app)
      .post(`/api/exercise-plans/${plan.body.id}/exercises`)
      .send({ exerciseId: exercise.body.id });
    const res = await request(app).delete(`/api/exercise-plans/${plan.body.id}/exercises/${exercise.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.exercises).toHaveLength(0);
  });
});
