'use client';

import { useState, useEffect } from 'react';
import { SlotReel } from './SlotReel';
import { Statistics } from './Statistics';
import { useSlotGame } from '../hooks/useSlotGame';
import { SYMBOLS } from '../lib/SlotConfig';

export function SlotMachine() {
  const {
    balance,
    totalBet,
    totalWon,
    spinsCount,
    reels,
    isSpinning,
    lastWin,
    spinResult,
    spin,
    resetStats
  } = useSlotGame();

  const [showWin, setShowWin] = useState(false);

  useEffect(() => {
    if (lastWin > 0) {
      setShowWin(true);
      const timer = setTimeout(() => setShowWin(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastWin]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      {/* Efectos de fondo */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-pink-500 to-purple-600 animate-gradient-x" 
            style={{ fontFamily: 'Orbitron, sans-serif' }}>
          CASINO SLOTS
        </h1>
        
        <p className="text-center text-yellow-300 text-sm md:text-base mb-8 font-medium">
          ⚠️ RTP: 92% - La casa siempre gana a largo plazo
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel principal de la tragaperras */}
          <div className="lg:col-span-2">
            <div className="bg-linear-to-b from-gray-900 to-gray-800 rounded-3xl p-8 border-4 border-yellow-500 shadow-2xl shadow-yellow-500/30">
              {/* Balance */}
              <div className="bg-black rounded-xl p-6 mb-6 border-2 border-yellow-600">
                <div className="text-center">
                  <p className="text-yellow-500 text-sm uppercase tracking-wider mb-2">Balance</p>
                  <p className="text-5xl font-bold text-yellow-400" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    ${balance.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Carretes */}
              <div className="bg-linear-to-b from-purple-900/50 to-black rounded-2xl p-6 mb-6 border-2 border-purple-500">
                <div className="grid grid-cols-3 gap-4">
                  {reels.map((symbol, index) => (
                    <SlotReel
                      key={index}
                      symbol={symbol}
                      isSpinning={isSpinning}
                      delay={index * 200}
                    />
                  ))}
                </div>

                {/* Mensaje de resultado */}
                {showWin && lastWin > 0 && (
                  <div className="mt-6 text-center animate-bounce">
                    <p className="text-4xl font-bold text-yellow-400 drop-shadow-lg">
                      🎉 ¡GANASTE ${lastWin.toFixed(2)}! 🎉
                    </p>
                    <p className="text-lg text-purple-300 mt-2">{spinResult}</p>
                  </div>
                )}

                {showWin && lastWin === 0 && spinResult && (
                  <div className="mt-6 text-center">
                    <p className="text-2xl text-gray-400">{spinResult}</p>
                  </div>
                )}
              </div>

              {/* Controles */}
              <div className="space-y-4">
                <button
                  onClick={spin}
                  disabled={isSpinning || balance < 1}
                  className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold text-2xl py-6 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  {isSpinning ? '🎰 GIRANDO...' : balance < 1 ? '💸 SIN FONDOS' : '🎰 GIRAR ($1.00)'}
                </button>

                <button
                  onClick={resetStats}
                  className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  🔄 Reiniciar Juego ($100)
                </button>
              </div>

              {/* Tabla de pagos */}
              <div className="mt-6 bg-black/50 rounded-xl p-4 border border-purple-500">
                <h3 className="text-yellow-400 font-bold text-lg mb-3 text-center">💰 TABLA DE PAGOS</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {SYMBOLS.filter(s => s.id !== 'blank').map(symbol => (
                    <div key={symbol.id} className="flex items-center justify-between bg-purple-900/30 rounded px-3 py-2">
                      <span className="text-3xl">{symbol.emoji}</span>
                      <span className="text-yellow-300 font-semibold">3x = ${symbol.payout.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  * 2 símbolos iguales = Devolución de apuesta ($1.00)
                </p>
              </div>
            </div>
          </div>

          {/* Panel de estadísticas */}
          <div className="lg:col-span-1">
            <Statistics
              balance={balance}
              totalBet={totalBet}
              totalWon={totalWon}
              spinsCount={spinsCount}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-red-900/20 border-2 border-red-500 rounded-xl p-6 text-center">
          <h3 className="text-red-400 font-bold text-xl mb-2">⚠️ ADVERTENCIA EDUCATIVA</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Esta simulación demuestra matemáticamente por qué los casinos siempre ganan. 
            Con un RTP del 92%, por cada $100 apostados, estadísticamente recuperarás $92, 
            perdiendo $8. Cuanto más juegues, más te acercarás a esta expectativa matemática. 
            <span className="text-red-400 font-bold"> El juego es entretenimiento que cuesta dinero, no una forma de ganarlo.</span>
          </p>
        </div>
      </div>

      {/* Fuente de Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}