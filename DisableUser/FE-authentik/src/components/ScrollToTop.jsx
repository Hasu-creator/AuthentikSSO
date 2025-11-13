import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 z-50 border border-blue-500/20 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Lên đầu trang"
      title="Lên đầu trang"
      style={{
        boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35), 0 4px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTop;