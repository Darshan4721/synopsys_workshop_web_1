'use client';

import { useEffect } from 'react';

export default function ScrollObserver() {
  useEffect(() => {
    // Check if IntersectionObserver is available
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          // Once animated, unobserve to free GPU/observer resources
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    });

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
