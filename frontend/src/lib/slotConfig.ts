// Configuración de símbolos de la tragaperras
// Probabilidades y pagos diseñados para un RTP (Return to Player) del ~92%

export interface Symbol {
  id: string;
  emoji: string;
  payout: number;      // Pago por 3 símbolos iguales
  weight: number;      // Peso de probabilidad (mayor = más común)
}

export const SYMBOLS: Symbol[] = [
  // Símbolos de alto valor (raros, grandes pagos)
  {
    id: 'seven',
    emoji: '7️⃣',
    payout: 50,        // 3x = $50 (50:1)
    weight: 1          // Muy raro (~1.7%)
  },
  {
    id: 'diamond',
    emoji: '💎',
    payout: 30,        // 3x = $30 (30:1)
    weight: 2          // Raro (~3.4%)
  },
  {
    id: 'star',
    emoji: '⭐',
    payout: 20,        // 3x = $20 (20:1)
    weight: 3          // Poco común (~5.2%)
  },
  
  // Símbolos de valor medio
  {
    id: 'crown',
    emoji: '👑',
    payout: 10,        // 3x = $10 (10:1)
    weight: 5          // Moderado (~8.6%)
  },
  {
    id: 'bell',
    emoji: '🔔',
    payout: 5,         // 3x = $5 (5:1)
    weight: 8          // Común (~13.8%)
  },
  {
    id: 'cherry',
    emoji: '🍒',
    payout: 3,         // 3x = $3 (3:1)
    weight: 10         // Muy común (~17.2%)
  },
  
  // Símbolos de bajo valor
  {
    id: 'lemon',
    emoji: '🍋',
    payout: 2,         // 3x = $2 (2:1)
    weight: 12         // Muy común (~20.7%)
  },
  
  // Símbolo vacío (no paga nada, pero ayuda a reducir RTP)
  {
    id: 'blank',
    emoji: '❌',
    payout: 0,
    weight: 17         // Extremadamente común (~29.3%)
  }
];

// Cálculo del peso total para normalizar probabilidades
export const TOTAL_WEIGHT = SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);

// Función para seleccionar un símbolo basado en las probabilidades
export function getRandomSymbol(): Symbol {
  const random = Math.random() * TOTAL_WEIGHT;
  let cumulativeWeight = 0;
  
  for (const symbol of SYMBOLS) {
    cumulativeWeight += symbol.weight;
    if (random < cumulativeWeight) {
      return symbol;
    }
  }
  
  return SYMBOLS[SYMBOLS.length - 1]; // Fallback
}

// Función para calcular el pago de una combinación
export function calculatePayout(symbols: string[]): { payout: number; message: string } {
  const [s1, s2, s3] = symbols;
  
  // Jackpot: 3 sietes
  if (s1 === 'seven' && s2 === 'seven' && s3 === 'seven') {
    return { payout: 50, message: '🎰 ¡JACKPOT! 3x SIETE 🎰' };
  }
  
  // 3 símbolos iguales
  if (s1 === s2 && s2 === s3) {
    const symbol = SYMBOLS.find(s => s.id === s1);
    if (symbol && symbol.id !== 'blank') {
      return { 
        payout: symbol.payout, 
        message: `¡3x ${symbol.emoji}!` 
      };
    }
  }
  
  // 2 símbolos iguales (solo devuelve la apuesta)
  if (s1 === s2 || s2 === s3 || s1 === s3) {
    // Encuentra cuál símbolo se repite
    const repeatedId = s1 === s2 ? s1 : s2 === s3 ? s2 : s1;
    const symbol = SYMBOLS.find(s => s.id === repeatedId);
    
    if (symbol && symbol.id !== 'blank') {
      return { 
        payout: 1, // Devuelve la apuesta de $1
        message: `2x ${symbol.emoji} - Apuesta devuelta` 
      };
    }
  }
  
  // Sin premio
  return { payout: 0, message: 'Sin premio' };
}

// Configuración del juego
export const GAME_CONFIG = {
  INITIAL_BALANCE: 100,
  BET_AMOUNT: 1,
  SPIN_DURATION: 2500, // milisegundos
  TARGET_RTP: 92,      // 92% Return to Player (ventaja de casa: 8%)
};

// Función para verificar el RTP teórico
export function calculateTheoreticalRTP(): number {
  // Probabilidad de cada símbolo
  const probabilities = SYMBOLS.map(s => s.weight / TOTAL_WEIGHT);
  
  let expectedReturn = 0;
  
  // Calcular retorno esperado para 3 símbolos iguales
  SYMBOLS.forEach((symbol, i) => {
    if (symbol.id !== 'blank') {
      const prob3 = Math.pow(probabilities[i], 3);
      expectedReturn += prob3 * symbol.payout;
    }
  });
  
  // Calcular retorno esperado para 2 símbolos iguales (devuelve apuesta = $1)
  SYMBOLS.forEach((symbol, i) => {
    if (symbol.id !== 'blank') {
      const prob = probabilities[i];
      // 2 en posiciones específicas, 1 diferente
      const prob2 = 3 * prob * prob * (1 - prob);
      expectedReturn += prob2 * 1; // Devuelve $1
    }
  });
  
  // RTP = (Retorno Esperado / Apuesta) * 100
  return (expectedReturn / GAME_CONFIG.BET_AMOUNT) * 100;
}

// Log del RTP teórico (solo en desarrollo)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🎰 RTP Teórico:', calculateTheoreticalRTP().toFixed(2) + '%');
  console.log('🎲 Distribución de símbolos:');
  SYMBOLS.forEach(s => {
    const prob = ((s.weight / TOTAL_WEIGHT) * 100).toFixed(1);
    console.log(`  ${s.emoji} ${s.id}: ${prob}% (pago: $${s.payout})`);
  });
}