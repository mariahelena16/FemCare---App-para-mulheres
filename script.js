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
const focusedPoint1 = document.getElementById('focused-point-1');
const focusedPoint2 = document.getElementById('focused-point-2');
const focusedPoint3 = document.getElementById('focused-point-3');

let currentQuestion = 0;
const answers = {
  phase: 'Puberdade',
  concern: 'Ciclo menstrual',
  interest: 'Autocuidado'
};

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
  const normalized = phaseName.replace('#', '');

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
  const phaseName = hash.replace('#', '');
  const validPhase = Array.from(tabs).some((tab) => tab.dataset.phase === phaseName);

  if (!validPhase) {
    return;
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
