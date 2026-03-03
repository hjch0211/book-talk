import { useEffect, useRef, useState } from 'react';

export function useCountdown(initialSeconds: number) {
  const [countdown, setCountdown] = useState(initialSeconds);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(initialSeconds);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stop = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  return { countdown, start, stop };
}
