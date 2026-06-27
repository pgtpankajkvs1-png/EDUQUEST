/* ==========================================================================
   EDUQUEST CORE APPLICATION LOGIC
   Tutor AI Agents, Chat UI Engine, Web Audio Synth, Gamification Systems
   ========================================================================== */


// 0. API & System Prompts Configuration
const GROQ_API_KEY = "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";

const TUTOR_SYSTEM_PROMPTS = {
  cosmo: "You are Cosmo, a friendly and enthusiastic science tutor for school students. You explain concepts simply, use fun analogies, emojis, and keep the tone encouraging. Keep your responses kid-friendly, relatively brief, and use Markdown for formatting (bold, lists, code). Always keep your scientific facts accurate.",
  alpha: "You are Alpha, a friendly and logical math tutor for school students. You help them solve math puzzles, explain math concepts step-by-step, use simple numbers and emojis, and keep the tone encouraging. If they ask for a puzzle, give them a simple one and guide them to the answer. Format your responses in clean Markdown.",
  clio: "You are Clio, a friendly and storytelling history tutor for school students. You explain historical events like an exciting storybook, use emojis, compare old things to modern things, and keep the tone encouraging. Format your responses in clean Markdown.",
  pixel: "You are Pixel, a friendly coding tutor for school students. You teach them coding concepts (like variables, loops, HTML, JS) in a fun and interactive way. Display small code snippets inside Markdown code blocks. Keep the tone encouraging. Format your responses in clean Markdown."
};

let chatHistories = {
  cosmo: [],
  alpha: [],
  clio: [],
  pixel: []
};

// 1. Data Structures & Tutor Definitions
const TUTORS = {
  cosmo: {
    name: 'Cosmo',
    subject: 'Science & Space',
    themeClass: 'theme-cosmo',
    icon: 'atom',
    statusText: 'Ready to explore the universe!',
    greeting: 'Welcome back, cadet! 🚀 Cosmo here, ready to probe the deepest secrets of science, from tiny atoms to colossal galaxies. What science mystery are we solving today?',
    suggestions: [
      '🌌 Explain Black Holes!',
      '🧪 Cool home science experiment?',
      '☀️ Why is the sky blue?',
      '🎒 Take a Science Quiz'
    ],
    responses: {
      'black hole': "A **black hole** is a place in space where gravity pulls so much that even light can't get out! 🌌 Think of it like a giant cosmic vacuum cleaner. They are formed when a massive star collapses in on itself at the end of its life.",
      'experiment': "Here is an awesome experiment: **The Magic Milk!** 🧪\n1. Pour some whole milk onto a plate.\n2. Add drops of different food colors in the center.\n3. Dip a cotton swab in dish soap, then touch the center of the milk.\n*What happens?* The colors will burst out like fireworks! This happens because the soap breaks the surface tension and chases the fat molecules in the milk!",
      'sky': "The sky is blue because of a process called **Rayleigh Scattering**! ☀️ The Earth's atmosphere scatters sunlight in all directions. Sunlight is made of all colors, but blue light travels in smaller, shorter waves, making it scatter more than other colors. That's why blue fills the sky!",
      'dinosaur': "Ah, dinosaurs! Although I focus on space, did you know that an asteroid hitting Earth 66 million years ago caused their extinction? ☄️ The crash blocked out the sun and changed the climate!",
      'default': "That's an amazing science question! 🚀 In science, asking questions is how we make discoveries. Did you know that the Earth spins at about 1,000 miles per hour, but we don't feel it because we're moving right along with it?"
    },
    quizzes: [
      {
        question: "Which planet is known as the 'Red Planet'?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answerIndex: 1,
        feedback: "Correct! Mars has iron oxide (rust) on its surface, which gives it a reddish look! 🔴"
      },
      {
        question: "What is the closest star to the Earth?",
        options: ["Proxima Centauri", "Polaris (North Star)", "The Sun", "Sirius"],
        answerIndex: 2,
        feedback: "You got it! The Sun is actually a star, and it is the closest one to Earth (about 93 million miles away)! ☀️"
      },
      {
        question: "What state of matter has a definite volume but no definite shape?",
        options: ["Solid", "Liquid", "Gas", "Plasma"],
        answerIndex: 1,
        feedback: "Awesome! Liquids (like water) take the shape of their container but keep the same volume. 💧"
      }
    ]
  },
  alpha: {
    name: 'Alpha',
    subject: 'Math & Logic',
    themeClass: 'theme-alpha',
    icon: 'binary',
    statusText: 'Let\'s solve some puzzles!',
    greeting: 'Hey math champion! 🔢 I am Alpha, your math tutor. Let\'s make numbers fun! Ask me for a math puzzle, geometry trick, or help with your homework!',
    suggestions: [
      '🧩 Give me a Math Puzzle!',
      '🍕 Explain fractions with pizza!',
      '📐 Cool geometry shortcut?',
      '🎒 Take a Math Quiz'
    ],
    responses: {
      'puzzle': "Here is a logic puzzle for you: 🧩\n*I am an odd number. Take away a letter and I become even. What number am I?*\n\n*(Think about it, or type 'tell me the answer'!)*",
      'answer': "The answer is **SEVEN**! 😲 If you take away the letter **'S'** from 'SEVEN', it becomes **'EVEN'**! Get it? Math and words can play tricks!",
      'fraction': "Imagine you order a large pepperoni pizza cut into 8 equal slices. 🍕\n- If you eat **2 slices**, you ate `2/8` of the pizza, which is the same as `1/4` (one quarter)!\n- If you eat **4 slices**, you ate `4/8` or `1/2` (half) of the entire pizza! Fractions are just sharing slices!",
      'geometry': "Here is a cool geometry secret: **The Triangle Angle Sum!** 📐\nNo matter what shape a triangle is (tall, flat, skewed), if you add up all three of its inside angles, they will **ALWAYS equal exactly 180 degrees**! Try drawing one, cutting the corners, and placing them side by side – they will make a perfect straight line!",
      'default': "Numbers are like coding blocks for the universe! 🔢 Whether you are adding fractions or solving algebraic equations, remember: every math problem is just a puzzle waiting to be solved. What mathematical quest shall we tackle next?"
    },
    quizzes: [
      {
        question: "If a triangle has angles of 90 degrees and 30 degrees, what is the third angle?",
        options: ["45 degrees", "60 degrees", "90 degrees", "180 degrees"],
        answerIndex: 1,
        feedback: "Superb! Since all angles in a triangle add up to 180°, 180 - (90 + 30) = 60°. 📐"
      },
      {
        question: "What is the value of Pi (approximately)?",
        options: ["2.14", "3.14", "4.14", "3.84"],
        answerIndex: 1,
        feedback: "Spot on! Pi (π) represents the ratio of a circle's circumference to its diameter, and is roughly 3.14159... 🥧"
      },
      {
        question: "A farmer has 17 sheep. All but 9 run away. How many sheep are left?",
        options: ["8", "17", "9", "0"],
        answerIndex: 2,
        feedback: "Tricky, but correct! 'All but 9 run away' means exactly 9 sheep are left! 🐑"
      }
    ]
  },
  clio: {
    name: 'Clio',
    subject: 'History & Culture',
    themeClass: 'theme-clio',
    icon: 'compass',
    statusText: 'Time travel mode activated!',
    greeting: 'Greetings, time traveler! ⏳ Clio here to guide you through the ancient vaults of human history. Let\'s visit the Egyptian pyramids, meet the dinosaurs, or explore the Roman empire!',
    suggestions: [
      '🏺 Who built the Pyramids?',
      '🦖 When did dinosaurs live?',
      '👑 Who was Julius Caesar?',
      '🎒 Take a History Quiz'
    ],
    responses: {
      'pyramids': "The ancient Egyptian Pyramids, like the Great Pyramid of Giza, were built as grand tombs for the Pharaohs (their kings). 🏺 They were built around 4,500 years ago using massive stone blocks weighing tons, mostly by skilled laborers, not slaves!",
      'dinosaurs': "Dinosaurs ruled the Earth during the **Mesozoic Era**, which lasted from about 252 million years ago to 66 million years ago! 🦖 This era is divided into three famous periods: the *Triassic*, *Jurassic*, and *Cretaceous*. The Tyrannosaurus Rex lived in the late Cretaceous period!",
      'caesar': "Julius Caesar was a famous Roman general and leader who helped expand the Roman Republic. 👑 He became so powerful that he was made dictator for life, which worried other politicians. In 44 BC, a group of senators assassinated him, which eventually led to the rise of the Roman Empire!",
      'default': "History is the ultimate storybook! ⏳ Every civilization, discovery, and legendary figure has shaped the world we live in today. Which century or ancient myth are you curious about?"
    },
    quizzes: [
      {
        question: "Which ancient civilization built the Colosseum?",
        options: ["Ancient Egyptians", "Ancient Greeks", "Ancient Romans", "Mayans"],
        answerIndex: 2,
        feedback: "Correct! The Romans built the Colosseum in Rome around 80 AD for gladiator fights and public spectacles. 🏛️"
      },
      {
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
        answerIndex: 1,
        feedback: "Nice! George Washington served as the first president from 1789 to 1797. 🇺🇸"
      },
      {
        question: "In what year did human astronauts first walk on the Moon?",
        options: ["1961", "1969", "1975", "1982"],
        answerIndex: 1,
        feedback: "Incredible! Neil Armstrong and Buzz Aldrin landed on the Moon in Apollo 11 in July 1969! 🚀"
      }
    ]
  },
  pixel: {
    name: 'Pixel',
    subject: 'Coding & Tech',
    themeClass: 'theme-pixel',
    icon: 'terminal',
    statusText: 'System status: Ready to code!',
    greeting: 'Hello, future developer! 💻 I am Pixel. I speak fluent HTML, CSS, JavaScript, and Python! Ask me how computers work, or let\'s write your very first line of code!',
    suggestions: [
      '💻 Teach me Hello World!',
      '🌐 What is HTML?',
      '🤖 How does AI work?',
      '🎒 Take a Coding Quiz'
    ],
    responses: {
      'hello world': "In coding, it is a tradition that the very first program you write in any language prints 'Hello World!' to the screen. 💻 Here is how you do it:\n\nIn Python:\n```python\nprint(\"Hello, World!\")\n```\n\nIn JavaScript:\n```javascript\nconsole.log(\"Hello, World!\");\n```\nIt's that simple!",
      'html': "**HTML** stands for *HyperText Markup Language*! 🌐 Think of it as the skeleton or bones of a webpage. It tells the browser where to put text, images, and links. Then, **CSS** is like the clothes and style, and **JavaScript** is like the brain that makes things move!",
      'ai': "Artificial Intelligence (AI) works by teaching computers to learn from patterns, just like you learn! 🤖 By processing millions of examples (like pictures of cats), the computer learns to recognize a cat on its own. This is called **Machine Learning**!",
      'default': "Coding is like having a superpower – you can build games, websites, or robots just by typing instructions! 💻 What program or app idea do you have in mind?"
    },
    quizzes: [
      {
        question: "Which tag is used to create a hyperlink in HTML?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        answerIndex: 1,
        feedback: "Awesome! The `<a>` (anchor) tag is used with the `href` attribute to link webpages. 🌐"
      },
      {
        question: "What is the output of print(5 + 3 * 2) in Python?",
        options: ["16", "11", "10", "15"],
        answerIndex: 1,
        feedback: "Spot on! Python follows order of operations (PEMDAS/BODMAS), so it does multiplication first: 3 * 2 = 6, then 5 + 6 = 11! 🔢"
      },
      {
        question: "Which of these is a popular programming language named after a snake?",
        options: ["Viper", "Cobra", "Python", "Anaconda"],
        answerIndex: 2,
        feedback: "Exactly! Python is powerful, easy to read, and named after Monty Python, though its logo features snakes! 🐍"
      }
    ]
  }
};

// 2. Global State Variable Managers
let activeTutorKey = 'cosmo';
let soundEnabled = true;
let isStudyMode = true;

// Gamification State (Loaded from localStorage or defaults)
let studentState = {
  xp: 0,
  level: 1,
  totalXp: 0,
  streak: 1,
  lastActiveDate: null,
  unlockedBadges: []
};

// 3. Audio Synthesis (Web Audio API Synthesizer)
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const now = audioCtx.currentTime;
    
    switch (type) {
      case 'pop': {
        // Soft bubble pop sound for message appearances
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }
      case 'click': {
        // Clean quick UI click
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(300, now + 0.04);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case 'success': {
        // Bright cheerful major arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          
          gain.gain.setValueAtTime(0.1, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.25);
        });
        break;
      }
      case 'error': {
        // Buzzing negative drop
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.linearRampToValueAtTime(110, now + 0.2); // A2
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
      case 'levelup': {
        // Grand rising synth sweep
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00]; // C4 to C7 major scale
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          
          gain.gain.setValueAtTime(0.08, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.4);
        });
        break;
      }
    }
  } catch (err) {
    console.error('Audio synthesizer error:', err);
  }
}

// 4. LocalStorage State Handlers
function saveStudentState() {
  localStorage.setItem('eduquest_student_state', JSON.stringify(studentState));
}

function loadStudentState() {
  const saved = localStorage.getItem('eduquest_student_state');
  if (saved) {
    try {
      studentState = JSON.parse(saved);
      // Ensure badges array is defined
      if (!studentState.unlockedBadges) studentState.unlockedBadges = [];
      validateStreak();
    } catch (e) {
      console.error('Could not parse student state, using defaults');
    }
  }
  updateGamificationUI();
}

function validateStreak() {
  const today = new Date().toDateString();
  if (studentState.lastActiveDate) {
    const lastActive = new Date(studentState.lastActiveDate);
    const diffTime = Math.abs(new Date() - lastActive);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      // Streak broken
      studentState.streak = 1;
    }
  } else {
    studentState.streak = 1;
  }
  studentState.lastActiveDate = today;
  saveStudentState();
}

// 5. Dynamic HTML/Markdown Parser
function parseMarkdown(text) {
  let html = text;
  
  // Escape HTML tags to prevent XSS in chatbot bubble
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Code blocks: ```javascript [code] ```
  html = html.replace(/```(javascript|python|html|css)?\n([\s\S]+?)\n```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'txt'}">${code.trim()}</code></pre>`;
  });
  
  // Inline Code: `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Italic: *text*
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Bullet Lists: \n- item
  html = html.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
  // Wrap sequential <li> tags with <ul>
  html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
  // Clean up duplicate contiguous <ul> tags
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Convert newlines to breaks (outside list and code tags)
  html = html.split('\n').map((line) => {
    if (line.startsWith('<pre>') || line.startsWith('</pre>') || line.startsWith('<li>') || line.startsWith('<ul>') || line.startsWith('</ul>') || line.trim() === '') {
      return line;
    }
    return line + '<br>';
  }).join('\n');

  return html;
}

// 6. UI Render Functions
function updateGamificationUI() {
  const xpBarFill = document.getElementById('xpBarFill');
  const levelDisplay = document.getElementById('levelDisplay');
  const xpText = document.getElementById('xpText');
  const streakVal = document.getElementById('streakVal');
  const totalXpVal = document.getElementById('totalXpVal');
  const studentRank = document.getElementById('studentRank');
  
  const xpNeeded = studentState.level * 100;
  const xpPct = Math.min((studentState.xp / xpNeeded) * 100, 100);
  
  xpBarFill.style.width = `${xpPct}%`;
  levelDisplay.innerText = `Level ${studentState.level}`;
  xpText.innerText = `${studentState.xp} / ${xpNeeded} XP`;
  streakVal.innerText = studentState.streak;
  totalXpVal.innerText = studentState.totalXp;
  
  // Update student rank title
  let rank = 'Novice Explorer';
  if (studentState.level >= 2) rank = 'Planetary Voyager';
  if (studentState.level >= 3) rank = 'Nebula Scholar';
  if (studentState.level >= 4) rank = 'Cosmic Mastermind';
  studentRank.innerText = rank;

  // Unlock badges in UI
  studentState.unlockedBadges.forEach(badgeId => {
    const badgeEl = document.getElementById(badgeId);
    if (badgeEl) {
      badgeEl.classList.remove('locked');
    }
  });
}

function gainXp(amount) {
  studentState.xp += amount;
  studentState.totalXp += amount;
  
  // Show XP Float Indicator
  const xpIndicator = document.getElementById('xpBubbleIndicator');
  xpIndicator.innerText = `+${amount} XP`;
  xpIndicator.classList.remove('animate-gain');
  void xpIndicator.offsetWidth; // Trigger reflow
  xpIndicator.classList.add('animate-gain');
  
  playSound('success');
  
  const xpNeeded = studentState.level * 100;
  if (studentState.xp >= xpNeeded) {
    levelUp();
  } else {
    saveStudentState();
    updateGamificationUI();
  }
}

function levelUp() {
  const xpNeeded = studentState.level * 100;
  studentState.xp -= xpNeeded;
  studentState.level += 1;
  
  saveStudentState();
  updateGamificationUI();
  
  // Award level badge if appropriate
  if (studentState.level >= 2) {
    unlockBadge('badge-level-up');
  }

  // Trigger level up modal
  setTimeout(() => {
    playSound('levelup');
    const modal = document.getElementById('levelUpModal');
    const modalLevel = document.getElementById('modalLevelBadge');
    modalLevel.innerText = `Level ${studentState.level}`;
    modal.classList.remove('hidden');
    
    // Spawn confetti pieces
    spawnConfetti();
  }, 600);
}

function unlockBadge(badgeId) {
  if (!studentState.unlockedBadges.includes(badgeId)) {
    studentState.unlockedBadges.push(badgeId);
    saveStudentState();
    updateGamificationUI();
    
    // Announce badge in chat
    setTimeout(() => {
      appendSystemMessage(`🎓 Achievement unlocked: ${document.getElementById(badgeId).querySelector('span').innerText}!`);
    }, 1200);
  }
}

function spawnConfetti() {
  const container = document.getElementById('confettiContainer');
  container.innerHTML = '';
  const colors = ['#00f5d4', '#00bbf9', '#9b5de5', '#f15bb5', '#ffb703', '#fb8500'];
  
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti-piece');
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(confetti);
  }
}

// 7. Chat Feed Rendering Engine
function appendMessage(sender, text, isBot = false, customIcon = 'atom') {
  const chatScrollContainer = document.getElementById('chatScrollContainer');
  
  const group = document.createElement('div');
  group.className = `message-group ${isBot ? 'bot-message-group' : 'user-message-group'}`;
  
  let avatarHtml = '';
  if (isBot) {
    let avatarClass = 'science-avatar';
    if (activeTutorKey === 'alpha') avatarClass = 'math-avatar';
    if (activeTutorKey === 'clio') avatarClass = 'history-avatar';
    if (activeTutorKey === 'pixel') avatarClass = 'coding-avatar';
    
    avatarHtml = `
      <div class="message-avatar ${avatarClass}">
        <i data-lucide="${customIcon}"></i>
      </div>
    `;
  }
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  group.innerHTML = `
    ${avatarHtml}
    <div class="message-content-wrapper">
      <div class="sender-name">${sender}</div>
      <div class="message-bubble bubble-pop">
        ${isBot ? parseMarkdown(text) : `<p>${text}</p>`}
      </div>
      <div class="message-time">${timeStr}</div>
    </div>
  `;
  
  chatScrollContainer.appendChild(group);
  lucide.createIcons({ attrs: { class: 'lucide-icon' }, node: group });
  
  chatScrollContainer.scrollTop = chatScrollContainer.scrollHeight;
  playSound('pop');
}

function appendSystemMessage(text) {
  const chatScrollContainer = document.getElementById('chatScrollContainer');
  const alertEl = document.createElement('div');
  alertEl.style.cssText = `
    align-self: center;
    background: rgba(255, 190, 11, 0.1);
    border: 1px solid rgba(255, 190, 11, 0.3);
    color: #ffbe0b;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    margin: 8px 0;
    text-align: center;
    animation: popIn 0.3s ease;
  `;
  alertEl.innerText = text;
  chatScrollContainer.appendChild(alertEl);
  chatScrollContainer.scrollTop = chatScrollContainer.scrollHeight;
}

// Render dynamic quiz card inside chat bubble
function appendQuizCard(quizObj) {
  const chatScrollContainer = document.getElementById('chatScrollContainer');
  
  const card = document.createElement('div');
  card.className = 'quiz-card';
  
  const optionsHtml = quizObj.options.map((opt, idx) => `
    <button type="button" class="quiz-option-btn" data-index="${idx}">
      <span>${opt}</span>
      <i data-lucide="circle"></i>
    </button>
  `).join('');
  
  card.innerHTML = `
    <span class="quiz-badge">${TUTORS[activeTutorKey].name} Challenge</span>
    <div class="quiz-question">${quizObj.question}</div>
    <div class="quiz-options">
      ${optionsHtml}
    </div>
    <div class="quiz-feedback hidden" id="quizFeedback"></div>
  `;
  
  chatScrollContainer.appendChild(card);
  lucide.createIcons({ node: card });
  chatScrollContainer.scrollTop = chatScrollContainer.scrollHeight;
  playSound('pop');
  
  // Add option click event listeners
  const buttons = card.querySelectorAll('.quiz-option-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedIdx = parseInt(btn.getAttribute('data-index'));
      
      // Disable all buttons in this card
      buttons.forEach(b => {
        b.disabled = true;
        b.style.pointerEvents = 'none';
        b.style.opacity = '0.6';
      });
      btn.style.opacity = '1';
      
      const feedbackDiv = card.querySelector('#quizFeedback');
      feedbackDiv.classList.remove('hidden');
      
      if (selectedIdx === quizObj.answerIndex) {
        // Correct answer!
        btn.classList.add('correct');
        const icon = btn.querySelector('[data-lucide]');
        icon.setAttribute('data-lucide', 'check-circle');
        
        feedbackDiv.className = 'quiz-feedback correct-feedback';
        feedbackDiv.innerHTML = `<i data-lucide="sparkles"></i> <span>${quizObj.feedback}</span>`;
        
        gainXp(20);
        unlockBadge('badge-quiz-master');
      } else {
        // Incorrect answer
        btn.classList.add('incorrect');
        const icon = btn.querySelector('[data-lucide]');
        icon.setAttribute('data-lucide', 'x-circle');
        
        // Highlight correct answer
        buttons[quizObj.answerIndex].style.opacity = '1';
        buttons[quizObj.answerIndex].classList.add('correct');
        buttons[quizObj.answerIndex].querySelector('[data-lucide]').setAttribute('data-lucide', 'check-circle');
        
        feedbackDiv.className = 'quiz-feedback incorrect-feedback';
        feedbackDiv.innerHTML = `<i data-lucide="help-circle"></i> <span>Nice try! The correct answer was: <strong>${quizObj.options[quizObj.answerIndex]}</strong>.</span>`;
        
        playSound('error');
      }
      
      lucide.createIcons({ node: card });
      chatScrollContainer.scrollTop = chatScrollContainer.scrollHeight;
    });
  });
}

// Load suggestion chips dynamically
function loadSuggestions(tutorKey) {
  const container = document.getElementById('suggestionsContainer');
  container.innerHTML = '';
  const chips = TUTORS[tutorKey].suggestions;
  
  chips.forEach(text => {
    const chip = document.createElement('div');
    chip.className = 'suggestion-chip';
    chip.innerText = text;
    chip.addEventListener('click', () => {
      // Trigger sending of this chip directly
      playSound('click');
      handleUserSubmit(text);
    });
    container.appendChild(chip);
  });
}

// 8. Agent AI Typing/Response Engine
function showTypingIndicator(tutor) {
  const indicator = document.getElementById('typingIndicator');
  const avatar = document.getElementById('typingAvatar');
  const chatScrollContainer = document.getElementById('chatScrollContainer');
  
  // Set avatar specific class
  avatar.className = 'typing-avatar';
  if (activeTutorKey === 'cosmo') avatar.classList.add('science-avatar');
  if (activeTutorKey === 'alpha') avatar.classList.add('math-avatar');
  if (activeTutorKey === 'clio') avatar.classList.add('history-avatar');
  if (activeTutorKey === 'pixel') avatar.classList.add('coding-avatar');
  
  avatar.innerHTML = `<i data-lucide="${tutor.icon}"></i>`;
  lucide.createIcons({ node: avatar });
  
  indicator.classList.remove('hidden');
  chatScrollContainer.scrollTop = chatScrollContainer.scrollHeight;
}

function hideTypingIndicator() {
  document.getElementById('typingIndicator').classList.add('hidden');
}

function getBotReply(userText, tutor) {
  const normText = userText.toLowerCase();
  
  // Check if they want a quiz
  if (normText.includes('quiz') || normText.includes('challenge') || normText.includes('question')) {
    const randomQuiz = tutor.quizzes[Math.floor(Math.random() * tutor.quizzes.length)];
    return { type: 'quiz', content: randomQuiz };
  }
  
  // Find match in responses
  let replyText = null;
  Object.keys(tutor.responses).forEach(key => {
    if (normText.includes(key)) {
      replyText = tutor.responses[key];
    }
  });
  
  if (!replyText) {
    replyText = tutor.responses['default'];
  }
  
  // Adjust based on study vs playful mode
  if (!isStudyMode) {
    replyText = "✨ [Playful Mode Active] ✨\n" + replyText + "\n\nWoohoo! Learning is like a giant game of space invader tag, right? 👾🛸";
  }
  
  return { type: 'text', content: replyText };
}

function getSystemPrompt(tutorKey) {
  let basePrompt = TUTOR_SYSTEM_PROMPTS[tutorKey];
  if (!isStudyMode) {
    basePrompt += " [Playful Mode Active] Make your reply shorter, funnier, use video game/space quest analogies, tell a joke, and use plenty of emojis!";
  }
  return basePrompt;
}

async function fetchGroqResponse(userText, tutorKey) {
  const tutor = TUTORS[tutorKey];
  
  // Maintain context window of last 6 messages
  const history = chatHistories[tutorKey];
  history.push({ role: 'user', content: userText });
  if (history.length > 6) {
    history.shift(); // keep sliding window
  }
  
  const messages = [
    { role: 'system', content: getSystemPrompt(tutorKey) }
  ];
  
  history.forEach(msg => messages.push(msg));
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const botReply = data.choices[0].message.content;
    
    history.push({ role: 'assistant', content: botReply });
    if (history.length > 6) {
      history.shift();
    }
    
    return botReply;
  } catch (error) {
    console.error("Groq API Call Failed, falling back to mock database:", error);
    history.pop(); // Remove user query from history since it failed
    throw error;
  }
}

function processAgentResponse(userText) {
  const tutor = TUTORS[activeTutorKey];
  showTypingIndicator(tutor);
  
  // Check if they want a quiz
  const normText = userText.toLowerCase();
  if (normText.includes('quiz') || normText.includes('challenge') || normText.includes('question')) {
    setTimeout(() => {
      hideTypingIndicator();
      const randomQuiz = tutor.quizzes[Math.floor(Math.random() * tutor.quizzes.length)];
      appendMessage(tutor.name, "Alright, cadet! Solve this challenge to earn 20 XP! 🏆", true, tutor.icon);
      setTimeout(() => {
        appendQuizCard(randomQuiz);
      }, 500);
      checkExplorerBadge();
    }, 1200);
    return;
  }
  
  // Otherwise, query the Groq API with fallback
  fetchGroqResponse(userText, activeTutorKey)
    .then(botReplyText => {
      hideTypingIndicator();
      appendMessage(tutor.name, botReplyText, true, tutor.icon);
      gainXp(10);
      checkExplorerBadge();
    })
    .catch(() => {
      // Fallback to local mock data
      const reply = getBotReply(userText, tutor);
      hideTypingIndicator();
      appendMessage(tutor.name, reply.content + "\n\n*(Note: Running in offline/fallback mode)*", true, tutor.icon);
      gainXp(10);
      checkExplorerBadge();
    });
}

// 9. Input & Submission Handlers
function handleUserSubmit(text) {
  if (!text || text.trim() === '') return;
  
  // Append user bubble
  appendMessage('You', text, false);
  
  // First word badge
  unlockBadge('badge-first-msg');
  
  // Process Response
  processAgentResponse(text);
}

let visitedTutors = ['cosmo'];
function checkExplorerBadge() {
  if (!visitedTutors.includes(activeTutorKey)) {
    visitedTutors.push(activeTutorKey);
  }
  if (visitedTutors.length === 4) {
    unlockBadge('badge-explorer');
  }
}

// 10. Document Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Load saved state
  loadStudentState();
  
  const inputForm = document.getElementById('inputForm');
  const chatInput = document.getElementById('chatInput');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const studyModeCheckbox = document.getElementById('studyModeCheckbox');
  const openSidebarBtn = document.getElementById('openSidebarBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.getElementById('sidebar');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const levelUpModal = document.getElementById('levelUpModal');
  const emojiBtn = document.getElementById('emojiBtn');
  const emojiPicker = document.getElementById('emojiPicker');
  const emojiGrid = document.getElementById('emojiGrid');
  const voiceBtn = document.getElementById('voiceBtn');
  const attachBtn = document.getElementById('attachBtn');
  
  // Load Cosmo chips initially
  loadSuggestions('cosmo');
  
  // Chat submit
  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value;
    chatInput.value = '';
    handleUserSubmit(text);
  });
  
  // Sound Toggle
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundIcon.setAttribute('data-lucide', 'volume-2');
      playSound('click');
    } else {
      soundIcon.setAttribute('data-lucide', 'volume-x');
    }
    lucide.createIcons({ node: soundToggleBtn });
  });

  // Study Mode Toggle
  studyModeCheckbox.addEventListener('change', (e) => {
    isStudyMode = e.target.checked;
    playSound('click');
    
    // Toggle active classes on labels
    const labels = document.querySelectorAll('.mode-label');
    if (isStudyMode) {
      labels[0].classList.remove('active');
      labels[1].classList.add('active');
      appendSystemMessage("Study Mode Active: Rich, informative scientific answers enabled.");
    } else {
      labels[0].classList.add('active');
      labels[1].classList.remove('active');
      appendSystemMessage("Playful Mode Active: AI responses will be shorter, funnier, and gamified!");
    }
  });

  // Responsive Sidebar Toggle
  openSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('sidebar-open');
    playSound('click');
  });

  closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('sidebar-open');
    playSound('click');
  });

  // Level Up Modal Close
  modalCloseBtn.addEventListener('click', () => {
    levelUpModal.classList.add('hidden');
    playSound('click');
  });

  // Tutor Switches
  const tutorItems = document.querySelectorAll('.tutor-item');
  tutorItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('active')) return;
      
      const tutorKey = item.getAttribute('data-tutor');
      const tutor = TUTORS[tutorKey];
      
      // Update sidebar highlight
      tutorItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Update body class theme
      document.body.className = '';
      document.body.classList.add(tutor.themeClass);
      activeTutorKey = tutorKey;
      
      // Update header info
      const headerTutorAvatar = document.getElementById('headerTutorAvatar');
      const headerTutorName = document.getElementById('headerTutorName');
      const headerTutorStatus = document.getElementById('headerTutorStatus');
      const headerTutorPulse = document.getElementById('headerTutorPulse');
      
      // Set header color theme
      headerTutorAvatar.className = 'active-tutor-avatar';
      headerTutorAvatar.innerHTML = `<i data-lucide="${tutor.icon}"></i>`;
      headerTutorName.innerText = tutor.name;
      headerTutorStatus.innerText = tutor.statusText;
      
      // Update pulses
      headerTutorPulse.className = `active-pulse ${tutorKey}-pulse`;
      
      lucide.createIcons({ node: headerTutorAvatar });
      
      // Reload chips
      loadSuggestions(tutorKey);
      
      // Set new placeholder
      chatInput.placeholder = `Ask ${tutor.name} a ${tutor.subject.split(' ')[0].toLowerCase()} question...`;
      
      // Render welcome message
      appendMessage(tutor.name, tutor.greeting, true, tutor.icon);
      
      // Close sidebar on mobile after selection
      sidebar.classList.remove('sidebar-open');
      playSound('click');
    });
  });

  // Emoji Picker Populator
  const EMOJIS = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😜', '🤪', '🤨', '🧐', '😎'],
    space: ['🪐', '🚀', '🌌', '🌍', '☄️', '🛰️', '🌠', '🛸', '🌙', '☀️', '⭐', '✨'],
    school: ['🎒', '📚', '📝', '✏️', '🔬', '🎨', '📐', '📊', '💻', '💡', '🎓', '🏆'],
    food: ['🍕', '🍔', '🍟', '🍩', '🍪', '🍫', '🍿', '🥤', '🍎', '🍓', '🍌', '🍦']
  };

  function renderEmojis(tabKey) {
    emojiGrid.innerHTML = '';
    EMOJIS[tabKey].forEach(emoji => {
      const el = document.createElement('div');
      el.className = 'emoji-item';
      el.innerText = emoji;
      el.addEventListener('click', () => {
        chatInput.value += emoji;
        chatInput.focus();
        emojiPicker.classList.add('hidden');
        playSound('click');
      });
      emojiGrid.appendChild(el);
    });
  }

  // Initial emoji load
  renderEmojis('smileys');

  emojiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    emojiPicker.classList.toggle('hidden');
    playSound('click');
  });

  // Emoji tabs click
  const emojiTabs = document.querySelectorAll('.emoji-tab');
  emojiTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      emojiTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabKey = tab.getAttribute('data-tab');
      renderEmojis(tabKey);
      playSound('click');
    });
  });

  // Hide emoji picker when clicking outside
  document.addEventListener('click', () => {
    emojiPicker.classList.add('hidden');
  });
  emojiPicker.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Simulate Homework/Image Upload Attachment
  attachBtn.addEventListener('click', () => {
    playSound('click');
    appendSystemMessage("📎 Homework scanner activated! Scanning your math/science workbook page...");
    
    showTypingIndicator(TUTORS[activeTutorKey]);
    setTimeout(() => {
      hideTypingIndicator();
      let response = '';
      if (activeTutorKey === 'cosmo') {
        response = "I scanned your science page! 🧪 It looks like you're studying chemical reactions. Remember, when baking soda and vinegar mix, they release **Carbon Dioxide gas (CO2)** which makes it bubble up!";
      } else if (activeTutorKey === 'alpha') {
        response = "Scanned workbook page found! 📐 Let's solve that equation: `3x + 5 = 17`.\n1. Subtract 5 from both sides: `3x = 12`.\n2. Divide by 3: `x = 4`! Easy peasy!";
      } else if (activeTutorKey === 'clio') {
        response = "Ah, an ancient drawing scanned! 🏺 This represents the Mayan calendar. They had a highly advanced understanding of astronomy and mathematics, using a base-20 numbering system!";
      } else {
        response = "Scanned code snippet: `print('Hello World')`! Looks correct, you're on the right track! 💻";
      }
      appendMessage(TUTORS[activeTutorKey].name, response, true, TUTORS[activeTutorKey].icon);
      gainXp(15);
    }, 2000);
  });

  // Simulate Voice Assistant Typing
  voiceBtn.addEventListener('click', () => {
    if (voiceBtn.classList.contains('active')) return;
    
    playSound('click');
    voiceBtn.classList.add('active');
    chatInput.placeholder = "Listening... Speak now! 🎙️";
    
    // Simulate speaking delay
    setTimeout(() => {
      voiceBtn.classList.remove('active');
      
      // Pick a speakable query based on current tutor
      let spokenQuery = "Why is the sky blue?";
      if (activeTutorKey === 'alpha') spokenQuery = "Give me a Math Puzzle!";
      if (activeTutorKey === 'clio') spokenQuery = "Who built the Pyramids?";
      if (activeTutorKey === 'pixel') spokenQuery = "What is HTML?";
      
      chatInput.value = spokenQuery;
      chatInput.placeholder = `Ask ${TUTORS[activeTutorKey].name}...`;
      
      // Auto-submit after typing simulation
      setTimeout(() => {
        chatInput.value = '';
        handleUserSubmit(spokenQuery);
      }, 800);
      
    }, 2000);
  });
});
