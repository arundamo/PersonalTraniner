/* ── API helpers ── */
const api = {
  async get(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async post(path, body) {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async put(path, body) {
    const res = await fetch(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async delete(path) {
    const res = await fetch(path, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

/* ── Toast ── */
let toastTimer;
function showToast(msg, isError = false) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.background = isError ? '#dc2626' : '#1e293b';
  el.classList.remove('hidden');
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.classList.add('hidden'), 350);
  }, 3000);
}

/* ═══════════════════════════════════════
   EXERCISES
═══════════════════════════════════════ */
let exercises = [];

async function loadExercises() {
  exercises = await api.get('/api/exercises');
  renderExercises();
}

function renderExercises() {
  const container = document.getElementById('exercise-list');
  if (!exercises.length) {
    container.innerHTML = '<p class="empty">No exercises yet. Click "+ New Exercise" to add one.</p>';
    return;
  }
  container.innerHTML = exercises.map((ex) => `
    <div class="exercise-card" data-id="${ex.id}">
      <h3>${esc(ex.name)}</h3>
      ${ex.muscleGroup ? `<div class="meta">🏋️ ${esc(ex.muscleGroup)}</div>` : ''}
      ${ex.description ? `<div class="meta">${esc(ex.description)}</div>` : ''}
      <div class="meta">
        ${ex.sets ? `Sets: ${ex.sets}` : ''}
        ${ex.reps ? `&nbsp;· Reps: ${ex.reps}` : ''}
        ${ex.durationSeconds ? `&nbsp;· Duration: ${ex.durationSeconds}s` : ''}
      </div>
      <div class="card-actions">
        <button class="btn btn-secondary" onclick="openEditExercise('${ex.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteExercise('${ex.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function openNewExercise() {
  document.getElementById('exercise-form-title').textContent = 'New Exercise';
  document.getElementById('exercise-id').value = '';
  document.getElementById('exercise-form').reset();
  document.getElementById('exercise-sets').value = 0;
  document.getElementById('exercise-reps').value = 0;
  document.getElementById('exercise-duration').value = 0;
  document.getElementById('exercise-form-container').classList.remove('hidden');
  document.getElementById('exercise-name').focus();
}

function openEditExercise(id) {
  const ex = exercises.find((e) => e.id === id);
  if (!ex) return;
  document.getElementById('exercise-form-title').textContent = 'Edit Exercise';
  document.getElementById('exercise-id').value = ex.id;
  document.getElementById('exercise-name').value = ex.name;
  document.getElementById('exercise-desc').value = ex.description || '';
  document.getElementById('exercise-muscle').value = ex.muscleGroup || '';
  document.getElementById('exercise-sets').value = ex.sets || 0;
  document.getElementById('exercise-reps').value = ex.reps || 0;
  document.getElementById('exercise-duration').value = ex.durationSeconds || 0;
  document.getElementById('exercise-form-container').classList.remove('hidden');
  document.getElementById('exercise-name').focus();
}

function cancelExerciseForm() {
  document.getElementById('exercise-form-container').classList.add('hidden');
}

async function submitExerciseForm(e) {
  e.preventDefault();
  const id = document.getElementById('exercise-id').value;
  const body = {
    name: document.getElementById('exercise-name').value.trim(),
    description: document.getElementById('exercise-desc').value.trim(),
    muscleGroup: document.getElementById('exercise-muscle').value.trim(),
    sets: parseInt(document.getElementById('exercise-sets').value) || 0,
    reps: parseInt(document.getElementById('exercise-reps').value) || 0,
    durationSeconds: parseInt(document.getElementById('exercise-duration').value) || 0,
  };
  try {
    if (id) {
      await api.put(`/api/exercises/${id}`, body);
      showToast('Exercise updated');
    } else {
      await api.post('/api/exercises', body);
      showToast('Exercise created');
    }
    cancelExerciseForm();
    await loadExercises();
  } catch (err) {
    showToast(err.message, true);
  }
}

async function deleteExercise(id) {
  if (!confirm('Delete this exercise?')) return;
  try {
    await api.delete(`/api/exercises/${id}`);
    showToast('Exercise deleted');
    await loadExercises();
  } catch (err) {
    showToast(err.message, true);
  }
}

/* ═══════════════════════════════════════
   EXERCISE PLANS
═══════════════════════════════════════ */
let plans = [];
let currentPlanId = null;

async function loadPlans() {
  plans = await api.get('/api/exercise-plans');
  renderPlans();
}

function renderPlans() {
  const container = document.getElementById('plan-list');
  if (!plans.length) {
    container.innerHTML = '<p class="empty">No plans yet. Click "+ New Plan" to create one.</p>';
    return;
  }
  container.innerHTML = plans.map((plan) => `
    <div class="plan-card" data-id="${plan.id}">
      <h3>${esc(plan.name)}</h3>
      <span class="badge badge-${plan.difficulty}">${plan.difficulty}</span>
      ${plan.description ? `<div class="meta">${esc(plan.description)}</div>` : ''}
      <div class="meta">${plan.exercises.length} exercise${plan.exercises.length !== 1 ? 's' : ''}</div>
      <div class="card-actions">
        <button class="btn btn-secondary" onclick="openPlanModal('${plan.id}')">Manage</button>
        <button class="btn btn-secondary" onclick="openEditPlan('${plan.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deletePlan('${plan.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function openNewPlan() {
  document.getElementById('plan-form-title').textContent = 'New Plan';
  document.getElementById('plan-id').value = '';
  document.getElementById('plan-form').reset();
  document.getElementById('plan-form-container').classList.remove('hidden');
  document.getElementById('plan-name').focus();
}

function openEditPlan(id) {
  const plan = plans.find((p) => p.id === id);
  if (!plan) return;
  document.getElementById('plan-form-title').textContent = 'Edit Plan';
  document.getElementById('plan-id').value = plan.id;
  document.getElementById('plan-name').value = plan.name;
  document.getElementById('plan-desc').value = plan.description || '';
  document.getElementById('plan-difficulty').value = plan.difficulty || 'beginner';
  document.getElementById('plan-form-container').classList.remove('hidden');
  document.getElementById('plan-name').focus();
}

function cancelPlanForm() {
  document.getElementById('plan-form-container').classList.add('hidden');
}

async function submitPlanForm(e) {
  e.preventDefault();
  const id = document.getElementById('plan-id').value;
  const body = {
    name: document.getElementById('plan-name').value.trim(),
    description: document.getElementById('plan-desc').value.trim(),
    difficulty: document.getElementById('plan-difficulty').value,
  };
  try {
    if (id) {
      await api.put(`/api/exercise-plans/${id}`, body);
      showToast('Plan updated');
    } else {
      await api.post('/api/exercise-plans', body);
      showToast('Plan created');
    }
    cancelPlanForm();
    await loadPlans();
  } catch (err) {
    showToast(err.message, true);
  }
}

async function deletePlan(id) {
  if (!confirm('Delete this plan?')) return;
  try {
    await api.delete(`/api/exercise-plans/${id}`);
    showToast('Plan deleted');
    await loadPlans();
  } catch (err) {
    showToast(err.message, true);
  }
}

/* ── Plan Modal ── */
function openPlanModal(id) {
  currentPlanId = id;
  const plan = plans.find((p) => p.id === id);
  if (!plan) return;

  document.getElementById('modal-plan-name').textContent = plan.name;
  document.getElementById('modal-plan-desc').textContent = plan.description || '';
  const badge = document.getElementById('modal-plan-difficulty');
  badge.textContent = plan.difficulty;
  badge.className = `badge badge-${plan.difficulty}`;

  populateModalExerciseSelect();
  renderModalExercises(plan);

  document.getElementById('plan-modal').classList.remove('hidden');
}

function closePlanModal() {
  document.getElementById('plan-modal').classList.add('hidden');
  currentPlanId = null;
}

function populateModalExerciseSelect() {
  const sel = document.getElementById('modal-exercise-select');
  sel.innerHTML = exercises.length
    ? exercises.map((ex) => `<option value="${ex.id}">${esc(ex.name)}</option>`).join('')
    : '<option value="">No exercises available</option>';
}

function renderModalExercises(plan) {
  const container = document.getElementById('modal-exercise-list');
  if (!plan.exercises.length) {
    container.innerHTML = '<p class="empty">No exercises in this plan yet.</p>';
    return;
  }
  container.innerHTML = plan.exercises.map((entry) => {
    const ex = exercises.find((e) => e.id === entry.exerciseId);
    const name = ex ? esc(ex.name) : `<em>Unknown (${entry.exerciseId})</em>`;
    return `
      <div class="plan-exercise-row">
        <div>
          <strong>${name}</strong>
          <span>&nbsp; Sets: ${entry.sets} · Reps: ${entry.reps}</span>
        </div>
        <button class="btn btn-danger" onclick="removeExerciseFromPlan('${entry.exerciseId}')">Remove</button>
      </div>
    `;
  }).join('');
}

async function addExerciseToPlan() {
  if (!currentPlanId) return;
  const exerciseId = document.getElementById('modal-exercise-select').value;
  const sets = parseInt(document.getElementById('modal-sets').value) || 0;
  const reps = parseInt(document.getElementById('modal-reps').value) || 0;
  if (!exerciseId) {
    showToast('Please create an exercise first', true);
    return;
  }
  try {
    const updated = await api.post(`/api/exercise-plans/${currentPlanId}/exercises`, { exerciseId, sets, reps });
    const idx = plans.findIndex((p) => p.id === currentPlanId);
    if (idx !== -1) plans[idx] = updated;
    renderModalExercises(updated);
    renderPlans();
    showToast('Exercise added to plan');
  } catch (err) {
    showToast(err.message, true);
  }
}

async function removeExerciseFromPlan(exerciseId) {
  if (!currentPlanId) return;
  try {
    const updated = await api.delete(`/api/exercise-plans/${currentPlanId}/exercises/${exerciseId}`);
    const idx = plans.findIndex((p) => p.id === currentPlanId);
    if (idx !== -1) plans[idx] = updated;
    renderModalExercises(updated);
    renderPlans();
    showToast('Exercise removed from plan');
  } catch (err) {
    showToast(err.message, true);
  }
}

/* ── Utility ── */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ═══════════════════════════════════════
   INIT & EVENT LISTENERS
═══════════════════════════════════════ */
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active', 'hidden') || t.classList.add('hidden'));
    btn.classList.add('active');
    const target = document.getElementById(`tab-${btn.dataset.tab}`);
    target.classList.remove('hidden');
    target.classList.add('active');
    if (btn.dataset.tab === 'plans') loadPlans();
  });
});

document.getElementById('btn-new-exercise').addEventListener('click', openNewExercise);
document.getElementById('btn-cancel-exercise').addEventListener('click', cancelExerciseForm);
document.getElementById('exercise-form').addEventListener('submit', submitExerciseForm);

document.getElementById('btn-new-plan').addEventListener('click', openNewPlan);
document.getElementById('btn-cancel-plan').addEventListener('click', cancelPlanForm);
document.getElementById('plan-form').addEventListener('submit', submitPlanForm);

document.getElementById('btn-close-modal').addEventListener('click', closePlanModal);
document.getElementById('plan-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closePlanModal();
});
document.getElementById('btn-add-exercise-to-plan').addEventListener('click', addExerciseToPlan);

/* Initial load */
loadExercises();
