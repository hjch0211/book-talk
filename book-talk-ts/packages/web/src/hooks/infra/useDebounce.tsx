import { useEffect, useEffectEvent, useRef, useState } from 'react';

interface UseDebounceOptions {
  /** 디바운스 지연 시간 (ms) */
  delay: number;
}

/**
 * 함수에 디바운스를 적용하는 커스텀 훅
 * @param callback - 디바운스를 적용할 콜백 함수
 * @param options - 옵션 (delay)
 * @returns 디바운스된 함수와 디바운싱 상태
 */
export const useDebounce = <T extends (...args: any[]) => Promise<void> | void>(
  callback: T,
  options: UseDebounceOptions
) => {
  const { delay } = options;
  const timerRef = useRef<number | null>(null);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const debouncedCallback = useEffectEvent((...args: Parameters<T>) => {
    setIsDebouncing(true);

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(async () => {
      try {
        await callback(...args);
      } catch (error) {
        console.error('Debounced callback error:', error);
      } finally {
        setIsDebouncing(false);
        timerRef.current = null;
      }
    }, delay);
  });

  const cancel = useEffectEvent(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      setIsDebouncing(false);
    }
  });

  /** 언마운트 시 타이머 정리 */
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    debouncedCallback: debouncedCallback as T,
    isDebouncing,
    cancel,
  };
};
