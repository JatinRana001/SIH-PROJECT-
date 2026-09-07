const { useState, useEffect, useRef } = React;

// ==========================================
// VOICE PACK DEFINITIONS & REGIONAL METADATA
// ==========================================
const VOICE_PACKS = {
  hi: {
    id: 'hi',
    code: 'hi-IN',
    localeAliases: ['hi'],
    guidanceAvailable: true,
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    region: 'India (Hindi)',
    previewPhrase: "आइए आज की गतिविधि शुरू करते हैं। अपना समय लें।"
  },
  en: {
    id: 'en',
    code: 'en-IN',
    localeAliases: ['en-GB', 'en-US', 'en'],
    guidanceAvailable: true,
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    region: 'India / International',
    previewPhrase: "Let's begin today's activity. Take your time."
  },
  pa: {
    id: 'pa',
    code: 'pa-IN',
    localeAliases: ['pa-Guru-IN', 'pa-PK', 'pa'],
    guidanceAvailable: false,
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
    region: 'Punjab',
    previewPhrase: "ਆਓ ਅੱਜ ਦੀ ਗਤੀਵਿਧੀ ਸ਼ੁਰੂ ਕਰੀਏ। ਆਪਣਾ ਸਮਾਂ ਲਓ।"
  },
  bn: {
    id: 'bn',
    code: 'bn-IN',
    localeAliases: ['bn-BD', 'bn'],
    guidanceAvailable: false,
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    region: 'Bengal',
    previewPhrase: "আসুন আজকের কার্যকলাপ শুরু করি। আপনার সময় নিন।"
  },
  ta: {
    id: 'ta',
    code: 'ta-IN',
    localeAliases: ['ta-LK', 'ta'],
    guidanceAvailable: false,
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    region: 'Tamil Nadu',
    previewPhrase: "இன்றைய பயிற்சியை ஆரம்பிப்போம். நிதானமாக செய்யுங்கள்."
  },
  te: {
    id: 'te',
    code: 'te-IN',
    localeAliases: ['te'],
    guidanceAvailable: false,
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    region: 'Andhra / Telangana',
    previewPhrase: "ఈ రోజు కార్యకలాపాన్ని ప్రారంభిద్దాం. సమయం తీసుకోండి."
  },
  mr: {
    id: 'mr',
    code: 'mr-IN',
    localeAliases: ['mr'],
    guidanceAvailable: false,
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    region: 'Maharashtra',
    previewPhrase: "चला आजची क्रिया सुरू करूया. आपला वेळ घ्या."
  },
  gu: {
    id: 'gu',
    code: 'gu-IN',
    localeAliases: ['gu'],
    guidanceAvailable: false,
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🇮🇳',
    region: 'Gujarat',
    previewPhrase: "ચાલો આજની પ્રવૃત્તિ શરૂ કરીએ. તમારો સમય લો."
  },
  kn: {
    id: 'kn',
    code: 'kn-IN',
    localeAliases: ['kn'],
    guidanceAvailable: false,
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    region: 'Karnataka',
    previewPhrase: "ಇಂದಿನ ಚಟುವಟಿಕೆಯನ್ನು ಪ್ರಾರಂಭಿಸೋಣ. ನಿಮ್ಮ ಸಮಯ ತೆಗೆದುಕೊಳ್ಳಿ."
  },
  ml: {
    id: 'ml',
    code: 'ml-IN',
    localeAliases: ['ml'],
    guidanceAvailable: false,
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    region: 'Kerala',
    previewPhrase: "ഇന്നത്തെ പ്രവർത്തനം ആരംഭിക്കാം. നിങ്ങളുടെ സമയമെടുക്കൂ."
  }
};

const RELATION_MAP = {
  hi: {
    'Grandson': 'पोते',
    'Daughter': 'बेटी',
    'Son': 'बेटे',
    'Beloved Wife': 'धर्मपत्नी',
    'Wife': 'पत्नी',
    'Great-Nephew': 'भतीजे',
    'Relative': 'रिश्तेदार',
    'Family': 'परिवार'
  },
  pa: {
    'Grandson': 'ਪੋਤੇ',
    'Daughter': 'ਧੀ',
    'Son': 'ਪੁੱਤਰ',
    'Beloved Wife': 'ਧਰਮਪਤਨੀ',
    'Wife': 'ਪਤਨੀ',
    'Great-Nephew': 'ਭਤੀਜੇ',
    'Relative': 'ਰਿਸ਼ਤੇਦਾਰ',
    'Family': 'ਪਰਿਵਾਰ'
  }
};

// ==========================================
// CENTRALIZED LOCALIZATION DICTIONARY
// ==========================================
const LOCALIZATION = {
  en: {
    nav: {
      home: 'Home',
      session: "Today's Session",
      checkin: 'Daily Check-in',
      games: 'All 8 Games',
      routine: 'My Routine',
      reminders: 'Reminders',
      family: 'Family Album',
      profile: 'My Profile'
    },
    greetings: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      welcomeSubtitle: "Let's spend a few relaxing, joyful minutes together today. Your family, familiar routines, and favorite memories are waiting.",
      streak: "Day Streak!",
      startSession: "Start Today's Session",
      reviewSession: "Review Today's Activities",
      dailyCheckinBtn: "Daily Family Check-in",
      recommendedTitle: "Today's Recommended Activities",
      recommendedSubtitle: "Carefully chosen for comfort, memory, and joyful familiarity.",
      exploreGames: "Explore all 8 games →"
    },
    voice: {
      listen: "Listen",
      stop: "Stop",
      speaking: "Speaking...",
      preview: "Preview Voice",
      changeVoice: "Change Voice Pack",
      voicePack: "Voice Pack",
      interfaceLang: "Interface Language",
      speed: "Speech Speed",
      autoRead: "Auto Read Questions",
      voiceGuidance: "Voice Guidance",
      testVoice: "Test Voice"
    },
    buttons: {
      continue: "Continue",
      nextActivity: "Next Activity →",
      confirmSeq: "Confirm Sequence ✓",
      needHint: "Need a gentle hint? 💡",
      exitSession: "Exit Session",
      completeCheckin: "Complete Check-in ✓",
      save: "Save",
      cancel: "Cancel",
      done: "Done ✓"
    },
    session: {
      activity: "Activity",
      of: "of",
      question: "Question",
      completeTitle: "Session Complete!",
      completeSubtitle: "Wonderful effort today! You completed all activities peacefully.",
      backHome: "Back to Dashboard →"
    }
  },
  hi: {
    nav: {
      home: 'होम',
      session: "आज का सत्र",
      checkin: 'दैनिक चेक-इन',
      games: 'सभी 8 खेल',
      routine: 'मेरी दिनचर्या',
      reminders: 'रिमाइंडर्स',
      family: 'परिवार का एल्बम',
      profile: 'मेरी प्रोफ़ाइल'
    },
    greetings: {
      morning: 'सुप्रभात',
      afternoon: 'शुभ दोपहर',
      evening: 'शुभ संध्या',
      welcomeSubtitle: "आइए आज कुछ शांत और आनंददायक पल साथ बिताएं। आपका परिवार, परिचित दिनचर्या और प्यारी यादें आपका इंतज़ार कर रही हैं।",
      streak: "दिनों का सिलसिला!",
      startSession: "आज का सत्र शुरू करें",
      reviewSession: "आज की गतिविधियों की समीक्षा",
      dailyCheckinBtn: "दैनिक पारिवारिक चेक-इन",
      recommendedTitle: "आज की सुझाई गई गतिविधियाँ",
      recommendedSubtitle: "सहानुभूति, याददाश्त और अपनापन बनाए रखने के लिए चुनी गईं।",
      exploreGames: "सभी 8 खेल देखें →"
    },
    voice: {
      listen: "सुनें 🔊",
      stop: "रोकें ⏹",
      speaking: "बोल रहे हैं...",
      preview: "आवाज़ का नमूना सुनें",
      changeVoice: "वॉइस पैक बदलें",
      voicePack: "बोलने की भाषा (वॉइस पैक)",
      interfaceLang: "स्क्रीन की भाषा (इंटरफ़ेस)",
      speed: "बोलने की गति",
      autoRead: "सवाल अपने आप पढ़कर सुनाएं",
      voiceGuidance: "आवाज़ सहायता",
      testVoice: "आवाज़ का परीक्षण करें"
    },
    buttons: {
      continue: "आगे बढ़ें",
      nextActivity: "अगली गतिविधि →",
      confirmSeq: "क्रम की पुष्टि करें ✓",
      needHint: "एक मददगार संकेत चाहिए? 💡",
      exitSession: "सत्र से बाहर निकलें",
      completeCheckin: "चेक-इन पूरा करें ✓",
      save: "सुरक्षित करें",
      cancel: "रद्द करें",
      done: "संपन्न ✓"
    },
    session: {
      activity: "गतिविधि",
      of: "कुल",
      question: "सवाल",
      completeTitle: "सत्र सफलता से पूरा हुआ!",
      completeSubtitle: "आज का दिन बहुत सुंदर रहा! आपने सभी गतिविधियाँ आराम से पूरी कर लीं।",
      backHome: "होम पर लौटें →"
    }
  }
};

// ==========================================
// CENTRALIZED VOICE SERVICE (Web Speech API)
// ==========================================
function answersMatch(selectedAnswer, correctAnswer) {
  if (Array.isArray(selectedAnswer) || Array.isArray(correctAnswer)) {
    return Array.isArray(selectedAnswer)
      && Array.isArray(correctAnswer)
      && selectedAnswer.length === correctAnswer.length
      && selectedAnswer.every((value, index) => answersMatch(value, correctAnswer[index]));
  }

  const selectedHasId = selectedAnswer && typeof selectedAnswer === 'object' && 'id' in selectedAnswer;
  const correctHasId = correctAnswer && typeof correctAnswer === 'object' && 'id' in correctAnswer;
  if (selectedHasId || correctHasId) {
    return String(selectedHasId ? selectedAnswer.id : selectedAnswer) === String(correctHasId ? correctAnswer.id : correctAnswer);
  }

  if (selectedAnswer && correctAnswer && typeof selectedAnswer === 'object' && typeof correctAnswer === 'object') {
    return JSON.stringify(selectedAnswer) === JSON.stringify(correctAnswer);
  }

  return typeof selectedAnswer === 'number' && typeof correctAnswer === 'number'
    ? selectedAnswer === correctAnswer
    : String(selectedAnswer) === String(correctAnswer);
}

function getCorrectAnswer(question) {
  if (Array.isArray(question.correct_sequence)) return question.correct_sequence;
  if (Object.prototype.hasOwnProperty.call(question, 'correct_answer')) return question.correct_answer;
  if (Object.prototype.hasOwnProperty.call(question, 'correct_answer_id')) return question.correct_answer_id;
  if (Number.isInteger(question.correct_answer_index) && Array.isArray(question.options)) {
    return question.options[question.correct_answer_index];
  }
  return undefined;
}

class VoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isSpeaking = false;
    this.isPaused = false;
    this.listeners = new Set();
    this.voiceAvailabilityListeners = new Set();
    this.enabled = true;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const loadVoices = () => {
      this.voices = this.synth.getVoices();
      this.notifyVoiceAvailability();
    };
    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  getAvailableVoices() {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  getBestVoiceForLang(langId) {
    const all = this.getAvailableVoices();
    const pack = VOICE_PACKS[langId];
    if (!pack) return null;
    const normalizeLocale = (locale) => locale.toLowerCase().replace(/_/g, '-');
    const supportedLocales = [pack.code, ...(pack.localeAliases || [])].map(normalizeLocale);
    const baseCodes = new Set(supportedLocales.map(locale => locale.split('-')[0]));

    // 1. Exact locale or a documented locale alias for the selected pack.
    let match = all.find(v => supportedLocales.includes(normalizeLocale(v.lang)));
    if (match) return match;

    // 2. Same base language, regardless of country/script variant.
    match = all.find(v => baseCodes.has(normalizeLocale(v.lang).split('-')[0]));
    if (match) return match;

    // 3. Match voice name containing language (e.g. "Hindi", "Kalpana", "Hemant")
    match = all.find(v => v.name.toLowerCase().includes(pack.name.toLowerCase()));
    if (match) return match;

    // Never substitute a different language's default voice.
    return null;
  }

  speak(text, langId = 'hi', speed = 'normal', onStart = null, onEnd = null) {
    // Voice is an accessibility layer: disabling it must never affect the game.
    if (!this.enabled) {
      if (onEnd) onEnd();
      return;
    }
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    if (!this.isVoiceAvailable(langId)) {
      const pack = VOICE_PACKS[langId];
      console.warn(pack
        ? `Spoken guidance is unavailable for ${pack.name}.`
        : `Unknown voice pack: ${langId}`);
      if (onEnd) onEnd();
      return;
    }
    this.stop();

    if (!text || typeof text !== 'string') {
      if (onEnd) onEnd();
      return;
    }

    // Clean text of emojis & HTML markup
    const cleanText = text
      .replace(/<[^>]*>?/gm, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}\u{1F900}-\u{1F9FF}]/gu, '')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const pack = VOICE_PACKS[langId];
    if (!pack) {
      console.warn(`Unknown voice pack: ${langId}`);
      if (onEnd) onEnd();
      return;
    }
    const voice = this.getBestVoiceForLang(langId);
    if (!voice) {
      console.warn(`No installed voice is available for ${pack.name} (${pack.code}).`);
      if (onEnd) onEnd();
      return;
    }

    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = pack.code;
    utter.voice = voice;

    // Rate calculation based on user preference
    let rate = 0.9;
    if (speed === 'slow') rate = 0.75;
    else if (speed === 'fast') rate = 1.1;
    utter.rate = rate;
    utter.pitch = 1.0;

    utter.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.notifyState();
      if (onStart) onStart();
    };

    utter.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.notifyState();
      if (onEnd) onEnd();
    };

    utter.onerror = (err) => {
      console.warn("Speech synthesis notice:", err);
      this.isSpeaking = false;
      this.isPaused = false;
      this.notifyState();
      if (onEnd) onEnd();
    };

    try {
      this.synth.speak(utter);
    } catch (e) {
      console.warn("Error calling speak:", e);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
      this.isSpeaking = false;
      this.isPaused = false;
      this.notifyState();
    }
  }

  pause() {
    if (this.synth && this.isSpeaking) {
      this.synth.pause();
      this.isPaused = true;
      this.notifyState();
    }
  }

  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notifyState();
    }
  }

  setVoicePack(language) {
    this.currentVoicePack = language;
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    if (!this.enabled) this.stop();
  }

  isVoiceAvailable(langId) {
    const pack = VOICE_PACKS[langId];
    return Boolean(pack?.guidanceAvailable && this.getBestVoiceForLang(langId));
  }

  getVoiceAvailability() {
    return Object.fromEntries(Object.keys(VOICE_PACKS).map(id => [id, this.isVoiceAvailable(id)]));
  }

  previewVoice(langId, speed = 'normal', onStart = null, onEnd = null) {
    const pack = VOICE_PACKS[langId];
    if (!pack) {
      console.warn(`Unknown voice pack: ${langId}`);
      if (onEnd) onEnd();
      return;
    }
    const sample = pack.previewPhrase || "आइए आज की गतिविधि शुरू करते हैं।";
    this.speak(sample, langId, speed, onStart, onEnd);
  }

  addListener(fn) {
    this.listeners.add(fn);
  }

  removeListener(fn) {
    this.listeners.delete(fn);
  }

  addVoiceAvailabilityListener(fn) {
    this.voiceAvailabilityListeners.add(fn);
    return () => this.voiceAvailabilityListeners.delete(fn);
  }

  notifyVoiceAvailability() {
    const availability = this.getVoiceAvailability();
    this.voiceAvailabilityListeners.forEach(fn => fn(availability));
  }

  notifyState() {
    this.listeners.forEach(fn => fn({ isSpeaking: this.isSpeaking, isPaused: this.isPaused }));
  }
}

const voiceService = new VoiceService();

function VoicePlaybackControls({ enabled }) {
  const [state, setState] = useState({ isSpeaking: false, isPaused: false });

  useEffect(() => {
    const listener = (nextState) => setState(nextState);
    voiceService.addListener(listener);
    return () => voiceService.removeListener(listener);
  }, []);

  if (!enabled || !state.isSpeaking) return null;
  return (
    <div className="hidden sm:flex items-center gap-1 rounded-xl border border-skysoft-200 bg-skysoft-50 p-1" aria-label="Voice playback controls">
      <button
        type="button"
        onClick={() => state.isPaused ? voiceService.resume() : voiceService.pause()}
        className="px-2 py-1 rounded-lg text-xs font-bold text-skysoft-700 hover:bg-white"
        aria-label={state.isPaused ? 'Resume speaking' : 'Pause speaking'}
      >
        {state.isPaused ? '▶ Resume' : '⏸ Pause'}
      </button>
      <button
        type="button"
        onClick={() => voiceService.stop()}
        className="px-2 py-1 rounded-lg text-xs font-bold text-stone-600 hover:bg-white"
        aria-label="Stop speaking"
      >
        ⏹ Stop
      </button>
    </div>
  );
}

// ==========================================
// AUDIO SYNTHESIZER (Gentle Web Audio Chimes)
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  playChime(type = 'success') {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      if (type === 'success') {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.45);
        });
      } else if (type === 'hint') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'tap') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      console.warn("Audio chime notice:", e);
    }
  }
}

const sounds = new SoundEngine();

// ==========================================
// REUSABLE SPOKEN CONTENT RESOLVER
// ==========================================
function getSpokenQuestionText(question, voiceLang, famList) {
  if (voiceLang === 'hi' && question.audio_text_hi) return question.audio_text_hi;
  if (voiceLang === 'en' && (question.audio_text_en || question.audio_text)) return question.audio_text_en || question.audio_text;

  if (question.id === 'gf_q1') {
    if (voiceLang === 'hi') return "यह कौन है? तस्वीर देखकर नाम पहचानिए।";
    if (voiceLang === 'pa') return "ਇਹ ਜਾਣਿਆ-ਪਛਾਣਿਆ ਚਿਹਰਾ ਕਿਸ ਦਾ ਹੈ? ਫੋਟੋ ਦੇਖ ਕੇ ਨਾਮ ਚੁਣੋ।";
    return "Who is this familiar smiling person? Look at the photo and choose their name.";
  }
  if (question.id === 'gf_q2') {
    const memberName = famList && famList[1] ? famList[1].name : "Priya";
    if (voiceLang === 'hi') return `${memberName} के साथ आपका क्या खास रिश्ता है?`;
    if (voiceLang === 'pa') return `${memberName} ਨਾਲ ਤੁਹਾਡਾ ਕੀ ਖਾਸ ਰਿਸ਼ਤਾ ਹੈ?`;
    return `What is your special relationship with ${memberName}?`;
  }
  if (question.game_type === 'memory') {
    if (voiceLang === 'hi') return "इन चार वस्तुओं को ध्यान से देखें और याद रखें। कुछ ही पलों में ये छिप जाएंगी।";
    return "Look carefully at these objects. In a moment, they will hide!";
  }
  if (question.game_type === 'attention') {
    if (voiceLang === 'hi') return "स्क्रीन पर दिख रहे केवल शांत नीले घेरों को ध्यान से छुएं। कोई जल्दी नहीं है।";
    return "Focus and tap each blue calm circle you see on the screen. Take your time.";
  }
  if (question.game_type === 'sequencing') {
    if (voiceLang === 'hi') return "आप आमतौर पर सुबह सबसे पहले क्या करते हैं? आदतों को सही क्रम में लगाएं।";
    return "What do you normally do first in the morning? Arrange the steps from first to last.";
  }
  if (question.game_type === 'semantic') {
    if (voiceLang === 'hi') return "इस वस्तु का इस्तेमाल हम किस काम के लिए करते हैं?";
    return question.audio_text || "What do we use this everyday object for?";
  }
  if (question.game_type === 'culture') {
    if (voiceLang === 'hi') return "दीपों और रोशनी का यह कौन सा पावन त्योहार है?";
    return question.audio_text || "Which joyful festival is celebrated with lights and diyas?";
  }
  if (question.game_type === 'reasoning') {
    if (voiceLang === 'hi') return "क्रम को ध्यान से देखें: 2, 4, 6, इसके बाद कौन सा अंक आएगा?";
    return "Look at the pattern: 2, 4, 6, what number comes next?";
  }

  return question.audio_text || question.title;
}

function getSpokenHintText(hintEnglish, hintIndex, question, voiceLang, primaryMember) {
  if (voiceLang === 'hi') {
    if (question.game_type === 'recognition') {
      if (hintIndex === 0) return "यह व्यक्ति आपके परिवार के एक बहुत ही प्रिय सदस्य हैं।";
      const relHi = RELATION_MAP.hi[primaryMember?.relationship] || primaryMember?.relationship || "परिवार";
      if (hintIndex === 1) return `यह आपके प्यारे ${relHi} हैं।`;
      return `इनका नाम '${primaryMember?.name?.[0] || 'र'}' अक्षर से शुरू होता है।`;
    }
    if (question.game_type === 'memory') {
      if (hintIndex === 0) return "बाईं ओर रखे ताजे लाल फल के बारे में सोचें।";
      if (hintIndex === 1) return "यह मीठा, कुरकुरा सेब है।";
      return "यह एक लाल सेब है।";
    }
    if (question.game_type === 'attention') {
      return "गहरे नीले रंग के गोल घेरों को ढूंढें।";
    }
    if (question.game_type === 'sequencing') {
      if (hintIndex === 0) return "सुबह सबसे पहले हम क्या करते हैं? आंखें खोलकर उठते हैं।";
      if (hintIndex === 1) return "उठने के बाद दांत ब्रश करके तरोताजा होते हैं।";
      return "तरोताजा होने के बाद पौष्टिक नाश्ता किया जाता है।";
    }
    if (question.game_type === 'culture') {
      return "यह रोशनी, मिठाइयों और खुशियों का पावन पर्व दिवाली है।";
    }
  }
  return hintEnglish;
}

function getSpokenEncouragement(isCorrect, voiceLang, memberName, relation) {
  if (voiceLang === 'hi') {
    if (isCorrect) {
      if (memberName) {
        const relHi = RELATION_MAP.hi[relation] || relation || "परिवार";
        return `बहुत अच्छा! आपने ${memberName}, अपने प्यारे ${relHi} को पहचान लिया।`;
      }
      return "बहुत बढ़िया! आपका प्रयास बहुत सुंदर है।";
    } else {
      return "कोई बात नहीं। अपना समय लें और फिर से कोशिश करें।";
    }
  }
  if (isCorrect) {
    if (memberName) return `Wonderful! You remembered ${memberName}, your loving ${relation.toLowerCase()}!`;
    return "Wonderful! You did great.";
  }
  return "That's okay. Take your time.";
}

function getSpokenReminder(rem, voiceLang) {
  if (voiceLang === 'hi') {
    if (rem.type === 'medication') return `दवा लेने का समय हो गया है: ${rem.title}`;
    if (rem.type === 'cognitive') return "आपकी आज की कॉग्निटिव गतिविधि तैयार है।";
    if (rem.type === 'meal') return "दोपहर के पौष्टिक भोजन का समय हो गया है।";
    if (rem.type === 'family') return "क्या आप आज अपनी बेटी को फ़ोन करना चाहेंगे?";
    return rem.title;
  }
  return rem.title;
}

// ==========================================
// ACCESSIBLE GLOBAL SPEAKER WIDGET
// ==========================================
function SpeakerButton({ text, lang = 'hi', speed = 'normal', size = 'md', autoPlay = false, className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (autoPlay && text) {
      const timer = setTimeout(() => {
        voiceService.speak(text, lang, speed, () => setIsPlaying(true), () => setIsPlaying(false));
      }, 450);
      return () => {
        clearTimeout(timer);
        voiceService.stop();
      };
    }
  }, [text, autoPlay, lang, speed]);

  const toggle = () => {
    if (isPlaying) {
      voiceService.stop();
      setIsPlaying(false);
    } else {
      voiceService.speak(text, lang, speed, () => setIsPlaying(true), () => setIsPlaying(false));
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={isPlaying ? "Stop Speaking ⏹" : `Listen in ${VOICE_PACKS[lang]?.name || 'Hindi'} Voice 🔊`}
      className={`inline-flex items-center gap-1.5 rounded-xl border transition font-medium select-none ${isPlaying ? 'bg-peach-100 text-peach-700 border-peach-400 ring-2 ring-peach-200' : 'bg-skysoft-50 hover:bg-skysoft-100 text-skysoft-700 border-skysoft-200'} ${size === 'sm' ? 'px-2.5 py-1 text-xs' : (size === 'lg' ? 'px-4 py-2.5 text-base' : 'px-3 py-1.5 text-sm')} ${className}`}
    >
      <span className="text-base leading-none">{isPlaying ? '⏹' : '🔊'}</span>
      <span>{isPlaying ? 'Speaking...' : 'Listen'}</span>
      {isPlaying && (
        <span className="flex items-center gap-0.5 ml-1">
          <span className="w-1 h-3 bg-peach-500 rounded-full animate-pulse"></span>
          <span className="w-1 h-4 bg-peach-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1 h-2 bg-peach-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
        </span>
      )}
    </button>
  );
}

// ==========================================
// VOICE PACK SELECTION MODAL
// ==========================================
function VoicePackModal({ isOpen, onClose, currentVoice, onSelectVoice, speed, onSelectSpeed, soundEffects }) {
  const [previewingLang, setPreviewingLang] = useState(null);
  const [voiceAvailability, setVoiceAvailability] = useState(() => voiceService.getVoiceAvailability());

  useEffect(() => voiceService.addVoiceAvailabilityListener(setVoiceAvailability), []);

  if (!isOpen) return null;

  const handlePreview = (langId, e) => {
    e.stopPropagation();
    if (soundEffects) sounds.playChime('tap');
    setPreviewingLang(langId);
    voiceService.previewVoice(langId, speed, () => setPreviewingLang(langId), () => setPreviewingLang(null));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-cream-200 gentle-shadow space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100 text-peach-700 text-xs font-semibold mb-2">
              <span>🔊</span>
              <span>Spoken Language & Voice Pack</span>
            </div>
            <h2 className="font-heading font-bold text-2xl text-stone-800">Choose your voice</h2>
            <p className="text-sm text-stone-500 mt-1">
              Choose the language you would like to hear during games, hints, reminders, and daily check-ins.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-100 text-stone-500 hover:text-stone-800 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Language Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.values(VOICE_PACKS).map((pack) => {
            const isSelected = currentVoice === pack.id;
            const isPreviewing = previewingLang === pack.id;
            const isAvailable = voiceAvailability[pack.id];
            return (
              <div
                key={pack.id}
                onClick={() => {
                  if (!isAvailable) return;
                  if (soundEffects) sounds.playChime('tap');
                  onSelectVoice(pack.id);
                }}
                aria-disabled={!isAvailable}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} ${isSelected ? 'bg-peach-50/80 border-peach-500 shadow-sm ring-2 ring-peach-200' : 'bg-white border-cream-200'} ${isAvailable && !isSelected ? 'hover:border-peach-200 hover:bg-cream-50' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{pack.flag}</span>
                    {isSelected ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-peach-500 text-white flex items-center gap-1">
                        <span>✓</span>
                        <span>Selected</span>
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400 font-medium">{isAvailable ? 'Voice Pack' : 'Spoken guidance unavailable'}</span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-xl text-stone-800">{pack.nativeName}</h3>
                  <p className="text-xs font-semibold text-stone-500">{pack.name} voice</p>
                  <p className="text-xs text-stone-400 mt-2 italic line-clamp-1">"{pack.previewPhrase}"</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => handlePreview(pack.id, e)}
                    disabled={!isAvailable}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${isPreviewing ? 'bg-peach-500 text-white border-peach-500 animate-pulse' : 'bg-cream-100 text-stone-700 hover:bg-cream-200 border-cream-200'}`}
                  >
                    <span>{isPreviewing ? '⏹' : '▶'}</span>
                    <span>{isPreviewing ? 'Playing...' : 'Preview Voice'}</span>
                  </button>

                  <span className="text-xs text-stone-400 font-medium">{pack.region}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Speech Speed Quick Controls inside Modal */}
        <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-stone-800">Speaking Pace</h4>
            <p className="text-xs text-stone-500">Tailor the speed for comfort and clarity.</p>
          </div>
          <div className="flex items-center bg-white rounded-xl p-1 border border-cream-200 gap-1 text-xs font-bold">
            <button
              onClick={() => onSelectSpeed('slow')}
              className={`px-3 py-1.5 rounded-lg transition ${speed === 'slow' ? 'bg-peach-500 text-white shadow-xs' : 'text-stone-600 hover:bg-cream-100'}`}
            >
              Slow (0.75x)
            </button>
            <button
              onClick={() => onSelectSpeed('normal')}
              className={`px-3 py-1.5 rounded-lg transition ${speed === 'normal' ? 'bg-peach-500 text-white shadow-xs' : 'text-stone-600 hover:bg-cream-100'}`}
            >
              Normal (0.9x)
            </button>
            <button
              onClick={() => onSelectSpeed('fast')}
              className={`px-3 py-1.5 rounded-lg transition ${speed === 'fast' ? 'bg-peach-500 text-white shadow-xs' : 'text-stone-600 hover:bg-cream-100'}`}
            >
              Fast (1.1x)
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-sm shadow-md transition"
          >
            Done ✓
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
function CogniCareApp() {
  const [role, setRole] = useState('patient'); // 'patient' | 'caregiver'
  const [view, setView] = useState(() => {
    const match = window.location.hash.match(/^#game\/(game_[a-z]+)$/);
    return match ? `game:${match[1]}` : 'dashboard';
  });
  
  // Data States
  const [patient, setPatient] = useState(null);
  const [culturalPref, setCulturalPref] = useState({});
  const [skillProfile, setSkillProfile] = useState({});
  const [familyMembers, setFamilyMembers] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [todaySession, setTodaySession] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Accessibility & Language States (Completely Independent!)
  const [fontSize, setFontSize] = useState('large'); // 'normal', 'large', 'xlarge'
  const [highContrast, setHighContrast] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  // Spoken Voice vs Interface Language
  const [interfaceLanguage, setInterfaceLanguage] = useState('en'); // 'en' | 'hi'
  const [voiceLanguage, setVoiceLanguage] = useState('hi'); // 'hi' | 'en' | 'pa' | ...
  const [speechSpeed, setSpeechSpeed] = useState('normal'); // 'slow' | 'normal' | 'fast'
  const [autoReadAloud, setAutoReadAloud] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  useEffect(() => {
    voiceService.setEnabled(voiceGuidance);
  }, [voiceGuidance]);

  // Hash URLs make each standalone game directly addressable without coupling it to a daily session.
  useEffect(() => {
    const onHashChange = () => {
      const match = window.location.hash.match(/^#game\/(game_[a-z]+)$/);
      if (match) setView(`game:${match[1]}`);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (view.startsWith('game:')) {
      const nextHash = `#game/${view.slice(5)}`;
      if (window.location.hash !== nextHash) window.history.replaceState(null, '', nextHash);
    } else if (window.location.hash.startsWith('#game/')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [view]);

  // Sync Body Accessibility Classes
  useEffect(() => {
    document.body.className = `min-h-screen font-${fontSize} ${highContrast ? 'high-contrast' : ''}`;
  }, [fontSize, highContrast]);

  // Load All Core Data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [patRes, famRes, routRes, remRes, sesRes, careRes, anaRes] = await Promise.all([
        fetch('/api/patient').then(r => r.json()),
        fetch('/api/family').then(r => r.json()),
        fetch('/api/routines').then(r => r.json()),
        fetch('/api/reminders').then(r => r.json()),
        fetch('/api/games/today-session').then(r => r.json()),
        fetch('/api/caregiver/overview').then(r => r.json()),
        fetch('/api/caregiver/analytics').then(r => r.json())
      ]);

      setPatient(patRes.patient);
      setCulturalPref(patRes.cultural_preferences);
      setSkillProfile(patRes.skill_profile);
      setFamilyMembers(famRes);
      setRoutines(routRes);
      setReminders(remRes);
      setTodaySession(sesRes);
      setAlerts(careRes.recent_alerts || []);
      setAnalyticsData(anaRes);

      // Hydrate Language & Voice Settings
      const settings = patRes.patient?.settings || {};
      if (settings.interface_language) setInterfaceLanguage(settings.interface_language);
      if (settings.voice_language) setVoiceLanguage(settings.voice_language);
      if (settings.speech_speed) setSpeechSpeed(settings.speech_speed);
      if (settings.auto_read_aloud !== undefined) setAutoReadAloud(settings.auto_read_aloud);
      if (settings.voice_enabled !== undefined) setVoiceGuidance(settings.voice_enabled);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching CogniCare data:", err);
      const saved = JSON.parse(localStorage.getItem('cognicare_voice_preferences') || '{}');
      if (saved.interface_language) setInterfaceLanguage(saved.interface_language);
      if (saved.voice_language) setVoiceLanguage(saved.voice_language);
      if (saved.speech_speed) setSpeechSpeed(saved.speech_speed);
      if (saved.auto_read_aloud !== undefined) setAutoReadAloud(saved.auto_read_aloud);
      if (saved.voice_enabled !== undefined) setVoiceGuidance(saved.voice_enabled);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Update Settings in Backend and State
  const savePatientSettings = async (updates) => {
    const applyUpdates = () => {
      if (updates.interface_language !== undefined) setInterfaceLanguage(updates.interface_language);
      if (updates.voice_language !== undefined) {
        setVoiceLanguage(updates.voice_language);
        voiceService.setVoicePack(updates.voice_language);
      }
      if (updates.speech_speed !== undefined) setSpeechSpeed(updates.speech_speed);
      if (updates.auto_read_aloud !== undefined) setAutoReadAloud(updates.auto_read_aloud);
      if (updates.voice_enabled !== undefined) setVoiceGuidance(updates.voice_enabled);
    };
    try {
      const response = await fetch('/api/patient/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Settings could not be saved');
      applyUpdates();
    } catch (e) {
      console.error("Error saving patient settings:", e);
      // Prototype fallback keeps preferences available when the API is offline.
      const saved = JSON.parse(localStorage.getItem('cognicare_voice_preferences') || '{}');
      localStorage.setItem('cognicare_voice_preferences', JSON.stringify({ ...saved, ...updates }));
      applyUpdates();
    }
  };

  const triggerConfetti = () => {
    if (window.confetti) {
      window.confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F9865B', '#5A9B72', '#4A92D4', '#8A6FD4', '#FEDCCD']
      });
    }
  };

  if (loading || !patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cream-50 text-sage-700">
        <div className="w-16 h-16 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-medium tracking-wide">Preparing your comforting space...</p>
      </div>
    );
  }

  const currentPack = VOICE_PACKS[voiceLanguage] || VOICE_PACKS['hi'];
  const t = LOCALIZATION[interfaceLanguage] || LOCALIZATION['en'];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-orange-100/60 px-4 lg:px-8 py-3.5 gentle-shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setView('dashboard')}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-peach-500 to-peach-300 flex items-center justify-center text-white text-2xl shadow-sm">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xl text-stone-800 tracking-tight">SmritiSaathi</span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">Personalized Cognitive Wellness & Routine</p>
            </div>
          </div>

          {/* Quick Controls & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Active Voice Pack Trigger Badge */}
            <button
              onClick={() => {
                if (soundEffects) sounds.playChime('tap');
                setShowVoiceModal(true);
              }}
              title="Change Spoken Voice Pack"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-peach-200 bg-peach-50 hover:bg-peach-100 text-peach-700 text-xs font-bold transition shadow-2xs"
            >
              <span>{currentPack.flag}</span>
              <span>{currentPack.nativeName}</span>
              <span className="text-stone-400 font-normal hidden md:inline">({currentPack.name} Voice)</span>
            </button>

            <VoicePlaybackControls enabled={voiceGuidance} />

            {/* Accessibility Controls */}
            <div className="hidden md:flex items-center bg-cream-100 rounded-xl p-1 border border-cream-200 gap-1 text-sm font-medium">
              <button 
                title="Normal Font"
                onClick={() => setFontSize('normal')} 
                className={`px-2.5 py-1 rounded-lg transition ${fontSize === 'normal' ? 'bg-white shadow-xs text-stone-800' : 'text-stone-500 hover:text-stone-800'}`}
              >
                A
              </button>
              <button 
                title="Large Font (Senior Friendly)"
                onClick={() => setFontSize('large')} 
                className={`px-2.5 py-1 rounded-lg transition ${fontSize === 'large' ? 'bg-white shadow-xs text-stone-800 font-bold' : 'text-stone-500 hover:text-stone-800'}`}
              >
                A+
              </button>
              <button 
                title="Extra Large Font"
                onClick={() => setFontSize('xlarge')} 
                className={`px-2.5 py-1 rounded-lg transition ${fontSize === 'xlarge' ? 'bg-white shadow-xs text-stone-800 font-extrabold' : 'text-stone-500 hover:text-stone-800'}`}
              >
                A++
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              title="High Contrast Mode"
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border flex items-center gap-1.5 transition text-sm font-medium ${highContrast ? 'bg-stone-900 text-white border-black' : 'bg-stone-50 text-stone-600 border-stone-200'}`}
            >
              <span>👁️</span>
              <span className="hidden lg:inline">Contrast</span>
            </button>

            {/* Role Switcher Button */}
            <button
              onClick={() => {
                const nextRole = role === 'patient' ? 'caregiver' : 'patient';
                setRole(nextRole);
                setView('dashboard');
                if (soundEffects) sounds.playChime('tap');
              }}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 border transition shadow-sm ${role === 'patient' ? 'bg-sage-50 text-sage-700 border-sage-200 hover:bg-sage-100' : 'bg-peach-50 text-peach-700 border-peach-200 hover:bg-peach-100'}`}
            >
              <span>{role === 'patient' ? '🧑' : '🩺'}</span>
              <span>{role === 'patient' ? 'Caregiver Portal' : 'Patient View'}</span>
            </button>

          </div>
        </div>
      </header>

      {/* Role Banner / Navigation */}
      {role === 'patient' ? (
        <PatientNavBar view={view} setView={setView} streak={patient.streak_days} t={t} />
      ) : (
        <CaregiverNavBar view={view} setView={setView} alertsCount={alerts.length} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {role === 'patient' ? (
          <PatientExperience
            view={view}
            setView={setView}
            patient={patient}
            setPatient={setPatient}
            todaySession={todaySession}
            setTodaySession={setTodaySession}
            familyMembers={familyMembers}
            routines={routines}
            reminders={reminders}
            setReminders={setReminders}
            culturalPref={culturalPref}
            skillProfile={skillProfile}
            soundEffects={soundEffects}
            voiceGuidance={voiceGuidance}
            triggerConfetti={triggerConfetti}
            onDataRefresh={fetchAllData}
            interfaceLanguage={interfaceLanguage}
            setInterfaceLanguage={setInterfaceLanguage}
            voiceLanguage={voiceLanguage}
            setVoiceLanguage={setVoiceLanguage}
            speechSpeed={speechSpeed}
            setSpeechSpeed={setSpeechSpeed}
            autoReadAloud={autoReadAloud}
            setAutoReadAloud={setAutoReadAloud}
            savePatientSettings={savePatientSettings}
            setShowVoiceModal={setShowVoiceModal}
            t={t}
          />
        ) : (
          <CaregiverExperience
            view={view}
            setView={setView}
            patient={patient}
            familyMembers={familyMembers}
            setFamilyMembers={setFamilyMembers}
            routines={routines}
            reminders={reminders}
            setReminders={setReminders}
            culturalPref={culturalPref}
            skillProfile={skillProfile}
            alerts={alerts}
            analyticsData={analyticsData}
            onDataRefresh={fetchAllData}
            soundEffects={soundEffects}
            voiceGuidance={voiceGuidance}
            interfaceLanguage={interfaceLanguage}
            setInterfaceLanguage={setInterfaceLanguage}
            voiceLanguage={voiceLanguage}
            setVoiceLanguage={setVoiceLanguage}
            speechSpeed={speechSpeed}
            setSpeechSpeed={setSpeechSpeed}
            autoReadAloud={autoReadAloud}
            setAutoReadAloud={setAutoReadAloud}
            savePatientSettings={savePatientSettings}
            setShowVoiceModal={setShowVoiceModal}
          />
        )}
      </main>

      {/* Global Voice Pack Selection Modal */}
      <VoicePackModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        currentVoice={voiceLanguage}
        onSelectVoice={(langId) => {
          voiceService.setVoicePack(langId);
          savePatientSettings({ voice_language: langId });
        }}
        speed={speechSpeed}
        onSelectSpeed={(spd) => {
          savePatientSettings({ speech_speed: spd });
        }}
        soundEffects={soundEffects}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-cream-200 py-6 px-4 text-center text-xs text-stone-500">
        <p className="max-w-2xl mx-auto leading-relaxed">
          SmritiSaathi is a gentle personalized cognitive wellness and routine-support platform with Multilingual Voice Packs.
          <span className="block mt-1 text-stone-400">Not intended for clinical medical examination or diagnostic claims. Dedicated to comfort, familiarity, and joyful connection. ❤️</span>
        </p>
      </footer>
    </div>
  );
}

// ==========================================
// PATIENT NAVIGATION BAR
// ==========================================
function PatientNavBar({ view, setView, streak, t }) {
  const navItems = [
    { id: 'dashboard', label: t.nav.home, icon: '🏡' },
    { id: 'session', label: t.nav.session, icon: '⭐', highlight: true },
    { id: 'checkin', label: t.nav.checkin, icon: '☀️' },
    { id: 'catalog', label: t.nav.games, icon: '🧩' },
    { id: 'routines', label: t.nav.routine, icon: '🗓️' },
    { id: 'reminders', label: t.nav.reminders, icon: '⏰' },
    { id: 'family', label: t.nav.family, icon: '❤️' },
    { id: 'profile', label: t.nav.profile, icon: '👤' },
  ];

  return (
    <div className="bg-white border-b border-cream-200 sticky top-[69px] z-30 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto py-2.5 no-scrollbar">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {navItems.map((item) => {
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all select-none ${isActive ? (item.highlight ? 'bg-peach-500 text-white shadow-sm font-semibold' : 'bg-stone-800 text-white font-semibold') : (item.highlight ? 'bg-peach-50 text-peach-700 hover:bg-peach-100 border border-peach-200' : 'text-stone-600 hover:bg-cream-100')}`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Consistency Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold whitespace-nowrap">
          <span>🔥</span>
          <span>{streak} {t.greetings.streak}</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CAREGIVER NAVIGATION BAR
// ==========================================
function CaregiverNavBar({ view, setView, alertsCount }) {
  const tabs = [
    { id: 'dashboard', label: 'Caregiver Overview', icon: '📊' },
    { id: 'analytics', label: 'Skill Analytics', icon: '📈' },
    { id: 'voice_settings', label: 'Language & Voice', icon: '🔊' },
    { id: 'family_mgr', label: 'Family & Photos', icon: '🖼️' },
    { id: 'routine_mgr', label: 'Routine Timeline', icon: '📋' },
    { id: 'reminder_mgr', label: 'Reminder Engine', icon: '⏰' },
    { id: 'culture_mgr', label: 'Cultural Settings', icon: '🪔' },
    { id: 'alerts', label: 'Alerts & Notes', icon: '🔔', badge: alertsCount }
  ];

  return (
    <div className="bg-sage-50/80 border-b border-sage-200 sticky top-[69px] z-30 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = view === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${isActive ? 'bg-sage-600 text-white font-semibold shadow-xs' : 'text-sage-800 hover:bg-sage-100'}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold ml-1">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// PATIENT EXPERIENCE ROUTER
// ==========================================
function PatientExperience({
  view,
  setView,
  patient,
  setPatient,
  todaySession,
  setTodaySession,
  familyMembers,
  routines,
  reminders,
  setReminders,
  culturalPref,
  skillProfile,
  soundEffects,
  voiceGuidance,
  triggerConfetti,
  onDataRefresh,
  interfaceLanguage,
  setInterfaceLanguage,
  voiceLanguage,
  setVoiceLanguage,
  speechSpeed,
  setSpeechSpeed,
  autoReadAloud,
  setAutoReadAloud,
  savePatientSettings,
  setShowVoiceModal,
  t
}) {
  const directGameId = view.startsWith('game:') ? view.slice(5) : null;
  if (directGameId) {
    return <StandaloneGameFlow key={directGameId} gameId={directGameId} patient={patient} setView={setView}
      soundEffects={soundEffects} triggerConfetti={triggerConfetti} voiceLanguage={voiceLanguage}
      speechSpeed={speechSpeed} autoReadAloud={autoReadAloud} interfaceLanguage={interfaceLanguage}
      familyMembers={familyMembers} t={t} />;
  }
  if (view === 'session') {
    return (
      <TodaySessionFlow
        todaySession={todaySession}
        setTodaySession={setTodaySession}
        patient={patient}
        setView={setView}
        soundEffects={soundEffects}
        voiceGuidance={voiceGuidance}
        triggerConfetti={triggerConfetti}
        onDataRefresh={onDataRefresh}
        voiceLanguage={voiceLanguage}
        speechSpeed={speechSpeed}
        autoReadAloud={autoReadAloud}
        interfaceLanguage={interfaceLanguage}
        familyMembers={familyMembers}
        t={t}
      />
    );
  }

  if (view === 'checkin') {
    return (
      <DailyCheckInView
        patient={patient}
        familyMembers={familyMembers}
        setView={setView}
        soundEffects={soundEffects}
        voiceGuidance={voiceGuidance}
        onDataRefresh={onDataRefresh}
        voiceLanguage={voiceLanguage}
        speechSpeed={speechSpeed}
        interfaceLanguage={interfaceLanguage}
        t={t}
      />
    );
  }

  if (view === 'catalog') {
    return (
      <GamesCatalogView
        setView={setView}
        soundEffects={soundEffects}
        interfaceLanguage={interfaceLanguage}
        voiceLanguage={voiceLanguage}
        speechSpeed={speechSpeed}
      />
    );
  }

  if (view === 'routines') {
    return (
      <PatientRoutineView
        routines={routines}
        patient={patient}
        soundEffects={soundEffects}
        voiceGuidance={voiceGuidance}
        onDataRefresh={onDataRefresh}
        voiceLanguage={voiceLanguage}
        speechSpeed={speechSpeed}
        interfaceLanguage={interfaceLanguage}
      />
    );
  }

  if (view === 'reminders') {
    return (
      <PatientRemindersView
        reminders={reminders}
        setReminders={setReminders}
        soundEffects={soundEffects}
        voiceGuidance={voiceGuidance}
        voiceLanguage={voiceLanguage}
        speechSpeed={speechSpeed}
        interfaceLanguage={interfaceLanguage}
      />
    );
  }

  if (view === 'family') {
    return (
      <FamilyAlbumView
        familyMembers={familyMembers}
        soundEffects={soundEffects}
        voiceGuidance={voiceGuidance}
        voiceLanguage={voiceLanguage}
        speechSpeed={speechSpeed}
        interfaceLanguage={interfaceLanguage}
      />
    );
  }

  if (view === 'profile') {
    return (
      <PatientProfileView
        patient={patient}
        setPatient={setPatient}
        culturalPref={culturalPref}
        skillProfile={skillProfile}
        setView={setView}
        interfaceLanguage={interfaceLanguage}
        setInterfaceLanguage={setInterfaceLanguage}
        voiceLanguage={voiceLanguage}
        setVoiceLanguage={setVoiceLanguage}
        speechSpeed={speechSpeed}
        setSpeechSpeed={setSpeechSpeed}
        autoReadAloud={autoReadAloud}
        setAutoReadAloud={setAutoReadAloud}
        voiceGuidance={voiceGuidance}
        savePatientSettings={savePatientSettings}
        setShowVoiceModal={setShowVoiceModal}
        t={t}
      />
    );
  }

  if (view === 'onboarding') {
    return (
      <PatientOnboardingModal
        patient={patient}
        onComplete={() => {
          setView('dashboard');
          onDataRefresh();
        }}
        voiceLanguage={voiceLanguage}
        setVoiceLanguage={setVoiceLanguage}
        speechSpeed={speechSpeed}
        soundEffects={soundEffects}
      />
    );
  }

  // Default: Patient Dashboard
  return (
    <PatientDashboardView
      patient={patient}
      todaySession={todaySession}
      familyMembers={familyMembers}
      routines={routines}
      reminders={reminders}
      setReminders={setReminders}
      setView={setView}
      soundEffects={soundEffects}
      voiceGuidance={voiceGuidance}
      interfaceLanguage={interfaceLanguage}
      voiceLanguage={voiceLanguage}
      speechSpeed={speechSpeed}
      setShowVoiceModal={setShowVoiceModal}
      t={t}
    />
  );
}

// ==========================================
// PATIENT DASHBOARD VIEW
// ==========================================
function PatientDashboardView({
  patient,
  todaySession,
  familyMembers,
  routines,
  reminders,
  setReminders,
  setView,
  soundEffects,
  voiceGuidance,
  interfaceLanguage,
  voiceLanguage,
  speechSpeed,
  setShowVoiceModal,
  t
}) {
  const morningGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.greetings.morning;
    if (hour < 17) return t.greetings.afternoon;
    return t.greetings.evening;
  };

  const isSessionDone = patient.current_session_done_today;
  const currentPack = VOICE_PACKS[voiceLanguage] || VOICE_PACKS['hi'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Warm Patient Welcome Banner */}
      <div className="bg-gradient-to-br from-peach-100/70 via-cream-50 to-sage-50/60 rounded-3xl p-6 sm:p-8 border border-peach-200/80 gentle-shadow relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-peach-200 text-peach-600 text-xs font-semibold">
              <span>☀️</span>
              <span>A Peaceful New Day</span>
            </span>

            {/* Voice pack notification badge */}
            <button
              onClick={() => setShowVoiceModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cream-100/80 hover:bg-cream-200 border border-cream-200 text-stone-600 text-xs font-medium transition"
            >
              <span>🔊</span>
              <span>Hearing in: <strong>{currentPack.name}</strong></span>
            </button>
          </div>

          <div className="flex items-start justify-between gap-4">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-stone-800 leading-snug">
              {morningGreeting()}, {patient.preferred_name} 👋
            </h1>

            {/* Read Welcome Aloud in Selected Voice Pack */}
            <SpeakerButton
              text={voiceLanguage === 'hi' ? `सुप्रभात ${patient.preferred_name} जी। आइए आज कुछ शांत और आनंददायक पल साथ बिताएं।` : `${morningGreeting()}, ${patient.preferred_name}. Let's spend a few relaxing minutes together today.`}
              lang={voiceLanguage}
              speed={speechSpeed}
              size="sm"
            />
          </div>

          <p className="mt-2 text-stone-600 text-base sm:text-lg leading-relaxed">
            {t.greetings.welcomeSubtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (soundEffects) sounds.playChime('tap');
                setView('session');
              }}
              className="px-6 py-3.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-semibold text-base sm:text-lg shadow-md hover:shadow-lg transition flex items-center gap-3"
            >
              <span>{isSessionDone ? t.greetings.reviewSession : t.greetings.startSession}</span>
              <span>→</span>
            </button>

            <button
              onClick={() => {
                if (soundEffects) sounds.playChime('tap');
                setView('checkin');
              }}
              className="px-5 py-3.5 rounded-2xl bg-white hover:bg-cream-100 text-stone-700 font-medium text-base border border-cream-200 transition flex items-center gap-2"
            >
              <span>🧑</span>
              <span>{t.greetings.dailyCheckinBtn}</span>
            </button>
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 w-48 h-48 sm:w-64 sm:h-64 opacity-20 pointer-events-none text-peach-500 flex items-center justify-center text-8xl">
          🌸
        </div>
      </div>

      {/* Encouragement & Routine Adherence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-cream-200 gentle-shadow flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl shrink-0">
            🌟
          </div>
          <div>
            <h3 className="font-heading font-semibold text-stone-800 text-base">Consistent Routine</h3>
            <p className="text-sm text-stone-500 mt-1">You've completed {patient.streak_days} sessions this week! Great job keeping up.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-cream-200 gentle-shadow flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-2xl shrink-0">
            ❤️
          </div>
          <div>
            <h3 className="font-heading font-semibold text-stone-800 text-base">Familiar Faces</h3>
            <p className="text-sm text-stone-500 mt-1">Recognized grandson Rohan and daughter Priya with a warm smile.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-cream-200 gentle-shadow flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center text-2xl shrink-0">
            🍵
          </div>
          <div>
            <h3 className="font-heading font-semibold text-stone-800 text-base">Morning Tea & Rest</h3>
            <p className="text-sm text-stone-500 mt-1">Balcony fresh air and herbal ginger tea completed for the morning.</p>
          </div>
        </div>
      </div>

      {/* Today's Recommended Activities Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-stone-800">{t.greetings.recommendedTitle}</h2>
            <p className="text-sm text-stone-500">{t.greetings.recommendedSubtitle}</p>
          </div>
          <button 
            onClick={() => setView('catalog')}
            className="text-sm font-semibold text-peach-600 hover:text-peach-700"
          >
            {t.greetings.exploreGames}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {todaySession?.activities?.map((act, index) => (
            <div
              key={act.game_id}
              onClick={() => {
                if (soundEffects) sounds.playChime('tap');
                setView('session');
              }}
              className="bg-white rounded-2xl p-5 border border-cream-200 gentle-shadow gentle-shadow-hover transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cream-100 text-stone-600">
                    Activity {index + 1} of 4
                  </span>
                  <span className="text-2xl">
                    {index === 0 ? '🧑' : index === 1 ? '🗓️' : index === 2 ? '🧠' : '🪔'}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-stone-800 text-lg mb-1">{act.title}</h3>
                <p className="text-xs text-stone-500 line-clamp-2">{act.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-peach-600 font-semibold">Play activity →</span>
                <span className="text-stone-400">~2 mins</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column: Reminders & Family Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Reminder Cards with Voice Read-Aloud */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-cream-200 gentle-shadow space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⏰</span>
              <h2 className="font-heading font-bold text-xl text-stone-800">Today's Reminders & Comforts</h2>
            </div>
            <button 
              onClick={() => setView('reminders')}
              className="text-xs font-semibold text-peach-600 hover:text-peach-700"
            >
              View all ({reminders.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {reminders.slice(0, 4).map((rem) => {
              const spokenRem = getSpokenReminder(rem, voiceLanguage);
              return (
                <div 
                  key={rem.id}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${rem.completed ? 'bg-cream-50 border-cream-200 opacity-70' : 'bg-white border-orange-100 hover:border-orange-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => {
                        if (soundEffects) sounds.playChime('tap');
                        try {
                          const res = await fetch(`/api/reminders/${rem.id}/toggle`, { method: 'POST' });
                          const json = await res.json();
                          if (json.success) {
                            setReminders(reminders.map(r => r.id === rem.id ? json.reminder : r));
                          }
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${rem.completed ? 'bg-sage-600 border-sage-600 text-white' : 'border-stone-300 hover:border-sage-500'}`}
                    >
                      {rem.completed && <span className="text-xs">✓</span>}
                    </button>

                    <div>
                      <h4 className={`text-base font-semibold ${rem.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                        {rem.title}
                      </h4>
                      <p className="text-xs text-stone-500">{rem.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <SpeakerButton
                      text={spokenRem}
                      lang={voiceLanguage}
                      speed={speechSpeed}
                      size="sm"
                    />
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-cream-100 text-stone-600">
                      {rem.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loved Ones Gallery Widget */}
        <div className="bg-white rounded-3xl p-6 border border-cream-200 gentle-shadow space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">❤️</span>
              <h2 className="font-heading font-bold text-xl text-stone-800">Loved Ones</h2>
            </div>
            <button 
              onClick={() => setView('family')}
              className="text-xs font-semibold text-peach-600 hover:text-peach-700"
            >
              Album →
            </button>
          </div>

          <div className="space-y-3">
            {familyMembers.slice(0, 3).map((f) => {
              const relHi = RELATION_MAP.hi[f.relationship] || f.relationship;
              const spokenName = voiceLanguage === 'hi' ? `${f.name}, आपके ${relHi}।` : `${f.name}, your ${f.relationship}.`;
              return (
                <div 
                  key={f.id}
                  onClick={() => setView('family')}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-cream-50 transition cursor-pointer"
                >
                  <img 
                    src={f.photo} 
                    alt={f.name}
                    className="w-12 h-12 rounded-xl object-cover border border-cream-200 shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-stone-800 truncate">{f.name}</h4>
                    <p className="text-xs text-peach-600 font-medium">{f.relationship}</p>
                  </div>
                  <SpeakerButton
                    text={spokenName}
                    lang={voiceLanguage}
                    speed={speechSpeed}
                    size="sm"
                    className="p-1.5"
                  />
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setView('family')}
            className="w-full py-2.5 rounded-xl bg-peach-50 text-peach-600 font-semibold text-xs border border-peach-200 hover:bg-peach-100 transition"
          >
            Open Family Album
          </button>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// TODAY'S GUIDED SESSION FLOW (WITH VOICE PACK)
// ==========================================
function StandaloneGameFlow({ gameId, patient, setView, soundEffects, triggerConfetti, voiceLanguage, speechSpeed, autoReadAloud, interfaceLanguage, familyMembers, t }) {
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/games/${encodeURIComponent(gameId)}`)
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Game not found')))
      .then(data => !cancelled && setGame(data))
      .catch(() => !cancelled && setError('This game could not be loaded. Please return to the games page and try again.'));
    return () => { cancelled = true; voiceService.stop(); };
  }, [gameId]);

  if (error) return <div className="bg-white rounded-3xl p-8 text-center space-y-4"><p className="text-stone-600">{error}</p><button onClick={() => setView('catalog')} className="px-5 py-3 rounded-xl bg-peach-500 text-white font-semibold">Back to Games</button></div>;
  if (!game) return <div className="py-16 text-center text-stone-500">Preparing this activity...</div>;
  return <TodaySessionFlow
    todaySession={{ session_id: `standalone_${gameId}`, activities: [{ ...game, game_id: gameId }] }}
    setTodaySession={() => {}} patient={patient} setView={setView} soundEffects={soundEffects}
    voiceGuidance={true} triggerConfetti={triggerConfetti} onDataRefresh={() => {}}
    voiceLanguage={voiceLanguage} speechSpeed={speechSpeed} autoReadAloud={autoReadAloud}
    interfaceLanguage={interfaceLanguage} familyMembers={familyMembers} t={t} sessionMode={false}
  />;
}

function TodaySessionFlow({
  todaySession,
  setTodaySession,
  patient,
  setView,
  soundEffects,
  voiceGuidance,
  triggerConfetti,
  onDataRefresh,
  voiceLanguage,
  speechSpeed,
  autoReadAloud,
  interfaceLanguage,
  familyMembers,
  t,
  sessionMode = true
}) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(todaySession?.current_activity_index || 0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hintsUnlocked, setHintsUnlocked] = useState(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [sessionCompleted, setSessionCompleted] = useState(Boolean(todaySession?.completed));
  
  // Specific State for Game 2 (Recall memory countdown)
  const [recallCountdown, setRecallCountdown] = useState(0);
  const [recallItemsHidden, setRecallItemsHidden] = useState(false);

  // Specific State for Game 3 (Attention taps)
  const [attentionTappedCount, setAttentionTappedCount] = useState(0);

  // Specific State for Game 4 (Routine Ordering)
  const [routineOrderedSteps, setRoutineOrderedSteps] = useState([]);

  const activities = todaySession?.activities || [];
  const currentActivity = activities[currentActivityIndex];
  const questions = currentActivity?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Resolve Spoken Text in Selected Voice Pack
  const spokenQuestion = currentQuestion ? getSpokenQuestionText(currentQuestion, voiceLanguage, familyMembers) : "";

  // Reset and auto-read question when index changes
  useEffect(() => {
    setSelectedOption(null);
    setHintsUnlocked(0);
    setIsAnswerSubmitted(false);
    setIsCorrect(false);
    setStartTime(Date.now());

    // Recall preview duration
    if (currentQuestion?.preview_duration_sec && currentQuestion.preview_duration_sec > 0) {
      setRecallCountdown(currentQuestion.preview_duration_sec);
      setRecallItemsHidden(false);
    } else {
      setRecallItemsHidden(true);
    }

    // Routine steps
    if (currentQuestion?.puzzle_type === 'order_sequence') {
      setRoutineOrderedSteps([...currentQuestion.initial_steps]);
    }

    setAttentionTappedCount(0);

    // AUTO READ ALOUD: If user has enabled auto read aloud
    if (autoReadAloud && spokenQuestion) {
      const timer = setTimeout(() => {
        voiceService.speak(spokenQuestion, voiceLanguage, speechSpeed);
      }, 400);
      return () => {
        clearTimeout(timer);
        voiceService.stop();
      };
    }
  }, [currentActivityIndex, currentQuestionIndex, autoReadAloud, voiceLanguage, speechSpeed]);

  // Handle countdown timer for Game 2
  useEffect(() => {
    if (recallCountdown > 0) {
      const timer = setTimeout(() => {
        setRecallCountdown(c => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (recallCountdown === 0 && currentQuestion?.preview_duration_sec) {
      setRecallItemsHidden(true);
    }
  }, [recallCountdown]);

  // Handle Option Selection
  const handleSelectOption = async (option) => {
    if (isAnswerSubmitted && isCorrect) return;

    setSelectedOption(option);
    const latency = Date.now() - startTime;
    const correct = answersMatch(option, getCorrectAnswer(currentQuestion));
    
    setIsAnswerSubmitted(true);
    setIsCorrect(correct);

    // Speak supportive encouragement in chosen Voice Pack
    const encouragement = getSpokenEncouragement(
      correct,
      voiceLanguage,
      currentQuestion.game_type === 'recognition' ? currentQuestion.correct_answer : null,
      familyMembers[0]?.relationship
    );
    voiceService.speak(encouragement, voiceLanguage, speechSpeed);

    if (correct) {
      if (soundEffects) sounds.playChime('success');
      try {
        await fetch('/api/sessions/record-attempt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_id: currentQuestion.id,
            game_type: currentQuestion.game_type,
            is_correct: true,
            hints_used: hintsUnlocked,
            response_time_ms: latency
          })
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      if (soundEffects) sounds.playChime('hint');
      if (hintsUnlocked < (currentQuestion.hints?.length || 0)) {
        const nextHintIdx = hintsUnlocked;
        setHintsUnlocked(h => h + 1);
        // Automatically speak gentle hint after a moment
        setTimeout(() => {
          const hintSpoken = getSpokenHintText(
            currentQuestion.hints[nextHintIdx],
            nextHintIdx,
            currentQuestion,
            voiceLanguage,
            familyMembers[0]
          );
          voiceService.speak(hintSpoken, voiceLanguage, speechSpeed);
        }, 1200);
      }
    }
  };

  // Next Question or Next Activity Transition
  const handleNext = async () => {
    voiceService.stop();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(q => q + 1);
    } else if (currentActivityIndex < activities.length - 1) {
      if (sessionMode) {
        const response = await fetch('/api/games/today-session/progress', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: todaySession.session_id, game_id: currentActivity.game_id })
        });
        if (!response.ok) return;
        const saved = await response.json();
        setTodaySession({ ...todaySession, ...saved.session });
      }
      setCurrentActivityIndex(a => a + 1);
      setCurrentQuestionIndex(0);
    } else {
      // Completed full session!
      setSessionCompleted(true);
      triggerConfetti();
      if (soundEffects) sounds.playChime('success');

      // Speak celebratory completion message in selected Voice Pack
      const completionSpoken = voiceLanguage === 'hi' 
        ? "आज आपने बहुत अच्छा किया! आपने अपनी सभी गतिविधियाँ पूरी कर ली हैं। कल फिर मिलते हैं!" 
        : "Great work today! You completed all your activities. See you tomorrow!";
      voiceService.speak(completionSpoken, voiceLanguage, speechSpeed);

      try {
        if (!sessionMode) return;
        const progress = await fetch('/api/games/today-session/progress', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: todaySession.session_id, game_id: currentActivity.game_id })
        });
        if (!progress.ok) throw new Error('Could not save game progress');
        await fetch('/api/sessions/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: todaySession.session_id,
            activities_completed: activities.length,
            duration_minutes: 8,
            stars: 5
          })
        });
        onDataRefresh();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Session Completed Celebration Screen
  if (sessionCompleted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-cream-200 gentle-shadow text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-peach-100 text-peach-500 mx-auto flex items-center justify-center text-4xl animate-gentle-pulse">
          🎉
        </div>

        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sage-100 text-sage-700">
            Day Completed With Joy
          </span>
          <h2 className="font-heading font-bold text-3xl text-stone-800 mt-2">
            {t.session.completeTitle}
          </h2>
          <p className="text-stone-600 mt-2 text-lg">
            {voiceLanguage === 'hi'
              ? `शानदार प्रयास ${patient.preferred_name} जी! आपने सभी 4 गतिविधियाँ आराम से पूरी कर लीं।`
              : `Wonderful effort today, ${patient.preferred_name}! You completed all 4 activities peacefully.`}
          </p>

          <div className="mt-3 flex justify-center">
            <SpeakerButton
              text={voiceLanguage === 'hi' ? "आज आपने बहुत अच्छा किया! आपने अपनी सभी गतिविधियाँ पूरी कर ली हैं। कल फिर मिलते हैं!" : "Great work today! You completed all your activities. See you tomorrow!"}
              lang={voiceLanguage}
              speed={speechSpeed}
              size="md"
            />
          </div>
        </div>

        {/* Gentle Star Ratings Breakdown */}
        <div className="bg-cream-50 rounded-2xl p-6 border border-cream-200 text-left space-y-4">
          <h3 className="font-heading font-semibold text-stone-800 text-base">Your Gentle Progress Today:</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-cream-200 flex items-center justify-between">
              <span className="text-sm font-medium text-stone-700">🧑 Familiar Faces</span>
              <span className="text-amber-400">⭐⭐⭐⭐⭐</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-cream-200 flex items-center justify-between">
              <span className="text-sm font-medium text-stone-700">🗓️ Daily Routine</span>
              <span className="text-amber-400">⭐⭐⭐⭐</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-cream-200 flex items-center justify-between">
              <span className="text-sm font-medium text-stone-700">🧠 Remember & Recall</span>
              <span className="text-amber-400">⭐⭐⭐⭐</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-cream-200 flex items-center justify-between">
              <span className="text-sm font-medium text-stone-700">🪔 Culture & Heritage</span>
              <span className="text-amber-400">⭐⭐⭐⭐⭐</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-peach-50 border border-peach-200 text-peach-800 text-sm leading-relaxed">
            <p className="font-semibold mb-1">❤️ Encouraging Note:</p>
            <p>
              {voiceLanguage === 'hi'
                ? "आपने आज परिवार के सदस्यों और दिनचर्या को बहुत अच्छे से पहचाना! कल के सत्र में और भी सुखद यादें होंगी।"
                : "You did especially well recognizing family members and morning routines today! Tomorrow's session will include more soothing visual memories."}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setView('dashboard')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-semibold text-lg shadow-md transition"
          >
            {t.session.backHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Session Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-cream-200 gentle-shadow flex items-center justify-between gap-4">
        <button
          onClick={() => {
            voiceService.stop();
            setView('dashboard');
          }}
          className="text-stone-500 hover:text-stone-800 text-sm font-semibold flex items-center gap-1.5"
        >
          <span>←</span>
          <span>{t.buttons.exitSession}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-peach-100 text-peach-700">
            {t.session.activity} {currentActivityIndex + 1} {t.session.of} {activities.length}
          </span>
          <span className="text-xs text-stone-400 hidden sm:inline font-medium">
            {t.session.question} {currentQuestionIndex + 1} {t.session.of} {questions.length}
          </span>
        </div>

        <div className="w-24 bg-cream-200 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-peach-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${((currentActivityIndex * questions.length + currentQuestionIndex + 1) / (activities.length * questions.length)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Single Game Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 gentle-shadow space-y-6 animate-fadeIn">
        
        {/* Category Badge & Dedicated Speaker Button */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-peach-600 bg-peach-50 px-3 py-1 rounded-full border border-peach-200">
            <span>✨</span>
            <span>{currentActivity.title}</span>
          </span>

          {/* Spoken Audio in chosen Voice Pack */}
          <SpeakerButton
            text={spokenQuestion}
            lang={voiceLanguage}
            speed={speechSpeed}
            size="sm"
          />
        </div>

        {/* Question Title & Subtitle */}
        <div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-stone-800 leading-tight">
            {interfaceLanguage === 'hi' && currentQuestion.title_hi ? currentQuestion.title_hi : currentQuestion.title}
          </h2>
          <p className="text-stone-500 mt-2 text-base sm:text-lg">
            {interfaceLanguage === 'hi' && currentQuestion.subtitle_hi ? currentQuestion.subtitle_hi : currentQuestion.subtitle}
          </p>
        </div>

        {/* 1. Photo Prompt */}
        {currentQuestion.image && (
          <div className="flex justify-center my-4">
            <img 
              src={currentQuestion.image} 
              alt="Familiar Person"
              className="w-64 h-64 sm:w-72 sm:h-72 object-cover rounded-3xl border-4 border-peach-100 shadow-md"
            />
          </div>
        )}

        {/* 2. Object Tray (Remember & Recall) */}
        {currentQuestion.display_items && (
          <div className="my-6">
            {!recallItemsHidden ? (
              <div className="bg-cream-100/70 rounded-3xl p-6 border-2 border-dashed border-cream-300 text-center space-y-4 animate-fadeIn">
                <div className="flex items-center justify-center gap-2 text-amber-600 text-sm font-semibold">
                  <span>⏳</span>
                  <span>Look closely! Hiding in {recallCountdown} seconds...</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {currentQuestion.display_items.map((it, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-cream-200 shadow-xs flex flex-col items-center gap-2">
                      <span className="text-4xl sm:text-5xl">{it.emoji}</span>
                      <span className="text-sm font-semibold text-stone-700">{it.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-cream-100 rounded-3xl p-6 border border-cream-200 text-center text-stone-500 space-y-2 animate-fadeIn">
                <span className="text-3xl">🧺</span>
                <p className="font-medium text-base">The items are now resting under the gentle cloth.</p>
                <p className="text-xs text-stone-400">Can you recall which one was on the tray?</p>
              </div>
            )}
          </div>
        )}

        {/* 3. Attention Target Spotting */}
        {currentQuestion.grid_items && (
          <div className="my-6 space-y-4">
            <div className="text-center font-medium text-stone-600 text-sm">
              Tapped: <span className="font-bold text-peach-600 text-lg">{attentionTappedCount}</span> of {currentQuestion.target_count} Blue Circles
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              {currentQuestion.grid_items.map((circle) => (
                <button
                  key={circle.id}
                  onClick={() => {
                    if (circle.is_target) {
                      if (soundEffects) sounds.playChime('tap');
                      setAttentionTappedCount(c => {
                        const newCount = c + 1;
                        if (newCount >= currentQuestion.target_count) {
                          handleSelectOption("completed");
                        }
                        return newCount;
                      });
                    } else {
                      if (soundEffects) sounds.playChime('hint');
                    }
                  }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-cream-50 border-2 border-cream-200 flex items-center justify-center text-4xl hover:bg-cream-100 transition shadow-xs active:scale-95"
                >
                  {circle.val}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Sequence & Routine Reordering */}
        {currentQuestion.puzzle_type === 'order_sequence' && (
          <div className="my-6 space-y-3 max-w-md mx-auto">
            <p className="text-xs text-stone-500 text-center">Tap any step to swap its order:</p>
            {routineOrderedSteps.map((step, idx) => (
              <div
                key={step.step_id}
                onClick={() => {
                  const copy = [...routineOrderedSteps];
                  const nextIdx = (idx + 1) % copy.length;
                  const temp = copy[idx];
                  copy[idx] = copy[nextIdx];
                  copy[nextIdx] = temp;
                  setRoutineOrderedSteps(copy);
                  if (soundEffects) sounds.playChime('tap');
                }}
                className="p-4 rounded-2xl bg-white border-2 border-cream-200 hover:border-peach-300 shadow-xs cursor-pointer flex items-center justify-between gap-3 transition"
              >
                <span className="w-8 h-8 rounded-full bg-peach-100 text-peach-600 font-bold flex items-center justify-center text-sm">
                  {idx + 1}
                </span>
                <span className="text-base font-semibold text-stone-800 flex-1">{step.text}</span>
                <span className="text-stone-400 text-xs">↕️ Swap</span>
              </div>
            ))}

            <button
              onClick={() => {
                const seq = routineOrderedSteps.map(s => s.step_id);
                handleSelectOption(seq);
              }}
              className="w-full mt-4 py-3 rounded-xl bg-peach-500 text-white font-semibold shadow-xs hover:bg-peach-600 transition"
            >
              {t.buttons.confirmSeq}
            </button>
          </div>
        )}

        {/* 5. Missing Letters / Pattern Prompt */}
        {currentQuestion.prompt_display && (
          <div className="my-6 py-6 px-8 rounded-3xl bg-cream-100/80 border border-cream-300 text-center">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-800 tracking-wider">
              {currentQuestion.prompt_display}
            </span>
            {currentQuestion.prompt_hint && (
              <p className="text-sm text-stone-500 mt-2">{currentQuestion.prompt_hint}</p>
            )}
          </div>
        )}

        {/* Multiple Choice Options */}
        {currentQuestion.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {currentQuestion.options.map((opt, i) => {
              const isChosen = selectedOption === opt;
              let btnStyle = "bg-white hover:bg-cream-50 border-cream-200 text-stone-800";
              
              if (isAnswerSubmitted) {
                if (answersMatch(opt, getCorrectAnswer(currentQuestion))) {
                  btnStyle = "bg-sage-100 border-sage-500 text-sage-900 font-bold shadow-sm";
                } else if (isChosen) {
                  btnStyle = "bg-amber-50 border-amber-300 text-amber-900";
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswerSubmitted && isCorrect}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-5 rounded-2xl border-2 text-left font-semibold text-lg transition-all transform active:scale-98 shadow-xs flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerSubmitted && answersMatch(opt, getCorrectAnswer(currentQuestion)) && (
                    <span className="w-7 h-7 rounded-full bg-sage-500 text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Supportive Feedback with Voice */}
        {isAnswerSubmitted && (
          <div className={`p-5 rounded-2xl border animate-fadeIn transition ${isCorrect ? 'bg-sage-50 border-sage-200 text-sage-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{isCorrect ? '❤️' : '😊'}</span>
                <div>
                  <h4 className="font-bold text-base">
                    {isCorrect ? (voiceLanguage === 'hi' ? 'बहुत बढ़िया!' : 'Wonderful!') : (voiceLanguage === 'hi' ? "कोई बात नहीं! फिर से कोशिश करते हैं।" : "That's okay! Let's try again.")}
                  </h4>
                  <p className="text-sm mt-0.5">
                    {isCorrect ? currentQuestion.explanation : (voiceLanguage === 'hi' ? "शांत मन से सोचें। नीचे दिए गए संकेत को सुनें।" : "Take your time. Notice the gentle hint below to help you.")}
                  </p>
                </div>
              </div>

              <SpeakerButton
                text={getSpokenEncouragement(
                  isCorrect,
                  voiceLanguage,
                  currentQuestion.game_type === 'recognition' ? currentQuestion.correct_answer : null,
                  familyMembers[0]?.relationship
                )}
                lang={voiceLanguage}
                speed={speechSpeed}
                size="sm"
              />
            </div>
          </div>
        )}

        {/* Progressive Hint System in Voice Pack */}
        <div className="pt-2 border-t border-cream-100 space-y-3">
          {hintsUnlocked > 0 && currentQuestion.hints && (
            <div className="space-y-2 animate-fadeIn">
              {currentQuestion.hints.slice(0, hintsUnlocked).map((h, hIdx) => {
                const spokenHint = getSpokenHintText(h, hIdx, currentQuestion, voiceLanguage, familyMembers[0]);
                return (
                  <div key={hIdx} className="p-3.5 rounded-xl bg-skysoft-50 border border-skysoft-200 text-skysoft-800 text-sm flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">💡</span>
                      <span>{interfaceLanguage === 'hi' ? spokenHint : h}</span>
                    </div>
                    <SpeakerButton
                      text={spokenHint}
                      lang={voiceLanguage}
                      speed={speechSpeed}
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            {(!isAnswerSubmitted || !isCorrect) && (
              <button
                onClick={() => {
                  if (soundEffects) sounds.playChime('hint');
                  const nextIdx = hintsUnlocked;
                  setHintsUnlocked(h => Math.min((currentQuestion.hints?.length || 0), h + 1));
                  if (currentQuestion.hints && currentQuestion.hints[nextIdx]) {
                    const spokenHint = getSpokenHintText(
                      currentQuestion.hints[nextIdx],
                      nextIdx,
                      currentQuestion,
                      voiceLanguage,
                      familyMembers[0]
                    );
                    voiceService.speak(spokenHint, voiceLanguage, speechSpeed);
                  }
                }}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1.5 py-2 px-3 rounded-xl bg-cream-100 hover:bg-cream-200 transition"
              >
                <span>💡</span>
                <span>{t.buttons.needHint}</span>
              </button>
            )}

            {isCorrect && (
              <button
                onClick={handleNext}
                className="ml-auto px-7 py-3 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-base shadow-md transition flex items-center gap-2"
              >
                <span>{t.buttons.nextActivity}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// DAILY CHECK-IN VIEW (WITH VOICE PACK)
// ==========================================
function DailyCheckInView({
  patient,
  familyMembers,
  setView,
  soundEffects,
  voiceGuidance,
  onDataRefresh,
  voiceLanguage,
  speechSpeed,
  interfaceLanguage,
  t
}) {
  const [step, setStep] = useState(1);
  const [orientationSelected, setOrientationSelected] = useState(null);
  const [faceSelected, setFaceSelected] = useState(null);
  const [faceHintUnlocked, setFaceHintUnlocked] = useState(false);
  const [isFaceCorrect, setIsFaceCorrect] = useState(false);

  const primaryFam = familyMembers[0] || {
    name: "Rohan",
    relationship: "Grandson",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop"
  };

  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'Morning' : (hour < 17 ? 'Afternoon' : 'Evening');

  const relHi = RELATION_MAP.hi[primaryFam.relationship] || primaryFam.relationship;

  const spokenGreeting = voiceLanguage === 'hi' 
    ? `सुप्रभात, ${patient.preferred_name} जी। आज एक शांत ${dayOfWeek} है। आइए आज की परिचित चेहरों वाली गतिविधि शुरू करते हैं।`
    : `Good ${timeOfDay.toLowerCase()}, ${patient.preferred_name}. Let's start today's familiar faces activity.`;

  const spokenQuestion = voiceLanguage === 'hi'
    ? "यह कौन है? तस्वीर देखकर नाम पहचानिए।"
    : "Who is this familiar smiling person? Look at the photo and choose their name.";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {step === 1 && (
        <div className="bg-white rounded-3xl p-8 border border-cream-200 gentle-shadow space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-peach-100 text-peach-700">
              Daily Check-in • Step 1 of 2
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-stone-800">
              Good {timeOfDay}, {patient.preferred_name} ☀️
            </h2>
            <p className="text-stone-600 text-base">
              Today is a peaceful <strong>{dayOfWeek}</strong>. What time of day is it right now?
            </p>
            <div className="flex justify-center pt-2">
              <SpeakerButton
                text={spokenGreeting}
                lang={voiceLanguage}
                speed={speechSpeed}
                size="sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["Morning 🌅", "Afternoon ☀️", "Evening 🌙"].map((tod) => (
              <button
                key={tod}
                onClick={() => {
                  setOrientationSelected(tod);
                  if (soundEffects) sounds.playChime('tap');
                }}
                className={`p-4 rounded-2xl border-2 font-semibold text-center transition ${orientationSelected === tod ? 'bg-peach-100 border-peach-500 text-peach-900 shadow-sm' : 'bg-white border-cream-200 text-stone-700 hover:bg-cream-50'}`}
              >
                {tod}
              </button>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              disabled={!orientationSelected}
              onClick={() => {
                if (soundEffects) sounds.playChime('tap');
                setStep(2);
                if (voiceGuidance) {
                  setTimeout(() => {
                    voiceService.speak(spokenQuestion, voiceLanguage, speechSpeed);
                  }, 400);
                }
              }}
              className="px-8 py-3.5 rounded-2xl bg-peach-500 hover:bg-peach-600 disabled:opacity-50 text-white font-semibold text-base shadow-md transition"
            >
              Continue to Familiar Faces →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-3xl p-8 border border-cream-200 gentle-shadow space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-peach-100 text-peach-700">
              Daily Check-in • Step 2 of 2
            </span>
            <div className="flex items-center justify-center gap-3">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-stone-800">
                Who is this familiar smiling person? ❤️
              </h2>
              <SpeakerButton
                text={spokenQuestion}
                lang={voiceLanguage}
                speed={speechSpeed}
                size="sm"
              />
            </div>
            <p className="text-stone-500 text-base">
              Look at their photo below and choose their name.
            </p>
          </div>

          <div className="flex justify-center">
            <img 
              src={primaryFam.photo} 
              alt={primaryFam.name}
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl object-cover border-4 border-peach-100 shadow-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[primaryFam.name, "Priya", "Ankit", "Sunil"].map((name) => {
              const isSelected = faceSelected === name;
              let style = "bg-white border-cream-200 text-stone-800 hover:bg-cream-50";
              if (faceSelected) {
                if (name === primaryFam.name) {
                  style = "bg-sage-100 border-sage-500 text-sage-900 font-bold";
                } else if (isSelected) {
                  style = "bg-amber-50 border-amber-300 text-amber-900";
                }
              }

              return (
                <button
                  key={name}
                  onClick={() => {
                    setFaceSelected(name);
                    const correct = name === primaryFam.name;
                    setIsFaceCorrect(correct);
                    if (correct) {
                      if (soundEffects) sounds.playChime('success');
                      const affirm = voiceLanguage === 'hi'
                        ? `बहुत अच्छा! आपने ${primaryFam.name}, अपने प्यारे ${relHi} को पहचान लिया।`
                        : `Wonderful! You remembered ${primaryFam.name}, your loving ${primaryFam.relationship.toLowerCase()}!`;
                      voiceService.speak(affirm, voiceLanguage, speechSpeed);
                    } else {
                      if (soundEffects) sounds.playChime('hint');
                      setFaceHintUnlocked(true);
                      const gentleHint = voiceLanguage === 'hi'
                        ? `कोई बात नहीं! यह आपके परिवार के एक प्रिय सदस्य हैं, आपके ${relHi}।`
                        : `That's okay. This person is a member of your family, your ${primaryFam.relationship.toLowerCase()}.`;
                      voiceService.speak(gentleHint, voiceLanguage, speechSpeed);
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 text-center text-lg font-semibold transition ${style}`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          {faceHintUnlocked && !isFaceCorrect && (
            <div className="p-3.5 rounded-xl bg-skysoft-50 border border-skysoft-200 text-skysoft-800 text-sm flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span>💡</span>
                <span>This is your beloved {primaryFam.relationship.toLowerCase()} who visits on weekends!</span>
              </div>
              <SpeakerButton
                text={voiceLanguage === 'hi' ? `यह आपके प्यारे ${relHi} हैं जो सप्ताहांत में आते हैं।` : `This is your loving ${primaryFam.relationship.toLowerCase()}.`}
                lang={voiceLanguage}
                speed={speechSpeed}
                size="sm"
              />
            </div>
          )}

          {isFaceCorrect && (
            <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-sage-800 text-center space-y-1 animate-fadeIn">
              <p className="font-bold text-base">Wonderful! You remembered {primaryFam.name}. ❤️</p>
              <p className="text-sm">This is {primaryFam.name}, your cherished {primaryFam.relationship.toLowerCase()}.</p>
            </div>
          )}

          <div className="text-center pt-2">
            {isFaceCorrect ? (
              <button
                onClick={async () => {
                  voiceService.stop();
                  try {
                    await fetch('/api/checkin', { method: 'POST' });
                    onDataRefresh();
                  } catch (e) {
                    console.error(e);
                  }
                  setView('dashboard');
                }}
                className="px-8 py-3.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-semibold text-base shadow-md transition"
              >
                Complete Check-in ✓
              </button>
            ) : (
              <button
                onClick={() => {
                  setFaceHintUnlocked(true);
                  const hintText = voiceLanguage === 'hi' ? `यह आपके प्यारे ${relHi} हैं।` : `This is your loving ${primaryFam.relationship.toLowerCase()}.`;
                  voiceService.speak(hintText, voiceLanguage, speechSpeed);
                }}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800"
              >
                Need a gentle hint? 💡
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ALL 8 GAMES CATALOG VIEW
// ==========================================
function GamesCatalogView({ setView, soundEffects, interfaceLanguage, voiceLanguage, speechSpeed }) {
  const games = [
    {
      id: "game_faces",
      title: "Familiar Faces",
      category: "Recognition & Connection",
      badge: "Heartwarming",
      icon: "🧑",
      desc: "Recognize beloved children, grandchildren, and cherished family memories through warm photos.",
      levels: "Level 1–4 Adaptive"
    },
    {
      id: "game_recall",
      title: "Remember & Recall",
      category: "Working & Short-Term Memory",
      badge: "Memory Practice",
      icon: "🧠",
      desc: "View familiar everyday objects, watch them rest under a gentle cloth, and recall what you noticed.",
      levels: "3–6 Objects with Delay"
    },
    {
      id: "game_focus",
      title: "Focus & Attention",
      category: "Visual Attention & Calm",
      badge: "Calm Focus",
      icon: "🎯",
      desc: "Spot peaceful colors and shapes with gentle, unhurried focus and zero false tap penalty.",
      levels: "Visual Target Tracking"
    },
    {
      id: "game_routine",
      title: "Daily Routine Puzzle",
      category: "Signature Feature",
      badge: "Signature",
      icon: "🗓️",
      desc: "Organize your favorite daily morning or evening habits in comfortable sequence.",
      levels: "Caregiver Personalized"
    },
    {
      id: "game_match",
      title: "Match & Associate",
      category: "Semantic Association",
      badge: "Everyday Tools",
      icon: "🪥",
      desc: "Connect common household tools, kitchen objects, and places to their familiar everyday uses.",
      levels: "Everyday Purpose Match"
    },
    {
      id: "game_words",
      title: "Words & Language",
      category: "Language & Comfort",
      badge: "Comforting Words",
      icon: "📖",
      desc: "Complete familiar positive words and discover gentle opposites without time pressure.",
      levels: "Word & Letter Completion"
    },
    {
      id: "game_culture",
      title: "Culture & Familiarity",
      category: "Heritage & Autobiographical",
      badge: "Beloved Traditions",
      icon: "🪔",
      desc: "Celebrate fond memories of traditional festivals like Diwali, regional foods, and soothing melodies.",
      levels: "Regional Personalization"
    },
    {
      id: "game_reasoning",
      title: "Sequence & Reasoning",
      category: "Logical Thinking",
      badge: "Gentle Patterns",
      icon: "🌿",
      desc: "Follow smooth counting patterns (2, 4, 6) and everyday logical sequences with reassuring hints.",
      levels: "Adaptive Number Series"
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-stone-800">Cognitive Wellness Activities</h2>
          <p className="text-stone-500 mt-1">Explore all 8 gentle activity categories with voice guidance in your chosen Voice Pack.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {games.map((g) => (
          <div 
            key={g.id}
            onClick={() => {
              if (soundEffects) sounds.playChime('tap');
              setView(`game:${g.id}`);
            }}
            className="bg-white rounded-3xl p-6 border border-cream-200 gentle-shadow gentle-shadow-hover transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{g.icon}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-peach-50 text-peach-600 border border-peach-200">
                  {g.badge}
                </span>
              </div>
              <h3 className="font-heading font-bold text-stone-800 text-lg">{g.title}</h3>
              <p className="text-xs font-semibold text-sage-600 mt-0.5">{g.category}</p>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">{g.desc}</p>
            </div>

            <div className="mt-6 pt-3 border-t border-cream-100 flex items-center justify-between text-xs">
              <span className="text-stone-400 font-medium">{g.levels}</span>
              <span className="text-peach-600 font-semibold">Play Now →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// PATIENT ROUTINE VIEW
// ==========================================
function PatientRoutineView({ routines, patient, soundEffects, voiceGuidance, onDataRefresh, voiceLanguage, speechSpeed }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 gentle-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🗓️</span>
            <div>
              <h2 className="font-heading font-bold text-2xl text-stone-800">My Daily Rhythm & Habits</h2>
              <p className="text-sm text-stone-500">A peaceful schedule tailored with your family.</p>
            </div>
          </div>
          <SpeakerButton
            text={voiceLanguage === 'hi' ? "यह आपकी दैनिक दिनचर्या है: सुबह का व्यायाम, पौष्टिक नाश्ता, और परिवार के साथ समय।" : "This is your daily routine: gentle morning habits, healthy meals, and restful evenings."}
            lang={voiceLanguage}
            speed={speechSpeed}
            size="sm"
          />
        </div>

        <div className="mt-8 space-y-8">
          {routines.map((rt) => (
            <div key={rt.id} className="space-y-3">
              <div className="flex items-center justify-between border-b border-cream-200 pb-2">
                <h3 className="font-heading font-bold text-lg text-stone-800 flex items-center gap-2">
                  <span>{rt.id.includes('morning') ? '🌅' : rt.id.includes('afternoon') ? '☀️' : '🌙'}</span>
                  <span>{rt.category}</span>
                </h3>
                <span className="text-xs text-stone-400 font-medium">{rt.period}</span>
              </div>

              <div className="space-y-2.5">
                {rt.steps.map((step) => (
                  <div
                    key={step.id}
                    onClick={async () => {
                      if (soundEffects) sounds.playChime('tap');
                      try {
                        await fetch(`/api/routines/${rt.id}/step/${step.id}/toggle`, { method: 'POST' });
                        onDataRefresh();
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className={`p-4 rounded-2xl border transition flex items-center justify-between cursor-pointer ${step.completed ? 'bg-cream-50 border-cream-200 opacity-75' : 'bg-white border-cream-200 hover:border-peach-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${step.completed ? 'bg-sage-600 border-sage-600 text-white' : 'border-stone-300'}`}>
                        {step.completed && <span className="text-xs font-bold">✓</span>}
                      </div>
                      <span className={`text-base font-semibold ${step.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                        {step.title}
                      </span>
                    </div>

                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-cream-100 text-stone-600">
                      {step.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PATIENT REMINDERS VIEW
// ==========================================
function PatientRemindersView({ reminders, setReminders, soundEffects, voiceGuidance, voiceLanguage, speechSpeed }) {
  const toggleReminder = async (id) => {
    if (soundEffects) sounds.playChime('tap');
    try {
      const res = await fetch(`/api/reminders/${id}/toggle`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setReminders(reminders.map(r => r.id === id ? json.reminder : r));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 gentle-shadow space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏰</span>
            <div>
              <h2 className="font-heading font-bold text-2xl text-stone-800">My Daily Reminders</h2>
              <p className="text-sm text-stone-500">Medications, meals, exercises, and family calls with audio reminders.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {reminders.map((rem) => {
            const spokenRem = getSpokenReminder(rem, voiceLanguage);
            return (
              <div
                key={rem.id}
                className={`p-5 rounded-2xl border transition flex items-center justify-between gap-4 ${rem.completed ? 'bg-cream-50 border-cream-200 opacity-70' : 'bg-white border-orange-100 shadow-xs'}`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition ${rem.completed ? 'bg-sage-600 border-sage-600 text-white' : 'border-stone-300 hover:border-sage-500'}`}
                  >
                    {rem.completed && <span className="text-sm font-bold">✓</span>}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-peach-100 text-peach-700">
                        {rem.badge}
                      </span>
                      <span className="text-xs text-stone-400">{rem.due_period}</span>
                    </div>
                    <h4 className={`text-base font-bold mt-1 ${rem.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                      {rem.title}
                    </h4>
                    <p className="text-xs text-stone-500">{rem.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <SpeakerButton
                    text={spokenRem}
                    lang={voiceLanguage}
                    speed={speechSpeed}
                    size="sm"
                  />
                  <div className="text-right">
                    <span className="font-heading font-bold text-stone-700 text-base block">{rem.time}</span>
                    <span className="text-xs text-stone-400">Daily</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FAMILY ALBUM VIEW
// ==========================================
function FamilyAlbumView({ familyMembers, soundEffects, voiceGuidance, voiceLanguage, speechSpeed }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-stone-800">Family & Loved Ones Album</h2>
          <p className="text-stone-500 mt-1">Cherished faces, memories, and beloved family connections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((fam) => {
          const relHi = RELATION_MAP.hi[fam.relationship] || fam.relationship;
          const spoken = voiceLanguage === 'hi' 
            ? `${fam.name}, आपके प्रिय ${relHi}। ${fam.familiarity_notes}`
            : `${fam.name}, your ${fam.relationship}. ${fam.familiarity_notes}`;

          return (
            <div 
              key={fam.id}
              className="bg-white rounded-3xl p-6 border border-cream-200 gentle-shadow space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img 
                    src={fam.photo} 
                    alt={fam.name}
                    className="w-full h-56 object-cover hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-peach-600 border border-peach-200">
                    {fam.relationship}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-stone-800 text-xl">{fam.name}</h3>
                    {fam.nickname && (
                      <span className="text-xs font-semibold text-stone-400">"{fam.nickname}"</span>
                    )}
                  </div>

                  <SpeakerButton
                    text={spoken}
                    lang={voiceLanguage}
                    speed={speechSpeed}
                    size="sm"
                  />
                </div>

                <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                  {fam.familiarity_notes}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between text-xs text-stone-400">
                <span>❤️ Recognized {fam.times_recognized} times</span>
                <span className="font-medium text-peach-600">{fam.favorite_activity}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// PATIENT PROFILE & VOICE SETTINGS VIEW
// ==========================================
function PatientProfileView({
  patient,
  setPatient,
  culturalPref,
  skillProfile,
  setView,
  interfaceLanguage,
  setInterfaceLanguage,
  voiceLanguage,
  setVoiceLanguage,
  speechSpeed,
  setSpeechSpeed,
  autoReadAloud,
  setAutoReadAloud,
  voiceGuidance,
  savePatientSettings,
  setShowVoiceModal,
  t
}) {
  const currentPack = VOICE_PACKS[voiceLanguage] || VOICE_PACKS['hi'];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Patient Header Card */}
      <div className="bg-white rounded-3xl p-8 border border-cream-200 gentle-shadow space-y-6">
        <div className="flex items-center gap-4">
          <img 
            src={patient.avatar} 
            alt={patient.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-peach-200 shadow-sm"
          />
          <div>
            <h2 className="font-heading font-bold text-2xl text-stone-800">{patient.name}</h2>
            <p className="text-sm text-peach-600 font-semibold">{patient.region} • {patient.age} years</p>
            <p className="text-xs text-stone-500 mt-1">{patient.language}</p>
          </div>
        </div>

        <p className="text-sm text-stone-600 leading-relaxed bg-cream-50 p-4 rounded-2xl border border-cream-200">
          "{patient.bio}"
        </p>
      </div>

      {/* DEDICATED LANGUAGE & VOICE PACK SETTINGS CARD */}
      <div className="bg-white rounded-3xl p-8 border border-peach-200 gentle-shadow space-y-6">
        <div className="flex items-center justify-between border-b border-cream-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-peach-100 text-peach-600 flex items-center justify-center text-2xl">
              🔊
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-stone-800">Language & Voice Pack</h3>
              <p className="text-xs text-stone-500">Configure visual display language and spoken voice independently.</p>
            </div>
          </div>

          <button
            onClick={() => voiceService.previewVoice(voiceLanguage, speechSpeed)}
            className="px-4 py-2 rounded-xl bg-peach-50 text-peach-700 font-semibold text-xs border border-peach-200 hover:bg-peach-100 transition flex items-center gap-1.5"
          >
            <span>▶</span>
            <span>Test Voice</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Interface Visual Language */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
              Interface Language (On-Screen Text)
            </label>
            <select
              value={interfaceLanguage}
              onChange={(e) => savePatientSettings({ interface_language: e.target.value })}
              className="w-full p-3.5 rounded-2xl border border-cream-300 text-sm font-semibold text-stone-800 bg-cream-50 focus:border-peach-500 outline-hidden"
            >
              <option value="en">English (Display Text)</option>
              <option value="hi">हिंदी (स्क्रीन टेक्स्ट)</option>
            </select>
            <p className="text-xs text-stone-400">Controls menus, buttons, labels, and text on cards.</p>
          </div>

          {/* Spoken Voice Pack */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
              Spoken Voice Pack
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3.5 rounded-2xl border border-cream-300 bg-cream-50 text-sm font-bold text-stone-800 flex items-center gap-2">
                <span>{currentPack.flag}</span>
                <span>{currentPack.nativeName} ({currentPack.name})</span>
              </div>
              <button
                onClick={() => setShowVoiceModal(true)}
                className="px-4 py-3.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-semibold text-xs transition shadow-xs whitespace-nowrap"
              >
                Change Voice Pack
              </button>
            </div>
            <p className="text-xs text-stone-400">Controls spoken questions, feedback, hints, and reminders.</p>
          </div>
        </div>

        {/* Speech Pace Controls */}
        <div className="pt-2 border-t border-cream-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
              Speech Speed
            </label>
            <select
              value={speechSpeed}
              onChange={(e) => savePatientSettings({ speech_speed: e.target.value })}
              className="w-full p-3.5 rounded-2xl border border-cream-300 text-sm font-semibold text-stone-800 bg-cream-50 focus:border-peach-500 outline-hidden"
            >
              <option value="slow">Slow Pace (0.75x) - Extra Clear</option>
              <option value="normal">Normal Pace (0.9x) - Senior Friendly</option>
              <option value="fast">Fast Pace (1.1x)</option>
            </select>
          </div>

          {/* Auto Read Aloud Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
              Auto Read Questions
            </label>
            <div className="flex items-center justify-between p-3 rounded-2xl border border-cream-300 bg-cream-50">
              <div>
                <span className="text-sm font-semibold text-stone-800 block">Read aloud automatically</span>
                <span className="text-xs text-stone-400">Speaks new questions without needing to tap 🔊</span>
              </div>
              <button
                type="button"
                onClick={() => savePatientSettings({ auto_read_aloud: !autoReadAloud })}
                className={`w-13 h-7 rounded-full transition-colors relative flex items-center px-1 ${autoReadAloud ? 'bg-peach-500' : 'bg-stone-300'}`}
              >
                <span className={`w-5 h-5 rounded-full bg-white transition-transform ${autoReadAloud ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
              Voice Enabled
            </label>
            <div className="flex items-center justify-between p-3 rounded-2xl border border-cream-300 bg-cream-50">
              <div>
                <span className="text-sm font-semibold text-stone-800 block">Spoken guidance</span>
                <span className="text-xs text-stone-400">Turn this off to keep every activity visual.</span>
              </div>
              <button
                type="button"
                aria-label="Toggle spoken guidance"
                aria-pressed={voiceGuidance}
                onClick={() => savePatientSettings({ voice_enabled: !voiceGuidance })}
                className={`w-13 h-7 rounded-full transition-colors relative flex items-center px-1 ${voiceGuidance ? 'bg-peach-500' : 'bg-stone-300'}`}
              >
                <span className={`w-5 h-5 rounded-full bg-white transition-transform ${voiceGuidance ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CONVERSATIONAL ONBOARDING MODAL
// ==========================================
function PatientOnboardingModal({ patient, onComplete, voiceLanguage, setVoiceLanguage, speechSpeed, soundEffects }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(patient.preferred_name || "");
  const [selectedVoice, setSelectedVoice] = useState(voiceLanguage || "hi");
  const [voiceAvailability, setVoiceAvailability] = useState(() => voiceService.getVoiceAvailability());
  const [selectedLang, setSelectedLang] = useState("en");
  const [region, setRegion] = useState(patient.region || "Delhi / NCR");
  const [famName, setFamName] = useState("");
  const [famRelation, setFamRelation] = useState("Grandson");

  useEffect(() => voiceService.addVoiceAvailabilityListener(setVoiceAvailability), []);
  const [famNotes, setFamNotes] = useState("");

  const handleFinish = async () => {
    try {
      await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: name,
          region,
          interface_language: selectedLang,
          voice_language: selectedVoice,
          speech_speed: speechSpeed,
          auto_read_aloud: false,
          new_family_member: famName ? {
            name: famName,
            relationship: famRelation,
            notes: famNotes
          } : null
        })
      });
      onComplete();
    } catch (e) {
      console.error(e);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 border border-cream-200 gentle-shadow space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-peach-100 text-peach-700">
            Welcome to SmritiSaathi • Step {step} of 4
          </span>
          <h2 className="font-heading font-bold text-2xl text-stone-800">
            {step === 1 ? "Let's Get Acquainted" : step === 2 ? "How would you like to hear your activities?" : step === 3 ? "Your Roots & Region" : "A Beloved Family Member"}
          </h2>
          <p className="text-xs text-stone-500">
            {step === 1 ? "How would you like us to address you comfortably?" : step === 2 ? "Choose your preferred spoken voice language." : step === 3 ? "Tailoring familiar memories and traditions." : "We'll gently include them in your daily recognition."}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Preferred Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Devendra Ji"
                className="w-full p-3.5 rounded-xl border border-stone-200 text-base focus:border-peach-500 outline-hidden"
              />
            </div>
          </div>
        )}

        {/* STEP 2: VOICE PACK SELECTION */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {['hi', 'en', 'pa', 'bn'].map((vId) => {
                const p = VOICE_PACKS[vId];
                const isSel = selectedVoice === vId;
                const isAvailable = voiceAvailability[vId];
                return (
                  <div
                    key={vId}
                    onClick={() => {
                      if (!isAvailable) return;
                      setSelectedVoice(vId);
                      if (soundEffects) sounds.playChime('tap');
                    }}
                    aria-disabled={!isAvailable}
                    className={`p-4 rounded-2xl border-2 transition flex flex-col justify-between ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} ${isSel ? 'bg-peach-50 border-peach-500 ring-2 ring-peach-200' : 'bg-white border-cream-200'} ${isAvailable && !isSel ? 'hover:border-peach-200' : ''}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{p.flag}</span>
                        {isSel && <span className="text-xs font-bold text-peach-600">✓ Selected</span>}
                      </div>
                      <h4 className="font-bold text-stone-800 text-base">{p.nativeName}</h4>
                      <p className="text-xs text-stone-500">{isAvailable ? `${p.name} Voice` : 'Spoken guidance unavailable'}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        voiceService.previewVoice(vId, speechSpeed);
                      }}
                      disabled={!isAvailable}
                      className="mt-3 py-1.5 px-2.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-stone-700 text-xs font-bold border border-cream-200 flex items-center justify-center gap-1"
                    >
                      <span>▶</span>
                      <span>Play Sample</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Try your voice interactive card */}
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-center space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Try your voice</h4>
              <p className="text-sm font-semibold text-stone-800 italic">
                "{VOICE_PACKS[selectedVoice]?.previewPhrase}"
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => voiceService.previewVoice(selectedVoice, speechSpeed)}
                  disabled={!voiceAvailability[selectedVoice]}
                  className="px-4 py-2 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1.5"
                >
                  <span>▶</span>
                  <span>Play Sample</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-peach-50/80 border border-peach-200 text-center space-y-2">
              <p className="text-xs font-semibold text-peach-800">
                Does this voice work well for you?
              </p>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEffects) sounds.playChime('tap');
                    setStep(3);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-sage-600 text-white text-xs font-bold hover:bg-sage-700 transition"
                >
                  Yes, continue
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const availablePacks = Object.keys(VOICE_PACKS).filter(id => voiceAvailability[id]);
                    const nextIndex = availablePacks.indexOf(selectedVoice) + 1;
                    if (availablePacks.length) setSelectedVoice(availablePacks[nextIndex % availablePacks.length]);
                  }}
                  disabled={!Object.values(voiceAvailability).some(Boolean)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-50 transition"
                >
                  Choose another voice
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Region / Hometown</label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-stone-200 text-base focus:border-peach-500 outline-hidden"
              >
                <option value="Delhi / NCR">Delhi / NCR</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Family Member Name</label>
              <input
                type="text"
                value={famName}
                onChange={e => setFamName(e.target.value)}
                placeholder="e.g. Rohan"
                className="w-full p-3.5 rounded-xl border border-stone-200 text-base focus:border-peach-500 outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Relationship</label>
              <input
                type="text"
                value={famRelation}
                onChange={e => setFamRelation(e.target.value)}
                placeholder="e.g. Grandson"
                className="w-full p-3.5 rounded-xl border border-stone-200 text-base focus:border-peach-500 outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Cherished Memory / Note</label>
              <input
                type="text"
                value={famNotes}
                onChange={e => setFamNotes(e.target.value)}
                placeholder="e.g. Loves playing chess on Sundays"
                className="w-full p-3.5 rounded-xl border border-stone-200 text-base focus:border-peach-500 outline-hidden"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 text-sm text-stone-500 hover:text-stone-800 font-semibold"
            >
              ← Back
            </button>
          ) : <div></div>}

          {step < 4 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-6 py-3 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-semibold text-sm transition"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-3 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm transition"
            >
              Begin Journey 🌸
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CAREGIVER EXPERIENCE COMPONENT
// ==========================================
function CaregiverExperience({
  view,
  setView,
  patient,
  familyMembers,
  setFamilyMembers,
  routines,
  reminders,
  setReminders,
  culturalPref,
  skillProfile,
  alerts,
  analyticsData,
  onDataRefresh,
  soundEffects,
  voiceGuidance,
  interfaceLanguage,
  setInterfaceLanguage,
  voiceLanguage,
  setVoiceLanguage,
  speechSpeed,
  setSpeechSpeed,
  autoReadAloud,
  setAutoReadAloud,
  savePatientSettings,
  setShowVoiceModal
}) {
  if (view === 'analytics') {
    return <CaregiverAnalyticsView analyticsData={analyticsData} skillProfile={skillProfile} />;
  }
  if (view === 'voice_settings') {
    return (
      <CaregiverVoiceSettings
        interfaceLanguage={interfaceLanguage}
        voiceLanguage={voiceLanguage}
        speechSpeed={speechSpeed}
        autoReadAloud={autoReadAloud}
        voiceGuidance={voiceGuidance}
        savePatientSettings={savePatientSettings}
        setShowVoiceModal={setShowVoiceModal}
        soundEffects={soundEffects}
      />
    );
  }
  if (view === 'family_mgr') {
    return <CaregiverFamilyManager familyMembers={familyMembers} setFamilyMembers={setFamilyMembers} soundEffects={soundEffects} />;
  }
  if (view === 'routine_mgr') {
    return <CaregiverRoutineManager routines={routines} onDataRefresh={onDataRefresh} soundEffects={soundEffects} />;
  }
  if (view === 'reminder_mgr') {
    return <CaregiverReminderManager reminders={reminders} setReminders={setReminders} soundEffects={soundEffects} />;
  }
  if (view === 'culture_mgr') {
    return <CaregiverCultureManager culturalPref={culturalPref} onDataRefresh={onDataRefresh} soundEffects={soundEffects} />;
  }
  if (view === 'alerts') {
    return <CaregiverAlertsView alerts={alerts} />;
  }

  // Default: Caregiver Overview
  return (
    <CaregiverDashboardOverview
      patient={patient}
      skillProfile={skillProfile}
      alerts={alerts}
      reminders={reminders}
      analyticsData={analyticsData}
      setView={setView}
      voiceLanguage={voiceLanguage}
      setShowVoiceModal={setShowVoiceModal}
    />
  );
}

// ==========================================
// CAREGIVER DASHBOARD OVERVIEW
// ==========================================
function CaregiverDashboardOverview({ patient, skillProfile, alerts, reminders, analyticsData, setView, voiceLanguage, setShowVoiceModal }) {
  const currentPack = VOICE_PACKS[voiceLanguage] || VOICE_PACKS['hi'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Patient Summary Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 gentle-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={patient.avatar} 
            alt={patient.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-sage-300 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-bold text-2xl text-stone-800">{patient.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sage-100 text-sage-700">
                Active Patient
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Primary Caregiver: <strong>Dr. Ananya Sharma (Daughter)</strong> • Active Voice: <strong className="text-peach-600">{currentPack.flag} {currentPack.nativeName} ({currentPack.name})</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-cream-200 pt-4 md:pt-0 md:pl-6">
          <div className="text-center">
            <span className="text-2xl font-bold font-heading text-stone-800 block">{patient.streak_days}</span>
            <span className="text-xs text-stone-500">Day Streak</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold font-heading text-stone-800 block">{patient.total_sessions_completed}</span>
            <span className="text-xs text-stone-500">Total Sessions</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold font-heading text-sage-600 block">3.5s</span>
            <span className="text-xs text-stone-500">Avg Reaction</span>
          </div>
        </div>
      </div>

      {/* Skill Profile Grid Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-xl text-stone-800">Current Cognitive Skill Profile</h2>
            <p className="text-xs text-stone-500">Multidimensional tracking across independent cognitive categories.</p>
          </div>
          <button 
            onClick={() => setView('analytics')}
            className="text-xs font-semibold text-sage-700 hover:text-sage-800"
          >
            Detailed Analytics & Trends →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(skillProfile).map(([key, skill]) => (
            <div key={key} className="bg-white rounded-2xl p-5 border border-cream-200 gentle-shadow space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">{skill.name}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-cream-100 text-stone-700">
                  Level {skill.level}/4
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-heading font-bold text-stone-800">{skill.accuracy_pct}%</span>
                <span className={`text-xs font-semibold ${skill.trend === 'up' ? 'text-sage-600' : 'text-stone-400'}`}>
                  {skill.trend === 'up' ? '↑ Improving' : '→ Stable'}
                </span>
              </div>

              <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-sage-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${skill.accuracy_pct}%` }}
                ></div>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts Feed & Care Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-cream-200 gentle-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-stone-800 flex items-center gap-2">
              <span>🔔</span>
              <span>Proactive Supportive Alerts</span>
            </h3>
            <button 
              onClick={() => setView('alerts')}
              className="text-xs text-sage-600 font-semibold"
            >
              All Alerts →
            </button>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 3).map((alt) => (
              <div 
                key={alt.id}
                className={`p-4 rounded-2xl border ${alt.severity === 'success' ? 'bg-sage-50 border-sage-200' : (alt.severity === 'gentle_care' ? 'bg-amber-50 border-amber-200' : 'bg-cream-50 border-cream-200')}`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-stone-800">{alt.title}</h4>
                  <span className="text-xs text-stone-400">{alt.timestamp}</span>
                </div>
                <p className="text-xs text-stone-600 mt-1">{alt.message}</p>
                <div className="mt-2 text-xs font-semibold text-stone-500 flex items-center gap-1">
                  <span>Action:</span>
                  <span>{alt.action_taken}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Caregiver Shortcuts */}
        <div className="bg-white rounded-3xl p-6 border border-cream-200 gentle-shadow space-y-4">
          <h3 className="font-heading font-bold text-lg text-stone-800 flex items-center gap-2">
            <span>⚙️</span>
            <span>Caregiver Management Controls</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setView('voice_settings')}
              className="p-4 rounded-2xl border border-peach-200 bg-peach-50/70 hover:bg-peach-100 text-left transition"
            >
              <span className="text-2xl block mb-2">🔊</span>
              <h4 className="font-bold text-stone-800 text-sm">Language & Voice</h4>
              <p className="text-xs text-stone-500 mt-1">Configure spoken Hindi/English voice pack & speed.</p>
            </button>

            <button 
              onClick={() => setView('family_mgr')}
              className="p-4 rounded-2xl border border-cream-200 bg-cream-50 hover:bg-cream-100 text-left transition"
            >
              <span className="text-2xl block mb-2">🖼️</span>
              <h4 className="font-bold text-stone-800 text-sm">Family & Photos</h4>
              <p className="text-xs text-stone-500 mt-1">Upload/edit family member photos for recognition games.</p>
            </button>

            <button 
              onClick={() => setView('routine_mgr')}
              className="p-4 rounded-2xl border border-cream-200 bg-cream-50 hover:bg-cream-100 text-left transition"
            >
              <span className="text-2xl block mb-2">📋</span>
              <h4 className="font-bold text-stone-800 text-sm">Routine Timeline</h4>
              <p className="text-xs text-stone-500 mt-1">Customize morning, afternoon, and night habits.</p>
            </button>

            <button 
              onClick={() => setView('reminder_mgr')}
              className="p-4 rounded-2xl border border-cream-200 bg-cream-50 hover:bg-cream-100 text-left transition"
            >
              <span className="text-2xl block mb-2">⏰</span>
              <h4 className="font-bold text-stone-800 text-sm">Reminders</h4>
              <p className="text-xs text-stone-500 mt-1">Configure medications, meals, and calls.</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CAREGIVER VOICE & LANGUAGE SETTINGS VIEW
// ==========================================
function CaregiverVoiceSettings({
  interfaceLanguage,
  voiceLanguage,
  speechSpeed,
  autoReadAloud,
  voiceGuidance,
  savePatientSettings,
  setShowVoiceModal,
  soundEffects
}) {
  const currentPack = VOICE_PACKS[voiceLanguage] || VOICE_PACKS['hi'];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 border border-peach-200 gentle-shadow space-y-6">
        <div className="flex items-center justify-between border-b border-cream-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100 text-peach-700 text-xs font-semibold mb-2">
              <span>🩺</span>
              <span>Caregiver Portal • Patient Voice Settings</span>
            </div>
            <h2 className="font-heading font-bold text-2xl text-stone-800">Spoken Voice Pack & Language System</h2>
            <p className="text-xs text-stone-500 mt-1">
              Configure Devendra Ji's spoken guidance language, reading speed, and auto-read aloud behavior.
            </p>
          </div>

          <button
            onClick={() => voiceService.previewVoice(voiceLanguage, speechSpeed)}
            className="px-4 py-2 rounded-xl bg-peach-50 text-peach-700 font-semibold text-xs border border-peach-200 hover:bg-peach-100 transition flex items-center gap-1.5"
          >
            <span>▶</span>
            <span>Test Voice</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
              Patient Spoken Voice Pack
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3.5 rounded-2xl border border-cream-300 bg-cream-50 text-sm font-bold text-stone-800 flex items-center gap-2">
                <span>{currentPack.flag}</span>
                <span>{currentPack.nativeName} ({currentPack.name})</span>
              </div>
              <button
                onClick={() => setShowVoiceModal(true)}
                className="px-4 py-3.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-semibold text-xs transition whitespace-nowrap shadow-xs"
              >
                Change Voice
              </button>
            </div>
            <p className="text-xs text-stone-400">Controls speech synthesis across questions, hints, and encouragement.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
              Interface Screen Language
            </label>
            <select
              value={interfaceLanguage}
              onChange={(e) => savePatientSettings({ interface_language: e.target.value })}
              className="w-full p-3.5 rounded-2xl border border-cream-300 text-sm font-semibold text-stone-800 bg-cream-50 focus:border-peach-500 outline-hidden"
            >
              <option value="en">English (On-Screen Text)</option>
              <option value="hi">हिंदी (स्क्रीन टेक्स्ट)</option>
            </select>
            <p className="text-xs text-stone-400">Controls menus, buttons, labels, and card descriptions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-cream-200">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
              Speech Speed / Pace
            </label>
            <select
              value={speechSpeed}
              onChange={(e) => savePatientSettings({ speech_speed: e.target.value })}
              className="w-full p-3.5 rounded-2xl border border-cream-300 text-sm font-semibold text-stone-800 bg-cream-50 focus:border-peach-500 outline-hidden"
            >
              <option value="slow">Slow Pace (0.75x) - Extra Clear</option>
              <option value="normal">Normal Pace (0.9x) - Senior Friendly</option>
              <option value="fast">Fast Pace (1.1x)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
              Auto Read Aloud
            </label>
            <div className="flex items-center justify-between p-3 rounded-2xl border border-cream-300 bg-cream-50">
              <div>
                <span className="text-sm font-semibold text-stone-800 block">Read aloud automatically</span>
                <span className="text-xs text-stone-400">Speaks questions immediately upon opening</span>
              </div>
              <button
                type="button"
                onClick={() => savePatientSettings({ auto_read_aloud: !autoReadAloud })}
                className={`w-13 h-7 rounded-full transition-colors relative flex items-center px-1 ${autoReadAloud ? 'bg-peach-500' : 'bg-stone-300'}`}
              >
                <span className={`w-5 h-5 rounded-full bg-white transition-transform ${autoReadAloud ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
              Voice Enabled
            </label>
            <div className="flex items-center justify-between p-3 rounded-2xl border border-cream-300 bg-cream-50">
              <div>
                <span className="text-sm font-semibold text-stone-800 block">Spoken guidance</span>
                <span className="text-xs text-stone-400">Keeps questions, hints, and reminders visual when off.</span>
              </div>
              <button
                type="button"
                aria-label="Toggle patient spoken guidance"
                aria-pressed={voiceGuidance}
                onClick={() => savePatientSettings({ voice_enabled: !voiceGuidance })}
                className={`w-13 h-7 rounded-full transition-colors relative flex items-center px-1 ${voiceGuidance ? 'bg-peach-500' : 'bg-stone-300'}`}
              >
                <span className={`w-5 h-5 rounded-full bg-white transition-transform ${voiceGuidance ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CAREGIVER ANALYTICS VIEW (Chart.js Interactive)
// ==========================================
function CaregiverAnalyticsView({ analyticsData, skillProfile }) {
  const trendCanvasRef = useRef(null);
  const accuracyCanvasRef = useRef(null);
  const chartInstance1 = useRef(null);
  const chartInstance2 = useRef(null);

  useEffect(() => {
    if (!analyticsData || !window.Chart) return;

    if (chartInstance1.current) chartInstance1.current.destroy();
    if (chartInstance2.current) chartInstance2.current.destroy();

    if (trendCanvasRef.current) {
      const ctx = trendCanvasRef.current.getContext('2d');
      chartInstance1.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: analyticsData.dates,
          datasets: [
            {
              label: 'Recognition Accuracy (%)',
              data: analyticsData.skills_trend.recognition,
              borderColor: '#437C58',
              backgroundColor: 'rgba(67, 124, 88, 0.1)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Memory Accuracy (%)',
              data: analyticsData.skills_trend.memory,
              borderColor: '#8A6FD4',
              backgroundColor: 'rgba(138, 111, 212, 0.1)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Attention Accuracy (%)',
              data: analyticsData.skills_trend.attention,
              borderColor: '#4A92D4',
              backgroundColor: 'rgba(74, 146, 212, 0.1)',
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'top' } },
          scales: { y: { min: 50, max: 100 } }
        }
      });
    }

    if (accuracyCanvasRef.current) {
      const ctx2 = accuracyCanvasRef.current.getContext('2d');
      const domainLabels = Object.keys(analyticsData.domain_accuracies);
      const domainValues = Object.values(analyticsData.domain_accuracies);

      chartInstance2.current = new window.Chart(ctx2, {
        type: 'bar',
        data: {
          labels: domainLabels,
          datasets: [{
            label: 'Accuracy Score (%)',
            data: domainValues,
            backgroundColor: [
              '#437C58', '#E26334', '#5A9B72', '#4A92D4',
              '#F9865B', '#8A6FD4', '#3174B5', '#FEDCCD'
            ],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { min: 40, max: 100 } }
        }
      });
    }

    return () => {
      if (chartInstance1.current) chartInstance1.current.destroy();
      if (chartInstance2.current) chartInstance2.current.destroy();
    };
  }, [analyticsData]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="font-heading font-bold text-2xl text-stone-800">Cognitive Skill Trajectory & Analytics</h2>
        <p className="text-sm text-stone-500">14-day longitudinal trends, response latencies, and cognitive domain metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-cream-200 gentle-shadow">
          <h3 className="font-heading font-bold text-base text-stone-800 mb-4">14-Day Skill Progress Trend (%)</h3>
          <canvas ref={trendCanvasRef} height="200"></canvas>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-cream-200 gentle-shadow">
          <h3 className="font-heading font-bold text-base text-stone-800 mb-4">Accuracy Breakdown by Cognitive Domain</h3>
          <canvas ref={accuracyCanvasRef} height="200"></canvas>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-cream-200 gentle-shadow">
          <span className="text-xs font-semibold text-stone-400 block mb-1">Average Response Latency</span>
          <span className="font-heading font-bold text-3xl text-stone-800">3.5 seconds</span>
          <p className="text-xs text-sage-600 mt-2 font-medium">↓ 1.9s improvement over 14 days</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-cream-200 gentle-shadow">
          <span className="text-xs font-semibold text-stone-400 block mb-1">Hint Dependency Rate</span>
          <span className="font-heading font-bold text-3xl text-stone-800">14%</span>
          <p className="text-xs text-sage-600 mt-2 font-medium">↓ Dropped from 32% baseline</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-cream-200 gentle-shadow">
          <span className="text-xs font-semibold text-stone-400 block mb-1">Weekly Completion Rate</span>
          <span className="font-heading font-bold text-3xl text-stone-800">100%</span>
          <p className="text-xs text-stone-500 mt-2 font-medium">5 of 5 daily sessions completed</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CAREGIVER FAMILY & PHOTO MANAGER
// ==========================================
function CaregiverFamilyManager({ familyMembers, setFamilyMembers, soundEffects }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [nickname, setNickname] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      const res = await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          relationship: relationship || "Relative",
          nickname,
          familiarity_notes: notes,
          photo
        })
      });
      const json = await res.json();
      if (json.success) {
        setFamilyMembers([...familyMembers, json.member]);
        setShowAddModal(false);
        setName("");
        setRelationship("");
        setNickname("");
        setNotes("");
        if (soundEffects) sounds.playChime('success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this family member?")) return;
    try {
      await fetch(`/api/family/${id}`, { method: 'DELETE' });
      setFamilyMembers(familyMembers.filter(m => m.id !== id));
      if (soundEffects) sounds.playChime('tap');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-stone-800">Family & Familiar Photo Management</h2>
          <p className="text-sm text-stone-500">Photos uploaded here directly populate the patient's daily "Familiar Faces" recognition game.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm shadow-xs transition flex items-center gap-2"
        >
          <span>+</span>
          <span>Add Family Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((fam) => (
          <div key={fam.id} className="bg-white rounded-3xl p-5 border border-cream-200 gentle-shadow flex flex-col justify-between">
            <div>
              <div className="relative mb-3">
                <img 
                  src={fam.photo} 
                  alt={fam.name}
                  className="w-full h-48 rounded-2xl object-cover"
                />
                <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-stone-700">
                  {fam.relationship}
                </span>
              </div>

              <h3 className="font-heading font-bold text-stone-800 text-lg">{fam.name}</h3>
              {fam.nickname && <p className="text-xs text-stone-400">"{fam.nickname}"</p>}
              <p className="text-xs text-stone-600 mt-2">{fam.familiarity_notes}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between">
              <span className="text-xs text-stone-400">Recognized {fam.times_recognized}x</span>
              <button
                onClick={() => handleDelete(fam.id)}
                className="text-xs text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-cream-200 gentle-shadow space-y-4">
            <h3 className="font-heading font-bold text-xl text-stone-800">Add Beloved Family Member</h3>
            
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-sage-500 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Relationship</label>
                <input
                  type="text"
                  required
                  value={relationship}
                  onChange={e => setRelationship(e.target.value)}
                  placeholder="e.g. Grandson"
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-sage-500 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Optional Nickname</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="e.g. Chintu"
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-sage-500 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Photo URL</label>
                <input
                  type="text"
                  value={photo}
                  onChange={e => setPhoto(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-sage-500 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Familiar Memory Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Visits on Sundays, loves talking about old railways."
                  rows="2"
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-sage-500 outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-stone-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm transition"
                >
                  Save to Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// CAREGIVER ROUTINE MANAGER
// ==========================================
function CaregiverRoutineManager({ routines, onDataRefresh, soundEffects }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-heading font-bold text-2xl text-stone-800">Daily Routine Timeline Builder</h2>
        <p className="text-sm text-stone-500">Configure everyday sequence habits that feed into the patient's "Daily Routine Puzzle".</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {routines.map((rt) => (
          <div key={rt.id} className="bg-white rounded-3xl p-6 border border-cream-200 gentle-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="font-heading font-bold text-stone-800 text-lg">{rt.category}</h3>
              <span className="text-xs text-stone-400">{rt.period}</span>
            </div>

            <div className="space-y-2.5">
              {rt.steps.map((step, idx) => (
                <div key={step.id} className="p-3 rounded-xl bg-cream-50 border border-cream-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-white text-stone-700 text-xs font-bold flex items-center justify-center border border-cream-200">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-stone-800">{step.title}</span>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{step.time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// CAREGIVER REMINDER MANAGER
// ==========================================
function CaregiverReminderManager({ reminders, setReminders, soundEffects }) {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("09:00 AM");
  const [type, setType] = useState("medication");
  const [badge, setBadge] = useState("Medication");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: desc,
          time,
          type,
          badge
        })
      });
      const json = await res.json();
      if (json.success) {
        setReminders([...reminders, json.reminder]);
        setShowAdd(false);
        setTitle("");
        setDesc("");
        if (soundEffects) sounds.playChime('success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
      setReminders(reminders.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-stone-800">Caregiver Reminder Management</h2>
          <p className="text-sm text-stone-500">Configure independent timely alerts for medicine, nutrition, and calls.</p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-5 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm shadow-xs transition"
        >
          + Add Reminder
        </button>
      </div>

      <div className="space-y-3">
        {reminders.map((rem) => (
          <div key={rem.id} className="bg-white p-5 rounded-2xl border border-cream-200 gentle-shadow flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cream-100 text-stone-700">{rem.badge}</span>
                <span className="text-xs text-stone-400 font-medium">{rem.time}</span>
              </div>
              <h4 className="font-bold text-stone-800 text-base">{rem.title}</h4>
              <p className="text-xs text-stone-500">{rem.description}</p>
            </div>

            <button
              onClick={() => handleDelete(rem.id)}
              className="text-xs text-red-500 hover:text-red-700 font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-cream-200 gentle-shadow space-y-4">
            <h3 className="font-heading font-bold text-xl text-stone-800">Create Reminder</h3>
            
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Afternoon Multivitamin"
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-sage-500 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Instructions / Description</label>
                <input
                  type="text"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="e.g. 1 capsule with fresh water after lunch"
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-sage-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    placeholder="e.g. 01:30 PM"
                    className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-sage-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={type}
                    onChange={e => {
                      setType(e.target.value);
                      setBadge(e.target.value.toUpperCase());
                    }}
                    className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:border-sage-500 outline-hidden"
                  >
                    <option value="medication">Medication</option>
                    <option value="meal">Meal / Nutrition</option>
                    <option value="cognitive">Cognitive Session</option>
                    <option value="family">Family Time</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-stone-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm transition"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// CAREGIVER CULTURAL PREFERENCES MANAGER
// ==========================================
function CaregiverCultureManager({ culturalPref, onDataRefresh, soundEffects }) {
  const [region, setRegion] = useState(culturalPref.region || "Delhi / Haryana");

  const handleSave = async () => {
    try {
      await fetch('/api/culture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region })
      });
      onDataRefresh();
      if (soundEffects) sounds.playChime('success');
      alert("Cultural preferences updated successfully!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 border border-cream-200 gentle-shadow space-y-6">
        <div>
          <h2 className="font-heading font-bold text-2xl text-stone-800">Cultural Personalization Engine</h2>
          <p className="text-sm text-stone-500">Fine-tune regional traditions, nostalgic foods, and festive memories.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Regional Anchor</label>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-stone-200 text-base focus:border-sage-500 outline-hidden"
            >
              <option value="Delhi / Haryana">Delhi / Haryana</option>
              <option value="Punjab">Punjab</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2 text-xs text-stone-600">
            <h4 className="font-bold text-stone-800 text-sm">Active Cultural Associations:</h4>
            <p><strong>Festivals:</strong> {culturalPref.favorite_festivals?.join(', ')}</p>
            <p><strong>Comfort Foods:</strong> {culturalPref.favorite_foods?.join(', ')}</p>
            <p><strong>Traditional Elements:</strong> {culturalPref.traditional_objects?.join(', ')}</p>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm transition"
          >
            Save Cultural Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CAREGIVER ALERTS VIEW
// ==========================================
function CaregiverAlertsView({ alerts }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-heading font-bold text-2xl text-stone-800">Caregiver Alerts & Clinical Observations</h2>
        <p className="text-sm text-stone-500">Non-alarmist, supportive patterns identified by the cognitive performance engine.</p>
      </div>

      <div className="space-y-4">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className={`p-6 rounded-3xl border ${alt.severity === 'success' ? 'bg-sage-50 border-sage-200' : (alt.severity === 'gentle_care' ? 'bg-amber-50 border-amber-200' : 'bg-white border-cream-200')}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {alt.severity.replace('_', ' ')}
              </span>
              <span className="text-xs text-stone-400">{alt.timestamp}</span>
            </div>

            <h3 className="font-heading font-bold text-stone-800 text-lg">{alt.title}</h3>
            <p className="text-sm text-stone-600 mt-1 leading-relaxed">{alt.message}</p>

            <div className="mt-4 pt-3 border-t border-stone-200/50 flex items-center gap-2 text-xs font-medium text-stone-500">
              <span className="font-bold text-stone-700">Recommended Action:</span>
              <span>{alt.action_taken}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Render into DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CogniCareApp />);
