const playbookSteps = [
  {
    title: 'Step 1: Audit the Business & Expose Opportunities',
    goal: 'Pinpoint immediate AI leverage',
    summary:
      'List recurring tasks by department, rank by time and money, then identify repetitive and rules-based work.',
    checklist: [
      'Complete a full process sweep for each department.',
      'Rank each task by time investment and money investment.',
      'Pick 3–5 high-ROI opportunities to automate first.'
    ],
    outcome: 'A clear shortlist of where AI can save time and cut costs right away.'
  },
  {
    title: 'Step 2: Choose Tools & Build Workflow',
    goal: 'Integrate AI without chaos',
    summary:
      'Use tools for content, automation, CRM, support, analytics, voice/video, and HR. Build one flow: Trigger → AI → Automation → Human exceptions.',
    checklist: [
      'Choose tools by function, not hype.',
      'Map trigger, AI action, automation destination, and human review point.',
      'Design AI to handle 80-90% repetitive work.'
    ],
    outcome: 'A visual workflow everyone understands and can execute.'
  },
  {
    title: 'Step 3: Test, Automate & Measure',
    goal: 'Prove ROI before scaling',
    summary:
      'Start with one high-value process, measure baseline, automate repetitive steps, run weekly feedback loops, and track core metrics.',
    checklist: [
      'Record before metrics: hours, monthly cost, output quality.',
      'Automate one workflow end-to-end.',
      'Track Time Saved, Cost, Output Consistency, and ROI.'
    ],
    outcome: 'A reliable workflow with measurable performance gains.'
  },
  {
    title: 'Step 4: Scale Your AI Deployment',
    goal: 'Create a company-wide AI operating system',
    summary:
      'Standardize winning workflows as SOPs, assign AI champions, and reinvest gains each quarter into more automations.',
    checklist: [
      'Document wins in Notion/Drive/Asana.',
      'Run monthly AI show-and-tell sessions.',
      'Track quarterly gains and reinvest into new automations.'
    ],
    outcome: 'AI becomes an operational flywheel, not a one-time experiment.'
  }
];

const masterPrompt = `Hey ChatGPT, here is how to show up for me every time:
My name is [NAME]. I run [COMPANY], a [BUSINESS TYPE] that sells [OFFER] to [AUDIENCE].
Voice and style: energetic, motivational, casual. Short sentences. Punchy lines.
My priorities: grow revenue, cut waste, free up time.
When you write for me: give me 3 options when choosing. Push back if my ask is weak.
QA before finishing: 1) Is it simple? 2) Is it useful today? 3) Is the next step clear?`;

const rccfPrompt = `Role: [ROLE]
Context: [GOAL]. Audience: [AUDIENCE]. Inputs: [NUMBERS/LINKS]. Constraints: [RULES].
Command: [ACTION]. Give 3 options and a better path if you see one.
Format: [OUTPUT FORMAT]. End with a CTA. Run the 3-point QA.`;

const promptLibrary = {
  Marketing: {
    setup: 'Create shared project “Marketing”, paste Master Prompt, edit variables.',
    prompts: [
      'Short-Form Script Generator (PSL)',
      'YouTube Long-Form Outline (Open loops + proof)',
      'Hook Bank from customer language',
      'Ad angles and variations',
      'Creator-CEO newsletter'
    ]
  },
  Sales: {
    setup: 'Create shared project “Sales”, then run sales prompts for faster conversion.',
    prompts: [
      'Speed-to-Lead callback script',
      'Sell-by-chat DM starters',
      'Discovery call prep',
      'Objection handling playbook'
    ]
  },
  'Customer Success': {
    setup: 'Create project “Customer Success” and automate onboarding + retention plays.',
    prompts: ['Day-0 Quick-Start Plan', 'Risk Radar', 'QBR Outline', 'Expansion Moment Script']
  },
  Product: {
    setup: 'Create project “Product” for prioritization, specs, and testing.',
    prompts: [
      'Opportunity ranking',
      'One-page product management sheet',
      'Experiment design',
      'Voice-of-customer digest',
      'Release notes (plain English)'
    ]
  },
  Engineering: {
    setup: 'Create project “Engineering” for QA, docs, releases, and triage.',
    prompts: ['PR review summary', 'Bug triage', 'Doc update', 'Test plan scaffold', 'Release checklist']
  },
  Operations: {
    setup: 'Create project “Ops & Finance Implementation” to run the business rhythm.',
    prompts: ['Weekly KPI pack', 'Month-end close checklist', 'Daily cash & anomalies']
  }
};

const stepsEl = document.getElementById('steps');
const stepTemplate = document.getElementById('stepTemplate');
const promptTemplate = document.getElementById('promptTemplate');
const tabsEl = document.getElementById('tabs');
const cardsEl = document.getElementById('promptCards');
const searchEl = document.getElementById('search');

function renderSteps() {
  stepsEl.innerHTML = '';
  const stored = JSON.parse(localStorage.getItem('doneSteps') || '[]');

  playbookSteps.forEach((step, index) => {
    const clone = stepTemplate.content.cloneNode(true);
    const item = clone.querySelector('.step-card');
    const checkbox = clone.querySelector('.step-check');

    clone.querySelector('.step-title').textContent = step.title;
    clone.querySelector('.goal').textContent = step.goal;
    clone.querySelector('.summary').textContent = step.summary;
    clone.querySelector('.outcome').textContent = `Outcome: ${step.outcome}`;

    const list = clone.querySelector('.checklist');
    step.checklist.forEach((line) => {
      const li = document.createElement('li');
      li.textContent = line;
      list.appendChild(li);
    });

    checkbox.checked = stored.includes(index);
    item.classList.toggle('done', checkbox.checked);
    checkbox.addEventListener('change', () => {
      const current = new Set(JSON.parse(localStorage.getItem('doneSteps') || '[]'));
      checkbox.checked ? current.add(index) : current.delete(index);
      localStorage.setItem('doneSteps', JSON.stringify([...current]));
      item.classList.toggle('done', checkbox.checked);
    });

    stepsEl.appendChild(clone);
  });
}

function renderTabs(active = Object.keys(promptLibrary)[0]) {
  tabsEl.innerHTML = '';
  Object.keys(promptLibrary).forEach((key) => {
    const button = document.createElement('button');
    button.className = `tab ${key === active ? 'active' : ''}`;
    button.textContent = key;
    button.addEventListener('click', () => {
      renderTabs(key);
      renderPromptCards(key, searchEl.value.trim().toLowerCase());
    });
    tabsEl.appendChild(button);
  });
}

function renderPromptCards(department, search = '') {
  cardsEl.innerHTML = '';
  const data = promptLibrary[department];
  if (!data) return;

  const filtered = data.prompts.filter((p) =>
    `${department} ${data.setup} ${p}`.toLowerCase().includes(search)
  );

  filtered.forEach((prompt) => {
    const clone = promptTemplate.content.cloneNode(true);
    clone.querySelector('h3').textContent = prompt;
    clone.querySelector('.setup').textContent = data.setup;

    const items = clone.querySelector('.items');
    ['Use RCCF format', 'Generate 3 options', 'End with clear CTA'].forEach((line) => {
      const li = document.createElement('li');
      li.textContent = line;
      items.appendChild(li);
    });

    cardsEl.appendChild(clone);
  });

  if (!filtered.length) {
    cardsEl.innerHTML = '<p>No matching prompts found. Try a broader search.</p>';
  }
}

searchEl.addEventListener('input', () => {
  const activeTab = tabsEl.querySelector('.tab.active')?.textContent;
  renderPromptCards(activeTab, searchEl.value.trim().toLowerCase());
});

document.getElementById('startGuide').addEventListener('click', () => {
  document.getElementById('guidedPlan').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('masterPrompt').textContent = masterPrompt;
document.getElementById('rccfPrompt').textContent = rccfPrompt;
renderSteps();
renderTabs();
renderPromptCards(Object.keys(promptLibrary)[0]);
