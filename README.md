# PersonalTrainer

A RESTful API for managing custom workout exercises and exercise plans.

## Getting Started

```bash
npm install
npm start
```

The server starts on `http://localhost:3000`.

## API Endpoints

### Exercises

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/exercises` | List all exercises |
| GET | `/api/exercises/:id` | Get a single exercise |
| POST | `/api/exercises` | Create a new exercise |
| PUT | `/api/exercises/:id` | Update an exercise |
| DELETE | `/api/exercises/:id` | Delete an exercise |

**Exercise fields:** `name` (required), `description`, `muscleGroup`, `sets`, `reps`, `durationSeconds`

### Exercise Plans

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/exercise-plans` | List all plans |
| GET | `/api/exercise-plans/:id` | Get a single plan |
| POST | `/api/exercise-plans` | Create a custom plan |
| PUT | `/api/exercise-plans/:id` | Update a plan |
| DELETE | `/api/exercise-plans/:id` | Delete a plan |
| POST | `/api/exercise-plans/:id/exercises` | Add an exercise to a plan |
| DELETE | `/api/exercise-plans/:id/exercises/:exerciseId` | Remove an exercise from a plan |

**ExercisePlan fields:** `name` (required), `description`, `difficulty` (`beginner`/`intermediate`/`advanced`), `exercises` (array of `{ exerciseId, sets, reps }`)

## Running Tests

```bash
npm test
```