const tabs = document.querySelectorAll('.phase-tab');
const panels = document.querySelectorAll('.phase-content');
const faqItems = document.querySelectorAll('.faq-item');
const navLinks = document.querySelectorAll('.main-nav a');
const onboardingPanel = document.querySelector('.onboarding-panel');
const appShell = document.querySelector('.app-shell');
const personalizedBanner = document.getElementById('personalized-banner');
const questionCards = document.querySelectorAll('.question-card');
const optionButtons = document.querySelectorAll('.option-btn');
const nextButton = document.getElementById('next-question');
const backButton = document.getElementById('back-question');
const startLearningButton = document.getElementById('start-learning');
const userPhase = document.getElementById('user-phase');
const userInterest = document.getElementById('user-interest');
const personalizedContentSection = document.getElementById('personalized-content');
const personalizedTitle = document.getElementById('personalized-title');
const personalizedTip = document.getElementById('personalized-tip');
const focusedPoint1 = document.getElementById('focused-point-1');
const focusedPoint2 = document.getElementById('focused-point-2');
const focusedPoint3 = document.getElementById('focused-point-3');

let currentQuestion = 0;
const answers = {
  phase: 'Puberdade',
  concern: 'Ciclo menstrual',
  interest: 'Autocuidado'
};

const phaseAliases = {
  puberdade: 'puberdade',
  menstruacao: 'puberdade',
  menstrucao: 'puberdade',
  menstruação: 'puberdade',
  adolescencia: 'adolescencia',
  adolescência: 'adolescencia',
  vidaadulta: 'vida-adulta',
  'vida-adulta': 'vida-adulta',
  'vida adulta': 'vida-adulta',
  menopausa: 'menopausa'
};

function normalizePhaseValue(value) {
  return String(value || '')
    .replace(/^#/, '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

function resolvePhaseName(value) {
  const normalized = normalizePhaseValue(value);
  return phaseAliases[normalized] || normalized;
}

const personalizedContent = {
  'Puberdade': {
    'Autocuidado': ['Seu corpo está em transformação e isso merece gentileza e atenção.', 'Uma rotina simples de sono, hidratação e cuidado com a pele pode fazer uma grande diferença.', 'Se houver dor forte, sangramento muito intenso ou muito desconforto, vale buscar apoio com carinho.'],
    'Prevenção': ['Conhecer seu corpo é uma forma de cuidado e de proteção.', 'Acompanhar mudanças e ter informações confiáveis ajuda a agir com calma e confiança.', 'Qualquer sintoma persistente ou que te deixe insegura merece atenção.'],
    'Biologia do corpo': ['Cada mudança que você sente tem uma explicação natural e merece respeito.', 'Entender ciclo, hormônios e desenvolvimento ajuda a reduzir medo e confusão.', 'Quando algo parece fora do comum, conversar com uma profissional é um ato de autocuidado.'],
    'Bem-estar emocional': ['Mudanças de humor e autoestima fazem parte dessa fase; você não está sozinha.', 'Falar sobre o que sente, respeitar seus limites e pedir apoio também é cuidado.', 'Se a ansiedade ou a pressão emocional estiver pesada, vale conversar com alguém de confiança.']
  },
  'Adolescência': {
    'Autocuidado': ['Essa fase pede mais acolhimento do que comparação.', 'A rotina de sono, hidratação e cuidados com a pele ajudam a fortalecer bem-estar real.', 'Quando a preocupação afetar seu dia a dia, conversar com uma profissional pode ser um passo leve e valioso.'],
    'Prevenção': ['Você merece aprender sobre o corpo com informação clara e sem culpa.', 'Evitar comparações e acompanhar seu próprio ritmo pode te trazer mais segurança.', 'Se houver dor intensa, sangramento incomum ou muita insegurança, buscar ajuda é um cuidado essencial.'],
    'Biologia do corpo': ['Entender ciclo, hormônios e sinais do corpo pode trazer mais calma e clareza.', 'Conhecer o próprio corpo reduz medo e ajuda a tomar decisões mais conscientes.', 'Mudanças persistentes ou sintomas intensos não precisam ser ignorados.'],
    'Bem-estar emocional': ['A autoimagem pode ser desafiadora nessa etapa, e isso é comum.', 'Dê espaço para acolher suas emoções sem culpa e com mais gentileza.', 'Quando a autoestima ficar muito afetada, conversar com alguém pode aliviar bastante.']
  },
  'Vida adulta': {
    'Autocuidado': ['Você merece cuidar do corpo com constância e sem pressa.', 'Sono, alimentação, movimento e pausas reais fazem diferença no seu bem-estar.', 'Se os sintomas persistirem, uma avaliação profissional pode te devolver mais conforto.'],
    'Prevenção': ['Exames regulares e atenção ao corpo são parte de um cuidado inteligente.', 'Sinais sutis podem aparecer antes de algo maior e vale prestar atenção.', 'Prevenir é um gesto de respeito consigo mesma e com sua saúde.'],
    'Biologia do corpo': ['Entender fertilidade, ciclos e hormônios pode tornar sua rotina mais leve.', 'Mudanças de energia, humor e sono muitas vezes têm relação direta com o corpo.', 'Ouvir o que seu corpo está pedindo é uma ferramenta poderosa de cuidado.'],
    'Bem-estar emocional': ['O equilíbrio emocional e a rotina ajudam a reduzir o peso do dia a dia.', 'Cuidar do humor também é parte do autocuidado e da saúde integral.', 'Se você estiver esgotada, ansiosa ou sobrecarregada, dar espaço para ajuda é um ato de coragem.']
  },
  'Menopausa': {
    'Autocuidado': ['Essa fase pede acolhimento, não cobrança.', 'A rotina de sono, alimentação e movimento leve podem aliviar muito os desconfortos.', 'Se os sintomas persistirem, uma avaliação segura pode trazer mais conforto e clareza.'],
    'Prevenção': ['A saúde óssea, cardiovascular e do sono merecem atenção especial.', 'Prevenir é uma forma de preservar energia, autonomia e bem-estar.', 'Sintomas fortes ou frequentes não precisam ser enfrentados sozinhas.'],
    'Biologia do corpo': ['A transição hormonal traz mudanças reais e merece compreensão, não julgamento.', 'Você merece informações claras sobre os sintomas e os cuidados possíveis.', 'Sinais persistentes não precisam ser ignorados; eles merecem atenção.'],
    'Bem-estar emocional': ['Mudanças de humor, sono e energia são comuns e podem ser acolhidas com cuidado.', 'O suporte emocional faz grande diferença na qualidade de vida.', 'Se o impacto for forte, conversar com alguém pode te ajudar a se sentir mais leve.']
  }
};

function activatePhase(phaseName) {
  const normalized = resolvePhaseName(phaseName);

  tabs.forEach((tab) => {
    const isActive = tab.dataset.phase === normalized;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  panels.forEach((panel) => {
    const shouldShow = panel.dataset.panel === normalized;
    panel.classList.toggle('is-hidden', !shouldShow);
  });
}

function syncPhaseFromHash() {
  const hash = window.location.hash || '#puberdade';
  const phaseName = resolvePhaseName(hash);
  const validPhase = Array.from(tabs).some((tab) => tab.dataset.phase === phaseName);

  if (!validPhase) {
    return;
  }

  if (appShell) {
    appShell.classList.add('survey-complete');
  }

  if (onboardingPanel) {
    onboardingPanel.classList.add('hidden');
  }

  activatePhase(phaseName);
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const phaseName = tab.dataset.phase;
    activatePhase(phaseName);
    history.replaceState(null, '', `#${phaseName}`);
  });
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const phaseName = link.getAttribute('href')?.replace('#', '');
    const isValidPhase = Array.from(tabs).some((tab) => tab.dataset.phase === phaseName);

    if (!isValidPhase) {
      return;
    }

    event.preventDefault();
    activatePhase(phaseName);
    history.replaceState(null, '', `#${phaseName}`);
    document.getElementById('fases')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.addEventListener('DOMContentLoaded', syncPhaseFromHash);
window.addEventListener('hashchange', syncPhaseFromHash);
window.addEventListener('load', syncPhaseFromHash);

function updateQuestionState() {
  questionCards.forEach((card, index) => {
    card.classList.toggle('active', index === currentQuestion);
  });

  backButton.classList.toggle('hidden', currentQuestion === 0);
  nextButton.textContent = currentQuestion === questionCards.length - 1 ? 'Ir para o conteúdo' : 'Continuar';
}

function handleOptionSelection() {
  const currentCard = document.querySelector('.question-card.active');
  if (!currentCard) return;

  const buttons = currentCard.querySelectorAll('.option-btn');
  buttons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.classList.contains('selected')));
  });
}

function updatePersonalizedContent() {
  const selectedPhase = document.querySelector('.question-card[data-question="0"] .option-btn.selected')?.dataset.value || answers.phase;
  const selectedConcern = document.querySelector('.question-card[data-question="1"] .option-btn.selected')?.dataset.value || answers.concern;
  const selectedInterest = document.querySelector('.question-card[data-question="2"] .option-btn.selected')?.dataset.value || answers.interest;

  if (userPhase) {
    userPhase.textContent = selectedPhase;
  }

  if (userInterest) {
    userInterest.textContent = selectedInterest;
  }

  const phaseContent = personalizedContent[selectedPhase]?.[selectedInterest] || personalizedContent['Puberdade']['Autocuidado'];
  const concernText = selectedConcern.toLowerCase();

  if (personalizedTitle) {
    personalizedTitle.textContent = `Cuidado pensado para você nesta fase de ${selectedPhase.toLowerCase()}.`;
  }

  const personalizedTipText = `Hoje, no seu contexto de ${concernText}, vale priorizar ${phaseContent[1].toLowerCase()}`;

  if (personalizedTip) {
    personalizedTip.textContent = personalizedTipText;
  }

  if (focusedPoint1) {
    focusedPoint1.textContent = `No seu contexto de ${concernText}, ${phaseContent[0]}`;
  }

  if (focusedPoint2) {
    focusedPoint2.textContent = phaseContent[1];
  }

  if (focusedPoint3) {
    focusedPoint3.textContent = phaseContent[2];
  }

  if (personalizedContentSection) {
    personalizedContentSection.classList.remove('hidden');
  }
}

function completeOnboarding() {
  if (appShell) {
    appShell.classList.add('survey-complete');
  }

  if (onboardingPanel) {
    onboardingPanel.classList.add('hidden');
  }

  if (personalizedBanner) {
    personalizedBanner.classList.remove('hidden');
  }

  updatePersonalizedContent();

  const mainSection = document.getElementById('inicio');
  if (mainSection) {
    mainSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

nextButton.addEventListener('click', () => {
  const currentCard = document.querySelector('.question-card.active');
  const selected = currentCard?.querySelector('.option-btn.selected');

  if (!selected) {
    currentCard?.classList.add('needs-answer');
    return;
  }

  currentCard?.classList.remove('needs-answer');

  if (currentQuestion === 0) {
    answers.phase = currentCard.querySelector('.option-btn.selected')?.dataset.value || answers.phase;
  }

  if (currentQuestion === 1) {
    answers.concern = currentCard.querySelector('.option-btn.selected')?.dataset.value || answers.concern;
  }

  if (currentQuestion === 2) {
    answers.interest = currentCard.querySelector('.option-btn.selected')?.dataset.value || answers.interest;
  }

  if (currentQuestion < questionCards.length - 1) {
    currentQuestion += 1;
    updateQuestionState();
    handleOptionSelection();
    return;
  }

  completeOnboarding();
});

backButton.addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion -= 1;
    updateQuestionState();
    handleOptionSelection();
  }
});

optionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const currentCard = button.closest('.question-card');
    if (!currentCard) return;

    currentCard.querySelectorAll('.option-btn').forEach((btn) => {
      btn.classList.toggle('selected', btn === button);
      btn.setAttribute('aria-pressed', String(btn === button));
    });
  });
});

startLearningButton?.addEventListener('click', () => {
  document.getElementById('personalized-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

updateQuestionState();
handleOptionSelection();

faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('active');

    faqItems.forEach((faqItem) => {
      faqItem.classList.remove('active');
    });

    if (!isOpen) {
      item.classList.add('active');
    }
  });
});

const calendarContainer = document.getElementById('menstrual-calendar');
const monthLabel = document.getElementById('calendar-month');
const lastPeriodInput = document.getElementById('last-period-date');
const cycleLengthInput = document.getElementById('cycle-length');
const updateCalendarButton = document.getElementById('update-calendar');

const CALENDAR_STORAGE_KEY = 'femcare-menstrual-settings';
const calendarPhaseConfig = {
  menstrual: { label: 'Menstr.', className: 'phase-menstrual' },
  follicular: { label: 'Folicular', className: 'phase-follicular' },
  ovulation: { label: 'Ovulação', className: 'phase-ovulation' },
  luteal: { label: 'Lútea', className: 'phase-luteal' }
};

function getDefaultCycleSettings() {
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() - 19);
  return {
    lastPeriodDate: defaultDate.toISOString().slice(0, 10),
    cycleLength: 28
  };
}

function loadCycleSettings() {
  const defaults = getDefaultCycleSettings();
  try {
    const rawValue = localStorage.getItem(CALENDAR_STORAGE_KEY);
    if (!rawValue) {
      return defaults;
    }

    const parsed = JSON.parse(rawValue);
    return {
      lastPeriodDate: parsed.lastPeriodDate || defaults.lastPeriodDate,
      cycleLength: Number(parsed.cycleLength) || defaults.cycleLength
    };
  } catch (error) {
    return defaults;
  }
}

function saveCycleSettings(settings) {
  localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(settings));
}

function getCyclePhaseForDate(dateValue, cycleLength) {
  const cycleStart = new Date(dateValue);
  const diffMs = new Date(dateValue).getTime() - cycleStart.getTime();
  const cycleDay = ((Math.floor(diffMs / 86400000) % cycleLength) + cycleLength) % cycleLength + 1;

  if (cycleDay <= 5) return 'menstrual';
  if (cycleDay <= 12) return 'follicular';
  if (cycleDay <= 16) return 'ovulation';
  return 'luteal';
}

function getCyclePhaseForMonthDay(dayNumber, monthDate, settings) {
  const cycleStart = new Date(settings.lastPeriodDate);
  const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), dayNumber);
  const diffDays = Math.floor((date.getTime() - cycleStart.getTime()) / 86400000);
  const cycleDay = ((diffDays % settings.cycleLength) + settings.cycleLength) % settings.cycleLength + 1;

  if (cycleDay <= 5) return 'menstrual';
  if (cycleDay <= 12) return 'follicular';
  if (cycleDay <= 16) return 'ovulation';
  return 'luteal';
}

function renderMenstrualCalendar() {
  if (!calendarContainer) return;

  const settings = loadCycleSettings();

  if (lastPeriodInput) {
    lastPeriodInput.value = settings.lastPeriodDate;
  }

  if (cycleLengthInput) {
    cycleLengthInput.value = String(settings.cycleLength);
  }

  const now = new Date();
  const month = now.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const monthName = month.charAt(0).toUpperCase() + month.slice(1);

  if (monthLabel) {
    monthLabel.textContent = monthName;
  }

  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startWeekday = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();
  const totalCells = Math.ceil((startWeekday + totalDays) / 7) * 7;

  calendarContainer.innerHTML = '';

  for (let index = 0; index < totalCells; index += 1) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';

    const dayNumber = index - startWeekday + 1;
    if (dayNumber <= 0 || dayNumber > totalDays) {
      dayElement.classList.add('is-empty');
      calendarContainer.appendChild(dayElement);
      continue;
    }

    const phaseKey = getCyclePhaseForMonthDay(dayNumber, firstDayOfMonth, settings);
    const phaseMeta = calendarPhaseConfig[phaseKey];
    dayElement.classList.add(phaseMeta.className);
    dayElement.innerHTML = `
      <span class="day-number">${dayNumber}</span>
      <span class="phase-pill">${phaseMeta.label}</span>
    `;

    calendarContainer.appendChild(dayElement);
  }
}

function handleCalendarUpdate() {
  const nextSettings = {
    lastPeriodDate: lastPeriodInput?.value || getDefaultCycleSettings().lastPeriodDate,
    cycleLength: Number(cycleLengthInput?.value || 28)
  };

  if (nextSettings.cycleLength < 21) {
    nextSettings.cycleLength = 21;
  }

  if (nextSettings.cycleLength > 35) {
    nextSettings.cycleLength = 35;
  }

  saveCycleSettings(nextSettings);
  renderMenstrualCalendar();
}

if (updateCalendarButton) {
  updateCalendarButton.addEventListener('click', handleCalendarUpdate);
}

if (lastPeriodInput) {
  lastPeriodInput.addEventListener('change', handleCalendarUpdate);
}

if (cycleLengthInput) {
  cycleLengthInput.addEventListener('change', handleCalendarUpdate);
}

renderMenstrualCalendar();

const fabiAssistant = document.getElementById('fabi-assistant');
const fabiTrigger = document.getElementById('fabi-trigger');
const fabiForm = document.getElementById('fabi-form');
const fabiInput = document.getElementById('fabi-input');
const fabiMessages = document.getElementById('fabi-messages');
const fabiQuickQuestions = document.querySelectorAll('.fabi-question');

const fabiResponses = [
  {
    keywords: ['ciclo', 'irregular', 'menstrual', 'menstrua'],
    text: 'Um ciclo irregular pode acontecer por várias razões, como estresse, mudanças de peso, sono, exercício, alimentação e hormônios. O mais importante é observar o padrão ao longo do tempo. Se o ciclo estiver muito diferente do seu habitual, com dor forte ou sangramento muito intenso, vale conversar com ginecologista.'
  },
  {
    keywords: ['corrimento', 'amarelo', 'cheiro', 'normal', 'anormal'],
    text: 'Corrimento claro e sem cheiro forte costuma ser mais normal. Já corrimento amarelo, esverdeado, com cheiro forte ou com coceira/queimação pode indicar alguma alteração e merece atenção. Evite usar produtos perfumados na região íntima e procure avaliação se persistir.'
  },
  {
    keywords: ['ovulacao', 'ovulação', 'dor', 'ovulatorio', 'ovulatório'],
    text: 'A dor na ovulação, quando acontece, costuma ser unilateral e passageira, como uma pontada ou desconforto abdominal. Também pode haver aumento da sensibilidade, secreção cervical ou leve mudança de humor. Se for intensa ou frequente, vale conversar com uma profissional.'
  },
  {
    keywords: ['menstrua', 'sangramento', 'forte', 'cansada', 'fraca'],
    text: 'Menstruação muito intensa com cansaço, tontura ou fraqueza pode indicar sangramento mais abundante do que o usual. Se isso estiver acontecendo com frequência, vale avaliar com ginecologista, porque nem sempre é só “muita menstruação”; pode haver perda de ferro ou outras causas.'
  },
  {
    keywords: ['sexo', 'relacao', 'relação', 'período', 'periodo', 'sexo durante'],
    text: 'Sexo durante o período pode ser uma escolha pessoal e, para muitas pessoas, é totalmente tranquilo. É importante respeitar conforto, lubrificação e higiene. Se há dor, desconforto ou risco de infecção, vale conversar com a pessoa e, se necessário, procurar ajuda profissional.'
  },
  {
    keywords: ['ovulando', 'saber', 'ovulo', 'fertilidade'],
    text: 'Algumas pessoas percebem mais sensibilidade abdominal, secreção cervical mais clara e elástica, e maior desejo sexual na ovulação. Mas o jeito mais seguro de acompanhar é observar o ciclo ao longo de alguns meses. Se você quiser saber mais sobre fertilidade, um ginecologista pode te orientar com clareza.'
  },
  {
    keywords: ['saude intima', 'higiene', 'intima', 'coceira', 'queimação'],
    text: 'A saúde íntima costuma melhorar com higiene suave, uso de produtos neutros, evitar perfumados e manter a região bem arejada. Se houver coceira, ardor, odor forte ou desconforto frequente, vale buscar avaliação, porque isso pode ser sinal de irritação ou infecção.'
  },
  {
    keywords: ['fadiga', 'humor', 'peito', 'hormonal', 'hormonio'],
    text: 'Fadiga, humor variável e sensibilidade no peito podem estar ligados a alterações hormonais, estresse, sono ou até alimentação. Nem sempre é algo perigoso, mas é importante observar se é recorrente e se vem acompanhado de outros sintomas como dor forte, febre ou mudança brusca do ciclo.'
  },
  {
    keywords: ['cuidar', 'dia a dia', 'intima', 'higiene', 'covid'],
    text: 'No dia a dia, o cuidado com o corpo inclui sono regular, hidratação, alimentação equilibrada, atenção ao ciclo e respeito ao seu limite. Para a saúde íntima, o mais importante é evitar excesso de produtos agressivos e ouvir o que seu corpo está pedindo.'
  },
  {
    keywords: ['ginecologista', 'profissional', 'consulta', 'quando procurar'],
    text: 'Vale procurar um ginecologista se houver dor intensa, menstruação muito forte, ciclo muito irregular, corrimento incomum, infecções frequentes, dor na relação ou qualquer sintoma que te deixe desconfortável ou insegura. A consulta é um cuidado e não uma “exagero”.'
  }
];

function addFabiMessage(text, sender = 'bot') {
  const message = document.createElement('div');
  message.className = `fabi-message ${sender}`;
  message.textContent = text;
  fabiMessages.appendChild(message);
  fabiMessages.scrollTop = fabiMessages.scrollHeight;
}

function getFabiReply(input) {
  const text = input.toLowerCase();
  const match = fabiResponses.find((response) => response.keywords.some((keyword) => text.includes(keyword)));

  if (match) {
    return match.text;
  }

  return 'Entendi. Isso pode ter várias causas, e a melhor forma de orientar é observar seus sintomas e, se persistirem, conversar com um profissional de saúde. Se quiser, posso te ajudar com perguntas mais específicas sobre ciclo, corrimento, dor, sexo ou saúde íntima.';
}

if (fabiTrigger) {
  fabiTrigger.addEventListener('click', () => {
    const isOpen = fabiAssistant.classList.toggle('is-open');
    fabiTrigger.setAttribute('aria-expanded', String(isOpen));
  });
}

if (fabiQuickQuestions.length) {
  fabiQuickQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const value = question.textContent.trim();
      addFabiMessage(value, 'user');
      addFabiMessage(getFabiReply(value), 'bot');
    });
  });
}

if (fabiForm) {
  fabiForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = fabiInput.value.trim();

    if (!value) {
      return;
    }

    addFabiMessage(value, 'user');
    addFabiMessage(getFabiReply(value), 'bot');
    fabiForm.reset();
    fabiInput.focus();
  });
}
