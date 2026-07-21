const scenarios = {
  helix: {
    name: 'Helix',
    states: ['aligned', 'proof', 'aligned', 'proof'],
    labels: ['Aligned', 'Guardrail proof', 'Aligned', 'Needs proof'],
    decision: 'ACCELERATE',
    summary: 'Use bounded mission pilots to prove human-authority guardrails, time-to-decision, traceability, deployment effort, and acquisition fit while preserving legacy-system continuity.',
    status: 'Guardrailed mission pilots'
  },
  sentr: {
    name: 'Sentr',
    states: ['aligned', 'aligned', 'aligned', 'aligned'],
    labels: ['Aligned', 'Aligned', 'Aligned', 'Aligned'],
    decision: 'SCALE',
    summary: 'Scale around doctrine-based evaluation, operator review, interoperable workflow coverage, and a field-learning cadence that links deployed effects back to product decisions.',
    status: 'Portfolio scale candidate'
  },
  sigma: {
    name: 'SIGMA',
    states: ['aligned', 'aligned', 'proof', 'aligned'],
    labels: ['Field evidence', 'Aligned', 'Repeatability proof', 'Aligned'],
    decision: 'PRODUCTIZE',
    summary: 'Turn field evidence, incident-command workflows, and response data into a repeatable deployment package while proving integration patterns can travel across agencies and events.',
    status: 'Repeatable deployment package'
  }
};

function applyScenario(key, animate = true) {
  const data = scenarios[key];
  if (!data) return;

  document.querySelectorAll('[data-scenario]').forEach((button) => {
    button.setAttribute('aria-selected', String(button.dataset.scenario === key));
  });

  document.querySelectorAll('.gate').forEach((gate, index) => {
    gate.dataset.state = data.states[index];
    gate.querySelector('.gate-state').textContent = data.labels[index];
  });

  document.querySelector('#decision-name').textContent = data.decision;
  document.querySelector('#decision-summary').textContent = data.summary;
  document.querySelector('#decision-badge').textContent = data.status;

  const board = document.querySelector('.sync-board');
  if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    board.classList.remove('is-running');
    void board.offsetWidth;
    board.classList.add('is-running');
    window.setTimeout(() => board.classList.remove('is-running'), 1200);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-scenario]').forEach((button) => {
    button.addEventListener('click', () => applyScenario(button.dataset.scenario));
  });
  applyScenario('helix', false);
});
