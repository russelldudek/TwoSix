const scenarios = {
  helix: {
    name: 'Helix', states: ['aligned','aligned','aligned','proof'], labels: ['Aligned','Aligned','Aligned','Needs proof'],
    decision: 'ACCELERATE',
    summary: 'Use mission pilots to prove time-to-decision, traceability, deployment effort, and support burden while preserving human authority and legacy-system continuity.',
    status: 'Mission-pilot release'
  },
  sentr: {
    name: 'Sentr', states: ['aligned','aligned','aligned','aligned'], labels: ['Aligned','Aligned','Aligned','Aligned'],
    decision: 'SCALE',
    summary: 'Scale around doctrine-based evaluation, operator review, interoperable workflow coverage, and a field-learning cadence that links deployed effects back to product decisions.',
    status: 'Portfolio scale candidate'
  },
  sigma: {
    name: 'SIGMA', states: ['aligned','aligned','aligned','proof'], labels: ['Aligned','Aligned','Aligned','Needs proof'],
    decision: 'PRODUCTIZE',
    summary: 'Turn repeatable deployment, interoperability, incident-command workflows, and response evidence into a product package that can travel across agencies and events.',
    status: 'Repeatable deployment package'
  }
};
function applyScenario(key, animate=true){
  const data=scenarios[key]; if(!data) return;
  document.querySelectorAll('[data-scenario]').forEach(btn=>btn.setAttribute('aria-selected', String(btn.dataset.scenario===key)));
  document.querySelectorAll('.gate').forEach((gate,i)=>{ gate.dataset.state=data.states[i]; gate.querySelector('.gate-state').textContent=data.labels[i]; });
  document.querySelector('#decision-name').textContent=data.decision;
  document.querySelector('#decision-summary').textContent=data.summary;
  document.querySelector('#decision-badge').textContent=data.status;
  const board=document.querySelector('.sync-board');
  if(animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    board.classList.remove('is-running'); void board.offsetWidth; board.classList.add('is-running');
    window.setTimeout(()=>board.classList.remove('is-running'),1200);
  }
}
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-scenario]').forEach(btn=>btn.addEventListener('click',()=>applyScenario(btn.dataset.scenario)));
  const reset=document.querySelector('#reset-model'); if(reset) reset.addEventListener('click',()=>applyScenario('helix'));
  applyScenario('helix',false);
});
