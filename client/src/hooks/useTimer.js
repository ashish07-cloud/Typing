import { useEffect, useRef, useState } from "react";

export default function useTimer(initialSeconds = 60) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const intervalRef = useRef(null);

  const start = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

 const resetTimer = () => {
  clearInterval(intervalRef.current);
  intervalRef.current = null;
  setTimeLeft(initialSeconds);
};


  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return {
    timeLeft,
    start,
    resetTimer,
  };
}
