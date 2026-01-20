'use client';

import { useEffect, useState } from 'react';

interface StatisticsProps {
  balance: number;
  totalBet: number;
  totalWon: number;
  spinsCount: number;
}

export function Statistics({ balance, totalBet, totalWon, spinsCount }: StatisticsProps) {
  const netProfit = totalWon - totalBet;
  const rtp = totalBet > 0 ? (totalWon / totalBet) * 100 : 0;
  const houseEdge = 100 - rtp;
  const avgBetSize = spinsCount > 0 ? totalBet / spinsCount : 0;

  // Proyecciones a largo plazo
  const projectedLoss100 = -8; // Con RTP 92%, perdemos $8 por cada $100
  const projectedLoss1000 = -80;
  const projectedLoss10000 = -800;

  // Estimación de cuánto perderías en diferentes escenarios
  const estimatedLossAt100Spins = (100 * avgBetSize * 0.08).toFixed(2);
  const estimatedLossAt1000Spins = (1000 * avgBetSize * 0.08).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Resumen de sesión */}
      <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border-2 border-purple-500 shadow-xl">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
          📊 Estadísticas de Sesión
        </h2>

        <div className="space-y-3">
          <StatItem label="Giros realizados" value={spinsCount.toString()} />
          <StatItem label="Total apostado" value={`$${totalBet.toFixed(2)}`} color="text-red-400" />
          <StatItem label="Total ganado" value={`$${totalWon.toFixed(2)}`} color="text-green-400" />
          
          <div className="border-t border-gray-700 pt-3 mt-3">
            <StatItem 
              label="Ganancia Neta" 
              value={`$${netProfit.toFixed(2)}`} 
              color={netProfit >= 0 ? 'text-green-400' : 'text-red-400'}
              large
            />
          </div>

          <StatItem 
            label="RTP Real" 
            value={`${rtp.toFixed(2)}%`}
            subtext="(Retorno al Jugador)"
          />
          
          <StatItem 
            label="Ventaja de la Casa" 
            value={`${houseEdge.toFixed(2)}%`}
            color="text-red-400"
          />
        </div>
      </div>

      {/* Análisis matemático */}
      <div className="bg-linear-to-br from-red-950 to-gray-900 rounded-2xl p-6 border-2 border-red-500 shadow-xl">
        <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
          ⚠️ Expectativa Matemática
        </h3>

        <div className="space-y-3 text-sm">
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-gray-300 mb-2">Con RTP del 92% (configurado):</p>
            <ul className="space-y-1 text-gray-400">
              <li>• Por cada $100 apostados → <span className="text-red-400 font-bold">Pierdes $8</span></li>
              <li>• Por cada $1,000 apostados → <span className="text-red-400 font-bold">Pierdes $80</span></li>
              <li>• Por cada $10,000 apostados → <span className="text-red-400 font-bold">Pierdes $800</span></li>
            </ul>
          </div>

          {spinsCount >= 10 && (
            <div className="bg-black/30 rounded-lg p-3">
              <p className="text-yellow-300 font-semibold mb-2">Tu proyección:</p>
              <ul className="space-y-1 text-gray-400">
                <li>• A 100 giros → <span className="text-red-400">-${estimatedLossAt100Spins}</span></li>
                <li>• A 1,000 giros → <span className="text-red-400">-${estimatedLossAt1000Spins}</span></li>
              </ul>
            </div>
          )}

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-3">
            <p className="text-yellow-300 text-xs leading-relaxed">
              <strong>📉 Ley de los Grandes Números:</strong> Cuantos más giros realices, 
              más se acercará tu RTP al 92% configurado. La suerte a corto plazo se equilibra 
              con las matemáticas a largo plazo.
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de progreso visual */}
      <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border-2 border-blue-500 shadow-xl">
        <h3 className="text-xl font-bold text-blue-400 mb-4">📈 Progreso Visual</h3>
        
        {spinsCount > 0 ? (
          <div className="space-y-4">
            {/* Barra de RTP */}
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>RTP Actual: {rtp.toFixed(1)}%</span>
                <span>Objetivo: 92%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    rtp >= 92 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(rtp, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Balance visual */}
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Balance</span>
                <span>${balance.toFixed(2)} / $100.00</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    balance >= 100 ? 'bg-green-500' : balance >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(balance / 100) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Indicador de convergencia */}
            {spinsCount >= 20 && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <p className="text-purple-300 text-xs">
                  <strong>Convergencia:</strong> Llevas {spinsCount} giros. 
                  {spinsCount < 100 && ' Necesitas ~100+ giros para ver la verdadera tendencia.'}
                  {spinsCount >= 100 && spinsCount < 500 && ' Estás viendo la convergencia hacia el RTP real.'}
                  {spinsCount >= 500 && ' ¡Tus estadísticas muestran la realidad matemática!'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">
            Comienza a jugar para ver tus estadísticas
          </p>
        )}
      </div>

      {/* Información educativa */}
      <div className="bg-linear-to-br from-indigo-950 to-gray-900 rounded-2xl p-6 border-2 border-indigo-500 shadow-xl">
        <h3 className="text-lg font-bold text-indigo-400 mb-3">🎓 Sabías que...</h3>
        <div className="space-y-2 text-xs text-gray-300">
          <p>• Los casinos reales tienen RTPs del 85-98% en tragaperras</p>
          <p>• La "ventaja de la casa" garantiza ganancias a largo plazo</p>
          <p>• Las rachas de suerte son temporales, las matemáticas son permanentes</p>
          <p>• Ninguna estrategia puede vencer la expectativa matemática negativa</p>
        </div>
      </div>
    </div>
  );
}

function StatItem({ 
  label, 
  value, 
  color = 'text-white', 
  large = false,
  subtext 
}: { 
  label: string; 
  value: string; 
  color?: string; 
  large?: boolean;
  subtext?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">
        {label}
        {subtext && <span className="block text-xs text-gray-500">{subtext}</span>}
      </span>
      <span className={`${color} font-bold ${large ? 'text-2xl' : 'text-lg'}`}>
        {value}
      </span>
    </div>
  );
}