// src/components/widgets/ZenTimerWidget/hooks/useTimerAudio.ts
import { useCallback, useRef } from "react";

export const useTimerAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playFinishSound = useCallback(() => {
    // Inicializa o contexto apenas no primeiro clique (regra de segurança do navegador)
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Configuração do som (Timbre Futurista)
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // Nota Lá (A5)
    oscillator.frequency.exponentialRampToValueAtTime(
      440,
      ctx.currentTime + 0.5
    ); // Desce suavemente

    // Envelope de Volume (Fade-out suave para não dar estalo)
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }, []);

  return { playFinishSound };
};
