import { useState, useCallback } from 'react';
import { getRandomSymbol, calculatePayout, GAME_CONFIG } from '../lib/SlotConfig';

export function useSlotGame() {
  const [balance, setBalance] = useState(GAME_CONFIG.INITIAL_BALANCE);
  const [totalBet, setTotalBet] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [spinsCount, setSpinsCount] = useState(0);
  const [reels, setReels] = useState(['cherry', 'cherry', 'cherry']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);
  const [spinResult, setSpinResult] = useState('');

  const spin = useCallback(() => {
    if (balance < GAME_CONFIG.BET_AMOUNT || isSpinning) return;

    // Deduce la apuesta
    setBalance(prev => prev - GAME_CONFIG.BET_AMOUNT);
    setTotalBet(prev => prev + GAME_CONFIG.BET_AMOUNT);
    setSpinsCount(prev => prev + 1);
    setIsSpinning(true);
    setLastWin(0);
    setSpinResult('');

    // Genera los resultados inmediatamente (aunque la animación tarde más)
    const newReels = [
      getRandomSymbol().id,
      getRandomSymbol().id,
      getRandomSymbol().id
    ];

    // Simula el tiempo de giro
    setTimeout(() => {
      setReels(newReels);
      
      // Calcula el pago
      const result = calculatePayout(newReels);
      
      if (result.payout > 0) {
        setBalance(prev => prev + result.payout);
        setTotalWon(prev => prev + result.payout);
        setLastWin(result.payout);
      }
      
      setSpinResult(result.message);
      setIsSpinning(false);
    }, GAME_CONFIG.SPIN_DURATION);
  }, [balance, isSpinning]);

  const resetStats = useCallback(() => {
    setBalance(GAME_CONFIG.INITIAL_BALANCE);
    setTotalBet(0);
    setTotalWon(0);
    setSpinsCount(0);
    setReels(['cherry', 'cherry', 'cherry']);
    setLastWin(0);
    setSpinResult('');
  }, []);

  return {
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
  };
}