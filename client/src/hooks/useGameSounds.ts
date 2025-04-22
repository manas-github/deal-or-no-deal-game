import { useRef, useEffect } from 'react';
import { Howl } from 'howler';

export default function useGameSounds() {
  // Sound references
  const sounds = useRef<Record<string, Howl | null>>({
    caseOpen: null,
    offer: null,
    deal: null,
    noDeal: null,
    winSound: null
  });

  // Initialize sounds on mount
  useEffect(() => {
    sounds.current = {
      caseOpen: new Howl({
        src: ['https://assets.coderrocketfuel.com/pomodoro-times-up.mp3'],
        volume: 0.5
      }),
      offer: new Howl({
        src: ['https://assets.coderrocketfuel.com/notification-sound.mp3'],
        volume: 0.6
      }),
      deal: new Howl({
        src: ['https://assets.coderrocketfuel.com/success-sound-effect.mp3'],
        volume: 0.7
      }),
      noDeal: new Howl({
        src: ['https://assets.coderrocketfuel.com/error-sound-effect.mp3'],
        volume: 0.6
      }),
      winSound: new Howl({
        src: ['https://assets.coderrocketfuel.com/win-sound-effect.mp3'],
        volume: 0.7
      })
    };

    // Cleanup on unmount
    return () => {
      Object.values(sounds.current).forEach(sound => {
        if (sound) sound.unload();
      });
    };
  }, []);

  // Function to play a sound
  const playSound = (soundName: keyof typeof sounds.current) => {
    const sound = sounds.current[soundName];
    if (sound) {
      sound.play();
    }
  };

  return { playSound };
}
