import { useState, useRef, useCallback, useEffect } from "react";

export default function useTimer(seconds, onTimeUp) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const timerRef = useRef(null);
  const endTimeRef = useRef(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (timerRef.current || !seconds) return;
    
    endTimeRef.current = Date.now() + seconds * 1000;
    
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        stop();
        if (onTimeUp) onTimeUp();
      }
    }, 100);
  }, [seconds, onTimeUp, stop]);

  const resetTimer = useCallback(() => {
    stop();
    setTimeLeft(seconds);
  }, [seconds, stop]);

  useEffect(() => () => stop(), [stop]);

  return { timeLeft, start, resetTimer };
}