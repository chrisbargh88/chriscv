import { useEffect } from 'react';

export default function useTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => { document.title = prev; };
  }, [title]);
}
