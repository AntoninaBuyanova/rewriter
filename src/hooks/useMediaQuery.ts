import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Устанавливаем начальное состояние
    setMatches(mediaQuery.matches);
    
    // Функция-обработчик для обновления состояния
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Добавляем слушатель событий
    mediaQuery.addEventListener('change', handler);
    
    // Удаляем слушатель при размонтировании
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
} 