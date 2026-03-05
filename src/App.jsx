import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ChevronUp, ChevronDown, XCircle, RotateCcw, CheckCircle } from 'lucide-react';

// Expanded database (+70 personalities) translated to English
const initialLeadersData = [
  { id: 1, name: "Fidel Castro", country: "Cuba", years: 49 },
  { id: 2, name: "Kim Il-sung", country: "North Korea", years: 46 },
  { id: 3, name: "Muammar Gaddafi", country: "Libya", years: 42 },
  { id: 4, name: "Omar Bongo", country: "Gabon", years: 41 },
  { id: 5, name: "Enver Hoxha", country: "Albania", years: 40 },
  { id: 6, name: "Robert Mugabe", country: "Zimbabwe", years: 37 },
  { id: 7, name: "Francisco Franco", country: "Spain", years: 36 },
  { id: 8, name: "Josip Broz Tito", country: "Yugoslavia", years: 35 },
  { id: 9, name: "Mobutu Sese Seko", country: "Zaire", years: 32 },
  { id: 10, name: "Suharto", country: "Indonesia", years: 31 },
  { id: 11, name: "Mao Zedong", country: "China", years: 27 },
  { id: 12, name: "Joseph Stalin", country: "USSR", years: 29 },
  { id: 13, name: "Saddam Hussein", country: "Iraq", years: 24 },
  { id: 14, name: "Nicolae Ceaușescu", country: "Romania", years: 24 },
  { id: 15, name: "Augusto Pinochet", country: "Chile", years: 17 },
  { id: 16, name: "Adolf Hitler", country: "Germany", years: 12 },
  { id: 17, name: "Benito Mussolini", country: "Italy", years: 21 },
  { id: 18, name: "Idi Amin", country: "Uganda", years: 8 },
  { id: 19, name: "Pol Pot", country: "Cambodia", years: 4 },
  { id: 20, name: "Charles de Gaulle", country: "France", years: 10 },
  { id: 21, name: "Franklin D. Roosevelt", country: "United States", years: 12 },
  { id: 22, name: "Vladimir Putin", country: "Russia", years: 24 },
  { id: 23, name: "Paul Biya", country: "Cameroon", years: 41 },
  { id: 24, name: "Teodoro Obiang", country: "Equatorial Guinea", years: 44 },
  { id: 25, name: "Ali Khamenei", country: "Iran", years: 34 },
  { id: 26, name: "François Mitterrand", country: "France", years: 14 },
  { id: 27, name: "Jacques Chirac", country: "France", years: 12 },
  { id: 28, name: "Nelson Mandela", country: "South Africa", years: 5 },
  { id: 29, name: "Winston Churchill", country: "United Kingdom", years: 9 },
  { id: 30, name: "Hugo Chávez", country: "Venezuela", years: 14 },
  { id: 31, name: "Lee Kuan Yew", country: "Singapore", years: 31 },
  { id: 32, name: "Mahathir Mohamad", country: "Malaysia", years: 24 },
  { id: 33, name: "Elizabeth II", country: "United Kingdom", years: 70 },
  { id: 34, name: "Louis XIV", country: "France", years: 72 },
  { id: 35, name: "Queen Victoria", country: "United Kingdom", years: 63 },
  { id: 36, name: "Emperor Hirohito", country: "Japan", years: 62 },
  { id: 37, name: "Angela Merkel", country: "Germany", years: 16 },
  { id: 38, name: "Franz Joseph I", country: "Austria", years: 68 },
  { id: 39, name: "Ramesses II", country: "Ancient Egypt", years: 66 },
  { id: 40, name: "John Paul II", country: "Vatican City", years: 26 },
  { id: 41, name: "Emperor Augustus", country: "Roman Empire", years: 40 },
  { id: 42, name: "Bhumibol Adulyadej", country: "Thailand", years: 70 },
  { id: 43, name: "Hassan II", country: "Morocco", years: 38 },
  { id: 44, name: "King Hussein", country: "Jordan", years: 46 },
  { id: 45, name: "F. Houphouët-Boigny", country: "Ivory Coast", years: 33 },
  { id: 46, name: "Haile Selassie I", country: "Ethiopia", years: 44 },
  { id: 47, name: "Catherine the Great", country: "Russia", years: 34 },
  { id: 48, name: "Peter the Great", country: "Russia", years: 42 },
  { id: 49, name: "Kim Jong-il", country: "North Korea", years: 17 },
  { id: 50, name: "Kim Jong-un", country: "North Korea", years: 12 },
  { id: 51, name: "Alexander the Great", country: "Macedonia", years: 13 },
  { id: 52, name: "Julius Caesar", country: "Ancient Rome", years: 5 },
  { id: 53, name: "Napoleon I", country: "France", years: 10 },
  { id: 54, name: "Gamal Abdel Nasser", country: "Egypt", years: 14 },
  { id: 55, name: "Hosni Mubarak", country: "Egypt", years: 30 },
  { id: 56, name: "Bashar al-Assad", country: "Syria", years: 24 },
  { id: 57, name: "Hafez al-Assad", country: "Syria", years: 29 },
  { id: 58, name: "Ferdinand Marcos", country: "Philippines", years: 21 },
  { id: 59, name: "Sukarno", country: "Indonesia", years: 22 },
  { id: 60, name: "N. Nazarbayev", country: "Kazakhstan", years: 29 },
  { id: 61, name: "A. Lukashenko", country: "Belarus", years: 30 },
  { id: 62, name: "Recep T. Erdogan", country: "Turkey", years: 21 },
  { id: 63, name: "Margaret Thatcher", country: "United Kingdom", years: 11 },
  { id: 64, name: "Tony Blair", country: "United Kingdom", years: 10 },
  { id: 65, name: "Justin Trudeau", country: "Canada", years: 9 },
  { id: 66, name: "Evo Morales", country: "Bolivia", years: 13 },
  { id: 67, name: "Abraham Lincoln", country: "United States", years: 4 },
  { id: 68, name: "George Washington", country: "United States", years: 8 },
  { id: 69, name: "Emmanuel Macron", country: "France", years: 7 },
  { id: 70, name: "Shinzo Abe", country: "Japan", years: 9 },
  { id: 71, name: "Suleiman the Magnificent", country: "Ottoman Empire", years: 46 }
];

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

// Robust Counter Animation Component
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
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const [leftLeader, setLeftLeader] = useState(null);
  const [rightLeader, setRightLeader] = useState(null);

  // Handing random pick without repetition
  const [playedIds, setPlayedIds] = useState([]);

  // 'playing' | 'revealing' | 'correct' | 'gameover'
  const [gameState, setGameState] = useState('playing');
  const [flashColor, setFlashColor] = useState(null);

  // Get a unique random leader
  const getUniqueRandomLeader = (currentPlayedIds, excludeId = null) => {
    let available = initialLeadersData.filter(l => !currentPlayedIds.includes(l.id) && l.id !== excludeId);

    // Reset deck if everyone has been seen
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
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleGuess = (guess) => {
    if (gameState !== 'playing') return;

    setGameState('revealing');

    const isHigher = rightLeader.years >= leftLeader.years;
    const isLower = rightLeader.years <= leftLeader.years;

    let correct = false;
    if (guess === 'higher' && isHigher) correct = true;
    if (guess === 'lower' && isLower) correct = true;

    setTimeout(() => {
      if (correct) {
        setGameState('correct');
        setFlashColor('bg-green-500/30');
        setScore(s => s + 1);

        setTimeout(() => {
          const newRightLeader = getUniqueRandomLeader(playedIds, rightLeader.id);
          setPlayedIds(prev => [...prev, newRightLeader.id]);

          setLeftLeader(rightLeader);
          setRightLeader(newRightLeader);
          setGameState('playing');
          setFlashColor(null);
        }, 1200);

      } else {
        setGameState('gameover');
        setFlashColor('bg-red-500/40');
        if (score > highScore) setHighScore(score);
      }
    }, 1200);
  };

  if (!leftLeader || !rightLeader) return <div className="bg-slate-900 h-screen w-full flex items-center justify-center text-white font-bold animate-pulse">Loading...</div>;

  return (
    // h-[100dvh] ensures perfect fit on mobile ignoring the address bar
    <div className="h-[100dvh] w-full flex flex-col md:flex-row relative font-sans overflow-hidden bg-black text-white selection:bg-transparent">

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-soft {
          0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
          50% { transform: translate(-50%, -50%) scale(1.05); box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
        }
        .vs-badge { animation: pulse-soft 3s infinite ease-in-out; }
        .glass-panel { background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
      `}} />

      {/* --- SCORE HEADER --- */}
      <div className="absolute top-0 w-full p-3 md:p-6 flex justify-between items-start z-30 pointer-events-none">
        <div className="glass-panel px-3 py-1.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl flex flex-col items-center shadow-xl">
          <span className="text-[10px] md:text-sm text-slate-300 font-bold tracking-widest uppercase opacity-80">Score</span>
          <span className="text-xl md:text-4xl font-black leading-none">{score}</span>
        </div>
        <div className="glass-panel px-3 py-1.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl flex flex-col items-center shadow-xl">
          <span className="text-[10px] md:text-sm text-yellow-400 font-bold tracking-widest uppercase flex items-center gap-1 opacity-90">
            <Trophy size={12} className="md:w-4 md:h-4" /> High Score
          </span>
          <span className="text-xl md:text-4xl font-black text-yellow-400 leading-none">{highScore}</span>
        </div>
      </div>

      {/* --- FLASH OVERLAY --- */}
      <div className={`absolute inset-0 z-20 pointer-events-none transition-colors duration-500 ${flashColor || 'bg-transparent'}`}></div>

      {/* --- LEFT / TOP PANEL (The Champion) --- */}
      <div className={`relative flex-1 flex flex-col justify-center items-center p-4 pt-16 md:p-12 transition-all duration-700 bg-gradient-to-br ${leftLeader.bgGradient} h-[50dvh] md:h-full`}>
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 overflow-hidden pointer-events-none">
          <span className="text-[15rem] md:text-[30rem] font-black">{leftLeader.years}</span>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="z-10 flex flex-col items-center text-center w-full max-w-xl">
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-1 md:mb-2 drop-shadow-2xl leading-tight line-clamp-2 px-2">{leftLeader.name}</h2>
          <p className="text-sm sm:text-base md:text-2xl text-white/80 font-semibold tracking-widest uppercase mb-4 md:mb-10 drop-shadow-md">{leftLeader.country}</p>

          <div className="flex flex-col items-center glass-panel px-6 py-4 md:px-8 md:py-6 rounded-2xl md:rounded-3xl w-auto min-w-[200px] md:min-w-[300px]">
            <p className="text-xs md:text-lg text-slate-300 uppercase tracking-wider font-medium mb-0 md:mb-1">Ruled for</p>
            <div className="text-5xl md:text-8xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
              {leftLeader.years}
            </div>
            <p className="text-base md:text-2xl text-slate-300 font-light mt-0 md:mt-1">years</p>
          </div>
        </div>
      </div>

      {/* --- CENTRAL "VS" BADGE --- */}
      <div className="absolute top-1/2 left-1/2 vs-badge z-40 bg-white text-black w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-4 border-black/10">
        <span className="font-black text-lg md:text-3xl italic tracking-tighter pr-0.5 md:pr-1">VS</span>
      </div>

      {/* --- RIGHT / BOTTOM PANEL (The Challenger) --- */}
      <div className={`relative flex-1 flex flex-col justify-center items-center p-4 pb-10 md:p-12 transition-all duration-700 bg-gradient-to-br ${rightLeader.bgGradient} h-[50dvh] md:h-full`}>
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="z-10 flex flex-col items-center text-center w-full max-w-xl mt-4 md:mt-0">
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-1 md:mb-2 drop-shadow-2xl leading-tight line-clamp-2 px-2">{rightLeader.name}</h2>
          <p className="text-sm sm:text-base md:text-2xl text-white/80 font-semibold tracking-widest uppercase mb-4 md:mb-8 drop-shadow-md">{rightLeader.country}</p>

          <p className="text-xs md:text-lg text-slate-200 uppercase tracking-wider font-medium mb-3 md:mb-4">ruled</p>

          <div className="w-full h-32 md:h-64 flex flex-col items-center justify-center">

            {/* STATE 1: HIGHER / LOWER BUTTONS */}
            {gameState === 'playing' && (
              // Row on mobile, Column on PC
              <div className="flex flex-row md:flex-col gap-3 md:gap-4 w-full max-w-[90%] md:max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button
                  onClick={() => handleGuess('higher')}
                  className="flex-1 group relative overflow-hidden glass-panel hover:bg-white/20 text-white font-bold py-3 md:py-5 px-4 rounded-2xl md:rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-2 border-transparent hover:border-white/50"
                >
                  <ChevronUp className="w-6 h-6 md:w-8 md:h-8 text-green-400 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-lg md:text-2xl uppercase tracking-wider">Higher</span>
                </button>

                <button
                  onClick={() => handleGuess('lower')}
                  className="flex-1 group relative overflow-hidden glass-panel hover:bg-white/20 text-white font-bold py-3 md:py-5 px-4 rounded-2xl md:rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-2 border-transparent hover:border-white/50"
                >
                  <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-red-400 group-hover:translate-y-1 transition-transform" />
                  <span className="text-lg md:text-2xl uppercase tracking-wider">Lower</span>
                </button>
              </div>
            )}

            {/* STATE 2: REVEAL */}
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
                    <p className="text-base md:text-2xl text-slate-300 font-light mt-0 md:mt-1">years</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs md:text-lg text-slate-200 uppercase tracking-wider font-medium mt-3 md:mt-4">than {leftLeader.name}</p>
        </div>
      </div>

      {/* --- GAME OVER SCREEN --- */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 p-6 md:p-12 rounded-[2rem] flex flex-col items-center text-center max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-500 mt-10 md:mt-0">

            <div className="relative w-16 h-16 md:w-24 md:h-24 mb-4 md:mb-6">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-red-500/30 w-full h-full rounded-full flex items-center justify-center border-2 border-red-500/50">
                <XCircle className="w-10 h-10 md:w-12 md:h-12 text-red-400" />
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white mb-3 md:mb-4 uppercase tracking-wider">Game Over!</h2>

            <p className="text-slate-300 text-base md:text-xl mb-6 md:mb-8 leading-relaxed">
              <span className="font-bold text-white">{rightLeader.name}</span> ruled for <span className="font-bold text-yellow-400">{rightLeader.years} years</span>,
              compared to <span className="font-bold text-yellow-400">{leftLeader.years} years</span> for <span className="font-bold text-white">{leftLeader.name}</span>.
            </p>

            <div className="glass-panel w-full rounded-2xl p-4 md:p-6 mb-6 md:mb-8 flex justify-around relative overflow-hidden bg-black/40">
              <div className="relative z-10">
                <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest mb-1 md:mb-2 font-bold">Your Score</p>
                <p className="text-4xl md:text-5xl font-black text-white">{score}</p>
              </div>
              <div className="w-px bg-white/10 relative z-10"></div>
              <div className="relative z-10">
                <p className="text-[10px] md:text-xs text-yellow-400/80 uppercase tracking-widest mb-1 md:mb-2 font-bold">High Score</p>
                <p className="text-4xl md:text-5xl font-black text-yellow-400">{highScore}</p>
              </div>
            </div>

            <button
              onClick={initGame}
              className="group w-full py-4 md:py-5 bg-white text-black rounded-2xl font-black text-lg md:text-2xl uppercase tracking-wider hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              <RotateCcw className="w-6 h-6 md:w-7 md:h-7 group-hover:-rotate-180 transition-transform duration-500" />
              Play Again
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
