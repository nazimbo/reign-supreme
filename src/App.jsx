import { useState, useEffect } from 'react';
import { Trophy, ChevronUp, ChevronDown, XCircle, RotateCcw, CheckCircle, Medal } from 'lucide-react';
import initialLeadersData from './leaders.json';
import { translations } from './i18n';
import { supabase } from './supabase';

const gradients = [
  "from-blue-600 to-indigo-900",
  "from-emerald-600 to-teal-900",
  "from-orange-500 to-red-900",
  "from-pink-600 to-rose-900",
  "from-purple-600 to-violet-900",
  "from-cyan-600 to-blue-900",
  "from-amber-500 to-orange-900",
  "from-slate-700 to-black"
];

const AnimatedNumber = ({ value, duration = 1000, onComplete }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * value));
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(value);
        if (onComplete) onComplete();
      }
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
};

export default function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('rs_lang') || 'en');
  const [showFunFacts, setShowFunFacts] = useState(
    () => localStorage.getItem('rs_funfacts') !== 'false'
  );

  const toggleFunFacts = () => {
    setShowFunFacts(prev => {
      const next = !prev;
      localStorage.setItem('rs_funfacts', String(next));
      return next;
    });
  };
  const t = translations[language];

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('rs_highscore')) || 0);
  const [leftLeader, setLeftLeader] = useState(null);
  const [rightLeader, setRightLeader] = useState(null);
  const [playedIds, setPlayedIds] = useState([]);
  // 'menu' | 'playing' | 'revealing' | 'correct' | 'gameover' | 'leaderboard'
  const [gameState, setGameState] = useState('menu');
  const [flashColor, setFlashColor] = useState(null);
  const [photoErrors, setPhotoErrors] = useState({});

  // Leaderboard state
  const [nameInput, setNameInput] = useState(() => localStorage.getItem('rs_name') || '');
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'submitting' | 'submitted'
  const [topScores, setTopScores] = useState([]);
  const [scoresLoading, setScoresLoading] = useState(false);

  const fetchTopScores = async () => {
    setScoresLoading(true);
    const { data } = await supabase
      .from('scores')
      .select('name, score')
      .order('score', { ascending: false })
      .limit(10);
    setTopScores(data || []);
    setScoresLoading(false);
  };

  const handleSubmitScore = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed || submitStatus !== 'idle') return;
    setSubmitStatus('submitting');
    const { error } = await supabase.rpc('submit_score', { p_name: trimmed, p_score: score });
    if (!error) {
      localStorage.setItem('rs_name', trimmed);
      setSubmitStatus('submitted');
      if (gameState === 'leaderboard') fetchTopScores();
    } else {
      setSubmitStatus('idle');
    }
  };

  const openLeaderboard = () => {
    fetchTopScores();
    setGameState('leaderboard');
  };

  const getUniqueRandomLeader = (currentPlayedIds, excludeId = null) => {
    let available = initialLeadersData.filter(l => !currentPlayedIds.includes(l.id) && l.id !== excludeId);
    if (available.length === 0) {
      available = initialLeadersData.filter(l => l.id !== excludeId);
      setPlayedIds(excludeId ? [excludeId] : []);
    }
    const leader = available[Math.floor(Math.random() * available.length)];
    const bgGradient = gradients[Math.floor(Math.random() * gradients.length)];
    return { ...leader, bgGradient };
  };

  const initGame = () => {
    const first = getUniqueRandomLeader([]);
    const second = getUniqueRandomLeader([first.id], first.id);
    setLeftLeader(first);
    setRightLeader(second);
    setPlayedIds([first.id, second.id]);
    setScore(0);
    setGameState('playing');
    setFlashColor(null);
    setSubmitStatus('idle');
  };

  const advanceRound = () => {
    const newRightLeader = getUniqueRandomLeader(playedIds, rightLeader.id);
    setPlayedIds(prev => [...prev, newRightLeader.id]);
    setLeftLeader(rightLeader);
    setRightLeader(newRightLeader);
    setGameState('playing');
    setFlashColor(null);
  };

  const handleGuess = (guess) => {
    if (gameState !== 'playing') return;
    setGameState('revealing');

    const isHigher = rightLeader.years >= leftLeader.years;
    const isLower = rightLeader.years <= leftLeader.years;
    let correct = (guess === 'higher' && isHigher) || (guess === 'lower' && isLower);

    setTimeout(() => {
      if (correct) {
        setGameState('correct');
        setFlashColor('bg-green-500/30');
        setScore(s => s + 1);
        if (!showFunFacts || !rightLeader.factEn) {
          setTimeout(() => advanceRound(), 1200);
        }
        // When showFunFacts is on and there's a fact, wait for handleContinue
      } else {
        setGameState('gameover');
        setFlashColor('bg-red-500/40');
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('rs_highscore', score);
        }
      }
    }, 1200);
  };

  const LangButtons = ({ size = 'sm' }) => (
    <>
      {['en', 'fr'].map(lang => (
        <button
          key={lang}
          onClick={() => { setLanguage(lang); localStorage.setItem('rs_lang', lang); }}
          className={`uppercase font-black tracking-wider transition-all duration-200 rounded-lg
            ${size === 'lg' ? 'px-3.5 py-2 text-sm' : 'px-2.5 py-1 text-[10px] md:text-xs'}
            ${language === lang ? 'bg-white text-black shadow-sm' : 'text-white/40 hover:text-white/70'}
          `}
        >
          {lang}
        </button>
      ))}
    </>
  );

  const hasLeftPhoto = !!(leftLeader && leftLeader.photo && !photoErrors[leftLeader.id]);
  const hasRightPhoto = !!(rightLeader && rightLeader.photo && !photoErrors[rightLeader.id]);

  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row relative font-sans overflow-hidden bg-black text-white selection:bg-transparent">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
        }
        .vs-badge { animation: pulse-soft 3s infinite ease-in-out; }
        .glass-panel { background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
        @keyframes fact-reveal {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fact-reveal { animation: fact-reveal 0.4s ease-out forwards; }
      `}} />

      {/* ===== START MENU ===== */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8">
          {/* Decorative split background */}
          <div className="absolute inset-0 flex pointer-events-none overflow-hidden">
            <div className="flex-1 bg-gradient-to-br from-blue-900/50 to-indigo-950"></div>
            <div className="flex-1 bg-gradient-to-br from-purple-900/50 to-rose-950"></div>
          </div>
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm"></div>

          {/* Language toggle */}
          <div className="absolute top-4 right-4 md:top-5 md:right-5 z-10 flex gap-1 glass-panel rounded-xl p-1">
            <LangButtons size="lg" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
            <Trophy className="w-14 h-14 md:w-20 md:h-20 text-yellow-400 mb-5 drop-shadow-[0_0_25px_rgba(250,204,21,0.7)]" />

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-3 drop-shadow-2xl">
              Reign<br />Supreme
            </h1>

            <p className="text-lg md:text-2xl text-yellow-400 font-semibold mb-8 drop-shadow-md">
              {t.menuSubtitle}
            </p>

            <div className="glass-panel rounded-2xl px-6 py-5 mb-8 w-full">
              <p className="text-slate-300 text-sm md:text-base leading-relaxed md:hidden">
                {t.menuHowToMobile}
              </p>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed hidden md:block">
                {t.menuHowTo}
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                <span className="text-slate-300 text-sm font-medium">{t.showFunFacts}</span>
                <button
                  onClick={toggleFunFacts}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${showFunFacts ? 'bg-yellow-400' : 'bg-white/20'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${showFunFacts ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <button
              onClick={initGame}
              className="w-full max-w-xs py-4 md:py-5 bg-white text-black rounded-2xl font-black text-xl md:text-2xl uppercase tracking-wider hover:bg-yellow-400 transition-all duration-300 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(250,204,21,0.5)] mb-3"
            >
              {t.play}
            </button>

            <button
              onClick={openLeaderboard}
              className="w-full max-w-xs py-3 glass-panel text-white/70 rounded-2xl font-bold text-base uppercase tracking-wider hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              <Medal className="w-5 h-5 text-yellow-400" />
              {t.leaderboard}
            </button>
          </div>
        </div>
      )}

      {/* ===== LEADERBOARD ===== */}
      {gameState === 'leaderboard' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black"></div>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
            <Trophy className="w-12 h-12 text-yellow-400 mb-3 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider mb-6">{t.leaderboard}</h2>

            {score > 0 && submitStatus !== 'submitted' && (
              <div className="glass-panel w-full rounded-2xl p-4 mb-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{t.yourScore}</span>
                  <span className="text-2xl font-black text-white">{score}</span>
                </div>
                {submitStatus === 'idle' && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={20}
                        placeholder={t.enterName}
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSubmitScore()}
                        className={`flex-1 bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm font-medium focus:outline-none focus:border-white/50 transition-colors ${nameInput.length > 0 && !nameInput.trim() ? 'border-red-500/60' : 'border-white/20'}`}
                      />
                      <button
                        onClick={handleSubmitScore}
                        disabled={!nameInput.trim()}
                        className="px-5 py-3 bg-yellow-400 text-black rounded-xl font-black text-sm uppercase tracking-wider hover:bg-yellow-300 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {t.submitScore}
                      </button>
                    </div>
                    {nameInput.length > 0 && (
                      <p className="text-right text-xs text-white/30">{nameInput.length}/20</p>
                    )}
                  </div>
                )}
                {submitStatus === 'submitting' && (
                  <div className="text-center text-slate-400 text-sm py-1">{t.submitting}</div>
                )}
              </div>
            )}

            <div className="glass-panel rounded-2xl w-full overflow-hidden mb-6">
              {/* Table header */}
              <div className="flex items-center px-4 py-2.5 border-b border-white/10 text-xs text-slate-400 uppercase tracking-widest font-bold">
                <span className="w-8 text-center">{t.rank}</span>
                <span className="flex-1 text-left ml-3">{t.player}</span>
                <span className="w-16 text-right">{t.score}</span>
              </div>

              {scoresLoading ? (
                <div className="py-10 text-slate-400 text-sm">{t.submitting}</div>
              ) : topScores.length === 0 ? (
                <div className="py-10 text-slate-400 text-sm">{t.noScores}</div>
              ) : (
                topScores.map((entry, i) => (
                  <div
                    key={i}
                    className={`flex items-center px-4 py-3 border-b border-white/5 last:border-0 ${i === 0 ? 'bg-yellow-400/10' : ''}`}
                  >
                    <span className={`w-8 text-center font-black text-base ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-500'}`}>
                      {i + 1}
                    </span>
                    <span className="flex-1 text-left ml-3 font-semibold truncate capitalize">{entry.name}</span>
                    <span className="w-16 text-right font-black text-lg text-white">{entry.score}</span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setGameState('menu')}
              className="w-full max-w-xs py-3.5 glass-panel text-white/70 rounded-2xl font-bold text-base uppercase tracking-wider hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-95"
            >
              {t.backToMenu}
            </button>
          </div>
        </div>
      )}

      {/* ===== GAME ===== */}
      {gameState !== 'menu' && gameState !== 'leaderboard' && leftLeader && rightLeader && (
        <>
          {/* Score bar — single centered pill */}
          <div className="absolute top-0 left-0 right-0 z-30 flex justify-center p-3 md:p-4 pointer-events-none">
            <div className="glass-panel rounded-2xl px-4 md:px-5 py-2 md:py-2.5 flex items-center gap-3 md:gap-4 shadow-xl">

              {/* Score */}
              <div className="flex flex-col items-center w-9 md:w-12">
                <span className="text-[9px] md:text-[10px] text-slate-400 font-bold tracking-widest uppercase leading-none mb-0.5">{t.score}</span>
                <span className="text-xl md:text-2xl font-black tabular-nums leading-none">{score}</span>
              </div>

              <div className="h-7 w-px bg-white/20 shrink-0" />

              {/* Lang toggle */}
              <div className="flex gap-0.5 pointer-events-auto">
                <LangButtons size="sm" />
              </div>

              <div className="h-7 w-px bg-white/20 shrink-0" />

              {/* High score */}
              <div className="flex flex-col items-center w-9 md:w-12">
                <span className="text-[9px] md:text-[10px] text-yellow-400 font-bold tracking-widest uppercase leading-none mb-0.5 flex items-center gap-0.5">
                  <Trophy size={7} className="shrink-0" />{t.highScoreShort}
                </span>
                <span className="text-xl md:text-2xl font-black text-yellow-400 tabular-nums leading-none">{highScore}</span>
              </div>

            </div>
          </div>

          {/* Flash overlay */}
          <div className={`absolute inset-0 z-20 pointer-events-none transition-colors duration-500 ${flashColor || 'bg-transparent'}`}></div>

          {/* Left / Top panel */}
          <div
            className="relative flex-1 flex flex-col justify-center items-center p-4 pt-[72px] md:p-12 transition-all duration-700 h-[50dvh] md:h-full"
            style={hasLeftPhoto ? {
              backgroundImage: `url(${leftLeader.photo})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            } : undefined}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${leftLeader.bgGradient} transition-opacity duration-700 ${hasLeftPhoto ? 'opacity-40' : 'opacity-100'}`}></div>
            {leftLeader.photo && (
              <img src={leftLeader.photo} alt="" className="hidden"
                onError={() => setPhotoErrors(prev => ({ ...prev, [leftLeader.id]: true }))} />
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 overflow-hidden pointer-events-none">
              <span className="text-[15rem] md:text-[30rem] font-black">{leftLeader.years}</span>
            </div>
            <div className={`absolute inset-0 ${hasLeftPhoto ? 'bg-black/55' : 'bg-black/20'}`}></div>

            <div className="z-10 flex flex-col items-center text-center w-full max-w-xl">
              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-1 md:mb-2 drop-shadow-2xl leading-tight line-clamp-2 px-2">{leftLeader.name}</h2>
              <p className="text-sm sm:text-base md:text-2xl text-white/80 font-semibold tracking-widest uppercase mb-4 md:mb-10 drop-shadow-md">{leftLeader.country}</p>

              <div className="flex flex-col items-center glass-panel px-6 py-4 md:px-8 md:py-6 rounded-2xl md:rounded-3xl w-auto min-w-[200px] md:min-w-[300px]">
                <p className="text-xs md:text-lg text-slate-300 uppercase tracking-wider font-medium mb-0 md:mb-1">{t.ruledFor}</p>
                <div className="text-5xl md:text-8xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                  {leftLeader.years}
                </div>
                <p className="text-base md:text-2xl text-slate-300 font-light mt-0 md:mt-1">{t.years}</p>
              </div>
            </div>
          </div>

          {/* VS badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
            <div className="vs-badge bg-white text-black w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-4 border-black/10">
              <span className="font-black text-lg md:text-3xl italic tracking-tighter pr-0.5 md:pr-1">VS</span>
            </div>
          </div>

          {/* Right / Bottom panel */}
          <div
            className="relative flex-1 flex flex-col justify-center items-center p-4 pb-10 md:p-12 transition-all duration-700 h-[50dvh] md:h-full"
            style={hasRightPhoto ? {
              backgroundImage: `url(${rightLeader.photo})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            } : undefined}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${rightLeader.bgGradient} transition-opacity duration-700 ${hasRightPhoto ? 'opacity-40' : 'opacity-100'}`}></div>
            {rightLeader.photo && (
              <img src={rightLeader.photo} alt="" className="hidden"
                onError={() => setPhotoErrors(prev => ({ ...prev, [rightLeader.id]: true }))} />
            )}
            <div className={`absolute inset-0 ${hasRightPhoto ? 'bg-black/55' : 'bg-black/30'}`}></div>

            <div className="z-10 flex flex-col items-center text-center w-full max-w-xl mt-4 md:mt-0">
              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-1 md:mb-2 drop-shadow-2xl leading-tight line-clamp-2 px-2">{rightLeader.name}</h2>
              <p className={`text-sm sm:text-base md:text-2xl text-white/80 font-semibold tracking-widest uppercase drop-shadow-md ${gameState === 'correct' && showFunFacts && rightLeader.factEn ? 'mb-2 md:mb-8' : 'mb-4 md:mb-8'}`}>{rightLeader.country}</p>

              <p className={`text-xs md:text-lg text-slate-200 uppercase tracking-wider font-medium ${gameState === 'correct' && showFunFacts && rightLeader.factEn ? 'mb-2 md:mb-4' : 'mb-3 md:mb-4'}`}>{t.ruled}</p>

              <div className={`w-full md:h-64 flex flex-col items-center justify-center ${gameState === 'playing' ? 'h-32' : 'h-auto py-3 md:py-0'}`}>
                {gameState === 'playing' && (
                  <div className="flex flex-row md:flex-col gap-3 md:gap-4 w-full max-w-[90%] md:max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                      onClick={() => handleGuess('higher')}
                      className="flex-1 group relative overflow-hidden glass-panel hover:bg-white/20 text-white font-bold py-3 md:py-5 px-4 rounded-2xl md:rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-2 border-transparent hover:border-white/50"
                    >
                      <ChevronUp className="w-6 h-6 md:w-8 md:h-8 text-green-400 group-hover:-translate-y-1 transition-transform" />
                      <span className="text-lg md:text-2xl uppercase tracking-wider">{t.higher}</span>
                    </button>

                    <button
                      onClick={() => handleGuess('lower')}
                      className="flex-1 group relative overflow-hidden glass-panel hover:bg-white/20 text-white font-bold py-3 md:py-5 px-4 rounded-2xl md:rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-2 border-transparent hover:border-white/50"
                    >
                      <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-red-400 group-hover:translate-y-1 transition-transform" />
                      <span className="text-lg md:text-2xl uppercase tracking-wider">{t.lower}</span>
                    </button>
                  </div>
                )}

                {gameState !== 'playing' && (
                  <div className="flex flex-col items-center w-full">
                    <div className="glass-panel px-6 py-4 md:px-8 md:py-6 rounded-2xl md:rounded-3xl w-auto min-w-[200px] md:min-w-[300px] flex flex-col items-center relative overflow-hidden">
                      {gameState === 'correct' && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-in fade-in zoom-in duration-300 z-0">
                          <CheckCircle size={80} className="text-green-400/30 md:w-[100px] md:h-[100px]" />
                        </div>
                      )}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="text-5xl md:text-8xl font-black text-white drop-shadow-xl">
                          <AnimatedNumber value={rightLeader.years} duration={1000} />
                        </div>
                        <p className="text-base md:text-2xl text-slate-300 font-light mt-0 md:mt-1">{t.years}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {gameState === 'correct' && showFunFacts && rightLeader.factEn && (
                <div className="fact-reveal glass-panel mt-3 md:mt-4 px-4 py-3 md:px-5 md:py-4 rounded-xl max-w-sm w-full">
                  <p className="text-[9px] md:text-xs text-yellow-400 uppercase tracking-widest font-bold mb-1">
                    {t.funFact}
                  </p>
                  <p className="text-xs md:text-sm text-white/90 leading-relaxed text-left">
                    {language === 'fr' ? rightLeader.factFr : rightLeader.factEn}
                  </p>
                </div>
              )}

              {gameState === 'correct' && showFunFacts && rightLeader.factEn && (
                <button
                  onClick={advanceRound}
                  className="fact-reveal mt-3 md:mt-4 group relative overflow-hidden glass-panel hover:bg-white/20 text-white font-bold py-3 md:py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-2 border-transparent hover:border-white/50 max-w-sm w-full"
                >
                  <span className="text-base md:text-lg uppercase tracking-wider">{t.continue}</span>
                  <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-green-400 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <p className="text-xs md:text-lg text-slate-200 uppercase tracking-wider font-medium mt-3 md:mt-4">
                {t.than} {leftLeader.name}
              </p>
            </div>
          </div>

          {/* Game over screen */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div className="bg-slate-900 border border-slate-700 p-6 md:p-10 rounded-[2rem] flex flex-col items-center text-center max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-500 mt-10 md:mt-0 overflow-y-auto max-h-[90dvh]">

                <div className="relative w-16 h-16 md:w-20 md:h-20 mb-4 shrink-0">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping opacity-75"></div>
                  <div className="relative bg-red-500/30 w-full h-full rounded-full flex items-center justify-center border-2 border-red-500/50">
                    <XCircle className="w-10 h-10 md:w-12 md:h-12 text-red-400" />
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 uppercase tracking-wider">{t.gameOver}</h2>

                <p className="text-slate-300 text-sm md:text-base mb-4 leading-relaxed">
                  {language === 'fr'
                    ? <><span className="font-bold text-white">{rightLeader.name}</span> a régné{' '}<span className="font-bold text-yellow-400">{rightLeader.years} ans</span>, contre{' '}<span className="font-bold text-yellow-400">{leftLeader.years} ans</span>{' '}pour{' '}<span className="font-bold text-white">{leftLeader.name}</span>.</>
                    : <><span className="font-bold text-white">{rightLeader.name}</span> ruled for{' '}<span className="font-bold text-yellow-400">{rightLeader.years} years</span>, compared to{' '}<span className="font-bold text-yellow-400">{leftLeader.years} years</span>{' '}for{' '}<span className="font-bold text-white">{leftLeader.name}</span>.</>
                  }
                </p>

                {rightLeader.factEn && (
                  <div className="glass-panel w-full rounded-xl p-3 md:p-4 mb-4 border border-yellow-400/20 fact-reveal">
                    <p className="text-[9px] md:text-xs text-yellow-400 uppercase tracking-widest font-bold mb-1">
                      {t.funFact}
                    </p>
                    <p className="text-xs md:text-sm text-white/80 leading-relaxed text-left">
                      {language === 'fr' ? rightLeader.factFr : rightLeader.factEn}
                    </p>
                  </div>
                )}

                {/* Score display */}
                <div className="glass-panel w-full rounded-2xl p-4 mb-4 flex justify-around relative overflow-hidden bg-black/40">
                  <div className="relative z-10">
                    <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest mb-1 font-bold">{t.yourScore}</p>
                    <p className="text-4xl md:text-5xl font-black text-white">{score}</p>
                  </div>
                  <div className="w-px bg-white/10 relative z-10"></div>
                  <div className="relative z-10">
                    <p className="text-[10px] md:text-xs text-yellow-400/80 uppercase tracking-widest mb-1 font-bold">{t.highScore}</p>
                    <p className="text-4xl md:text-5xl font-black text-yellow-400">{highScore}</p>
                  </div>
                </div>

                {/* Score submission — only when score > 0 */}
                {score > 0 && (
                  <div className="w-full mb-4">
                    {submitStatus === 'idle' && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={20}
                            placeholder={t.enterName}
                            value={nameInput}
                            onChange={e => setNameInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSubmitScore()}
                            className={`flex-1 bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm font-medium focus:outline-none focus:border-white/50 transition-colors ${nameInput.length > 0 && !nameInput.trim() ? 'border-red-500/60' : 'border-white/20'}`}
                          />
                          <button
                            onClick={handleSubmitScore}
                            disabled={!nameInput.trim()}
                            className="px-5 py-3 bg-yellow-400 text-black rounded-xl font-black text-sm uppercase tracking-wider hover:bg-yellow-300 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {t.submitScore}
                          </button>
                        </div>
                        {nameInput.length > 0 && (
                          <p className="text-right text-xs text-white/30">{nameInput.length}/20</p>
                        )}
                      </div>
                    )}
                    {submitStatus === 'submitting' && (
                      <div className="text-center text-slate-400 text-sm py-2">{t.submitting}</div>
                    )}
                    {submitStatus === 'submitted' && (
                      <div className="text-center text-green-400 font-bold text-sm py-2">{t.submitted}</div>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={initGame}
                    className="group flex-1 py-3.5 bg-white text-black rounded-2xl font-black text-base uppercase tracking-wider hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
                    {t.playAgain}
                  </button>

                  <button
                    onClick={openLeaderboard}
                    className="flex-1 py-3.5 glass-panel text-white/70 rounded-2xl font-bold text-base uppercase tracking-wider hover:text-white hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Medal className="w-5 h-5 text-yellow-400" />
                    {t.leaderboard}
                  </button>
                </div>

              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
