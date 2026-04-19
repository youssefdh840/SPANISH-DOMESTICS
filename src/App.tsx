/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Sofa, ChefHat, Bed, Bath, Heart, AlertCircle, RefreshCcw } from 'lucide-react';

interface VocabularyItem {
  id: string;
  word: string;
  category: string;
}

const VOCABULARY_LIST: VocabularyItem[] = [
  // La Cocina
  { id: '1', word: 'una cocina eléctrica', category: 'La Cocina' },
  { id: '2', word: 'un frigorífico', category: 'La Cocina' },
  { id: '3', word: 'un horno', category: 'La Cocina' },
  { id: '4', word: 'un lavavajillas', category: 'La Cocina' },
  { id: '5', word: 'una sartén', category: 'La Cocina' },
  { id: '6', word: 'una tetera', category: 'La Cocina' },
  // El Salón
  { id: '7', word: 'un sofá', category: 'El Salón' },
  { id: '8', word: 'un televisor', category: 'El Salón' },
  { id: '9', word: 'una alfombra', category: 'El Salón' },
  { id: '10', word: 'un cuadro', category: 'El Salón' },
  { id: '11', word: 'un sillón', category: 'El Salón' },
  { id: '12', word: 'una chimenea', category: 'El Salón' },
  // El Dormitorio
  { id: '13', word: 'una cama', category: 'El Dormitorio' },
  { id: '14', word: 'una almohada', category: 'El Dormitorio' },
  { id: '15', word: 'una lámpara', category: 'El Dormitorio' },
  { id: '16', word: 'un armario', category: 'El Dormitorio' },
  { id: '17', word: 'una cómoda', category: 'El Dormitorio' },
  { id: '18', word: 'un perchero', category: 'El Dormitorio' },
  // El Cuarto de Baño
  { id: '19', word: 'un inodoro', category: 'El Cuarto de Baño' },
  { id: '20', word: 'un lavabo', category: 'El Cuarto de Baño' },
  { id: '21', word: 'una bañera', category: 'El Cuarto de Baño' },
  { id: '22', word: 'una ducha', category: 'El Cuarto de Baño' },
  { id: '23', word: 'un espejo', category: 'El Cuarto de Baño' },
  { id: '24', word: 'una toalla', category: 'El Cuarto de Baño' },
];

const ROOMS = [
  { name: 'La Cocina', icon: ChefHat },
  { name: 'El Salón', icon: Sofa },
  { name: 'El Dormitorio', icon: Bed },
  { name: 'El Cuarto de Baño', icon: Bath },
];

export default function App() {
  const [bank, setBank] = useState<VocabularyItem[]>([]);
  const [placed, setPlaced] = useState<Record<string, VocabularyItem[]>>({
    'La Cocina': [],
    'El Salón': [],
    'El Dormitorio': [],
    'El Cuarto de Baño': [],
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const shuffleBank = useCallback(() => {
    const shuffled = [...VOCABULARY_LIST].sort(() => Math.random() - 0.5);
    setBank(shuffled);
    setPlaced({
      'La Cocina': [],
      'El Salón': [],
      'El Dormitorio': [],
      'El Cuarto de Baño': [],
    });
    setScore(0);
    setLives(3);
    setSelectedId(null);
    setErrorId(null);
    setShowCelebration(false);
    setGameOver(false);
  }, []);

  useEffect(() => {
    shuffleBank();
  }, [shuffleBank]);

  const handleWordClick = (id: string) => {
    if (gameOver || showCelebration) return;
    setSelectedId(id === selectedId ? null : id);
  };

  const handleRoomClick = (roomName: string) => {
    if (!selectedId || gameOver || showCelebration) return;

    const item = VOCABULARY_LIST.find((v) => v.id === selectedId);
    if (!item) return;

    if (item.category === roomName) {
      setPlaced((prev) => ({
        ...prev,
        [roomName]: [...prev[roomName], item],
      }));
      setBank((prev) => prev.filter((v) => v.id !== selectedId));
      setScore((prev) => prev + 1);
      setSelectedId(null);
      
      if (score + 1 === VOCABULARY_LIST.length) {
        setShowCelebration(true);
      }
    } else {
      setErrorId(selectedId);
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives === 0) {
        setGameOver(true);
      }

      setTimeout(() => {
        setErrorId(null);
        setSelectedId(null);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-10 max-w-[1200px] mx-auto font-sans bg-black">
      <header className="w-full flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h1 className="text-6xl font-display font-black uppercase text-white tracking-tight italic">
            SPANISH <span className="highlight-yellow">DOMESTICS</span>
          </h1>
          <div className="flex items-center gap-4 mt-2 justify-center md:justify-start">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Premium Educational Series</p>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart 
                  key={i} 
                  className={`w-5 h-5 ${i < lives ? 'fill-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-slate-800'}`} 
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="score-metallic">
            <span className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1 text-center">ACIERTOS</span>
            <span className="text-4xl font-display text-white font-black italic">
              {score} <span className="text-xl text-slate-600 not-italic">/ {VOCABULARY_LIST.length}</span>
            </span>
          </div>
          <button 
            onClick={shuffleBank}
            className="btn-reset-premium flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Reiniciar
          </button>
        </div>
      </header>

      <main className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        {ROOMS.map((room) => (
          <div
            key={room.name}
            onClick={() => handleRoomClick(room.name)}
            className={`premium-room ${selectedId ? 'target-active' : ''} min-h-[250px] p-8 flex flex-col cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h3 className="text-2xl font-display font-black text-white uppercase flex items-center gap-4">
                <room.icon className="w-6 h-6 highlight-yellow" />
                {room.name}
              </h3>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{placed[room.name].length} objetos</span>
            </div>
            
            <div className="flex flex-wrap gap-2 content-start">
              {placed[room.name].map((item) => (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={item.id}
                  className="placed-label-premium"
                >
                  {item.word}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </main>

      <section className="w-full bg-[#111] border-t-2 border-slate-900 p-10 flex flex-wrap gap-4 justify-center items-center min-h-[200px] rounded-b-[2rem]">
        {bank.map((item) => (
          <div
            key={item.id}
            onClick={() => handleWordClick(item.id)}
            className={`
              silver-card
              ${selectedId === item.id ? 'active' : ''}
              ${errorId === item.id ? 'flash-error-premium' : ''}
            `}
          >
            {item.word}
          </div>
        ))}
        {bank.length === 0 && !showCelebration && !gameOver && (
          <div className="highlight-yellow font-black text-2xl uppercase italic tracking-[0.2em] animate-pulse text-center w-full">¡Misión Completada!</div>
        )}
      </section>

      <AnimatePresence>
        {(showCelebration || gameOver) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`bg-[#0a0a0a] border-2 ${showCelebration ? 'border-[var(--electric-yellow)] shadow-[0_0_50px_rgba(255,235,59,0.2)]' : 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.2)]'} p-16 rounded-[2rem] text-center max-w-xl relative overflow-hidden`}
            >
              {showCelebration && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -50, x: Math.random() * 400 - 200, opacity: 1 }}
                      animate={{ y: 500, x: Math.random() * 400 - 200, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                      className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rotate-45"
                    />
                  ))}
                </div>
              )}

              {showCelebration ? (
                <>
                  <div className="relative inline-block mb-8">
                    <Trophy className="w-24 h-24 highlight-yellow mx-auto" />
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full"
                    />
                  </div>
                  <h2 className="text-7xl font-display font-black text-white uppercase mb-4 tracking-tighter leading-tight">
                    ¡FELICIDADES!
                  </h2>
                  <p className="text-slate-400 text-xl font-bold mb-10 uppercase tracking-widest">
                    Eres un experto del hogar.
                  </p>
                  <button 
                    onClick={shuffleBank}
                    className="btn-reset-premium w-full py-5 text-2xl"
                  >
                    Jugar de Nuevo
                  </button>
                </>
              ) : (
                <>
                  <AlertCircle className="w-24 h-24 text-red-600 mx-auto mb-8 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                  <h2 className="text-8xl font-display font-black text-white uppercase mb-4 tracking-tighter italic">
                    GAME OVER
                  </h2>
                  <p className="text-slate-400 text-xl font-bold mb-10 uppercase tracking-widest">
                    Te has quedado sin vidas.
                  </p>
                  <button 
                    onClick={shuffleBank}
                    className="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-lg text-2xl uppercase transition-all active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                  >
                    Reintentar
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="w-full py-6 text-center text-slate-800 font-black uppercase tracking-[1em] text-[8px]">
        Professional Grade // Education Module // v3.0
      </footer>
    </div>
  );
}
