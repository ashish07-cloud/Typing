import { useState, useRef, useEffect, useCallback } from "react";

export default function useReplay(rawLog, duration) {
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  const requestRef = useRef();
  const startTimeRef = useRef();
  const lastTimeRef = useRef();

  const animate = useCallback((time) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    setPlaybackTime((prev) => {
      const nextTime = prev + deltaTime * speed;
      if (nextTime >= duration) {
        setIsPlaying(false);
        return duration;
      }
      return nextTime;
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [duration, speed]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = undefined; // Reset delta on play
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, animate]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const seek = (time) => setPlaybackTime(Math.min(duration, Math.max(0, time)));

  return { playbackTime, isPlaying, togglePlay, seek, setSpeed, speed };
}