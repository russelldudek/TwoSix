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

let animationTimer = null;

function applyScenario(key, animate = true) {
  const data = scenarios[key];
  if (!data) return;

  const buttons = [...document.querySelectorAll('[data-scenario]')];
  buttons.forEach((button) => {
    const selected = button.dataset.scenario === key;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });

  document.querySelectorAll('.gate').forEach((gate, index) => {
    gate.dataset.state = data.states[index];
    gate.querySelector('.gate-state').textContent = data.labels[index];
  });

  document.querySelector('#decision-name').textContent = data.decision;
  document.querySelector('#decision-summary').textContent = data.summary;
  document.querySelector('#decision-badge').textContent = data.status;

  const board = document.querySelector('.sync-board');
  clearTimeout(animationTimer);
  board.classList.remove('is-running');

  if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(() => {
      board.classList.add('is-running');
      animationTimer = window.setTimeout(() => {
        board.classList.remove('is-running');
        animationTimer = null;
      }, 1200);
    });
  }
}

function initializeScenarioTabs() {
  const buttons = [...document.querySelectorAll('[data-scenario]')];
  if (!buttons.length) return;

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => applyScenario(button.dataset.scenario));
    button.addEventListener('keydown', (event) => {
      const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();

      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = buttons.length - 1;

      buttons[nextIndex].focus();
      applyScenario(buttons[nextIndex].dataset.scenario);
    });
  });

  applyScenario('helix', false);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(() => applyScenario('helix', true));
  }
}

function initializeNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('#primary-links');
  if (!nav || !toggle || !links) return;

  const setMenu = (open) => {
    nav.dataset.menuOpen = String(open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => {
    setMenu(nav.dataset.menuOpen !== 'true');
  });

  links.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.dataset.menuOpen === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (nav.dataset.menuOpen === 'true' && !nav.contains(event.target)) setMenu(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) setMenu(false);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeScenarioTabs();
});
