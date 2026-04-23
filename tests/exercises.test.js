const request = require('supertest');
const app = require('../src/app');
const { resetStore } = require('../src/data/store');

beforeEach(() => {
  resetStore();
});

describe('Exercises API', () => {
  test('GET /api/exercises returns empty array initially', async () => {
    const res = await request(app).get('/api/exercises');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/exercises creates exercise with 201', async () => {
    const res = await request(app).post('/api/exercises').send({ name: 'Push Up', muscleGroup: 'chest', sets: 3, reps: 10 });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Push Up');
    expect(res.body.id).toBeDefined();
  });

  test('POST /api/exercises returns 400 if name missing', async () => {
    const res = await request(app).post('/api/exercises').send({ muscleGroup: 'chest' });
    expect(res.status).toBe(400);
  });

  test('GET /api/exercises/:id returns exercise', async () => {
    const created = await request(app).post('/api/exercises').send({ name: 'Squat' });
    const res = await request(app).get(`/api/exercises/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Squat');
  });

  test('GET /api/exercises/:id returns 404 for missing', async () => {
    const res = await request(app).get('/api/exercises/nonexistent-id');
    expect(res.status).toBe(404);
  });

  test('PUT /api/exercises/:id updates exercise', async () => {
    const created = await request(app).post('/api/exercises').send({ name: 'Lunge' });
    const res = await request(app).put(`/api/exercises/${created.body.id}`).send({ name: 'Lunge Updated', sets: 4 });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Lunge Updated');
    expect(res.body.sets).toBe(4);
  });

  test('PUT /api/exercises/:id returns 404 for missing', async () => {
    const res = await request(app).put('/api/exercises/nonexistent-id').send({ name: 'X' });
    expect(res.status).toBe(404);
  });

  test('DELETE /api/exercises/:id deletes exercise', async () => {
    const created = await request(app).post('/api/exercises').send({ name: 'Plank' });
    const res = await request(app).delete(`/api/exercises/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
    const check = await request(app).get(`/api/exercises/${created.body.id}`);
    expect(check.status).toBe(404);
  });

  test('DELETE /api/exercises/:id returns 404 for missing', async () => {
    const res = await request(app).delete('/api/exercises/nonexistent-id');
    expect(res.status).toBe(404);
  });
});
