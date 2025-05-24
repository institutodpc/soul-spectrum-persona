
import { useCallback } from 'react';

export const useSoundEffects = () => {
  const playSound = useCallback((type: 'success' | 'complete' | 'click') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      let frequency: number;
      let duration: number;
      
      switch (type) {
        case 'success':
          frequency = 800;
          duration = 200;
          break;
        case 'complete':
          frequency = 600;
          duration = 300;
          break;
        case 'click':
          frequency = 400;
          duration = 100;
          break;
        default:
          frequency = 500;
          duration = 150;
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.log('Audio not supported or failed:', error);
    }
  }, []);

  const playSuccessSequence = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Sequência de notas para sucesso
      const notes = [
        { frequency: 523, duration: 150, delay: 0 },    // C5
        { frequency: 659, duration: 150, delay: 150 },  // E5
        { frequency: 784, duration: 300, delay: 300 },  // G5
      ];
      
      notes.forEach(({ frequency, duration, delay }) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration / 1000);
        }, delay);
      });
    } catch (error) {
      console.log('Audio not supported or failed:', error);
    }
  }, []);

  return {
    playSound,
    playSuccessSequence
  };
};
