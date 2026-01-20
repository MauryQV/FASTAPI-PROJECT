'use client';

import { useState, useEffect } from 'react';
import { SYMBOLS } from '../lib/SlotConfig';

interface SlotReelProps {
  symbol: string;
  isSpinning: boolean;
  delay: number;
}

export function SlotReel({ symbol, isSpinning, delay }: SlotReelProps) {
  const [spinning, setSpinning] = useState(false);
  const [displaySymbols, setDisplaySymbols] = useState<string[]>([]);

  useEffect(() => {
    if (isSpinning) {
      setTimeout(() => {
        setSpinning(true);
        // Genera símbolos aleatorios para el efecto de giro
        const randomSymbols = Array.from({ length: 20 }, () => {
          const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          return randomSymbol.emoji;
        });
        setDisplaySymbols(randomSymbols);
      }, delay);

      // Detiene el giro después de la duración
      setTimeout(() => {
        setSpinning(false);
      }, delay + 2000);
    }
  }, [isSpinning, delay]);

  const currentSymbol = SYMBOLS.find(s => s.id === symbol);

  return (
    <div className="relative bg-linear-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden border-4 border-yellow-600 shadow-lg shadow-yellow-600/20">
      <div className="aspect-square flex items-center justify-center p-4">
        {spinning ? (
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 animate-spin-reel">
              {displaySymbols.map((sym, idx) => (
                <div
                  key={idx}
                  className="absolute w-full h-full flex items-center justify-center text-6xl"
                  style={{
                    transform: `translateY(${idx * 100}%)`,
                    opacity: 0.7
                  }}
                >
                  {sym}
                </div>
              ))}
            </div>
            {/* Efecto de blur */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-purple-500/20 to-transparent animate-pulse"></div>
          </div>
        ) : (
          <div className="text-7xl md:text-8xl transform transition-all duration-300 hover:scale-110 animate-symbol-appear">
            {currentSymbol?.emoji || '❓'}
          </div>
        )}
      </div>

      {/* Brillo superior */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-linear-to-b from-white/10 to-transparent pointer-events-none"></div>

      <style jsx>{`
        @keyframes spin-reel {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-2000%);
          }
        }

        @keyframes symbol-appear {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-spin-reel {
          animation: spin-reel 2s cubic-bezier(0.17, 0.67, 0.3, 0.99);
        }

        .animate-symbol-appear {
          animation: symbol-appear 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}