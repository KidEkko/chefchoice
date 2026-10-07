import { useEffect, useRef, useState } from "react";

export function useLoading(onByDefault = false) {
  const [loading, setLoading] = useState<boolean>(!!onByDefault);

  function startLoading(): void {
    setLoading(true);
  }

  function stopLoading(): void {
    setLoading(false);
  }

  return { loading, startLoading, stopLoading };
}

export function useTimer() {
  const [time, setTime] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef<number>(0);

  function startTimer(): void {
    setRunning(true);
    startTime.current = Date.now() - time; 
  }

  function stopTimer(): void {
    setRunning(false);
  }

  function reset(): void {
    setTime(0);
    stopTimer();
    startTime.current = 0;
  }

  useEffect(() => {
    if (running) {
      intervalId.current = setInterval(
        () => setTime(Date.now() - startTime.current),
        10
      );
    }
    return () => {
      if (intervalId.current !== null) clearInterval(intervalId.current);
    };
  }, [running]);

  return { running, time, startTimer, stopTimer, reset };
}