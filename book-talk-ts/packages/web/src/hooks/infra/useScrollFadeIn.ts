import { useEffect, useRef, useState } from 'react';

interface Options {
  threshold?: number;
  delay?: number;
}

export function useScrollFadeIn<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  delay = 0,
}: Options = {}) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  };

  return { ref, style };
}
