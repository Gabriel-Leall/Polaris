/**
 * Transforma segundos em formato MM:SS
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

/**
 * Calcula a porcentagem de progresso para o círculo de SVG
 */
export const calculateProgress = (current: number, total: number): number => {
  if (total <= 0) return 0;
  return ((total - current) / total) * 100;
};
