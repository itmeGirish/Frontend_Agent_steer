import { useEffect, useRef } from 'react';

/**
 * Hook for auto-scrolling chat messages to bottom
 * - Automatically scrolls when new messages arrive
 * - Pauses when user scrolls up
 * - Resumes when user scrolls back to bottom
 */
export function useAutoScroll(containerSelector: string) {
  const userScrolledUpRef = useRef(false);
  const scrollableElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Check if user is near bottom (within 100px)
    const isNearBottom = (el: HTMLElement) => {
      const threshold = 100;
      return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    };

    // Handle user scroll - detect if they scrolled up
    const handleUserScroll = (e: Event) => {
      const el = e.target as HTMLElement;
      if (isNearBottom(el)) {
        userScrolledUpRef.current = false;
      } else {
        userScrolledUpRef.current = true;
      }
    };

    // Auto-scroll to bottom
    const autoScrollToBottom = () => {
      if (userScrolledUpRef.current) return;

      const container = document.querySelector(containerSelector);
      if (container) {
        const allDivs = container.querySelectorAll('div');
        allDivs.forEach(div => {
          const htmlEl = div as HTMLElement;
          const style = window.getComputedStyle(htmlEl);
          if (
            (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
            htmlEl.scrollHeight > htmlEl.clientHeight
          ) {
            if (!scrollableElementRef.current) {
              scrollableElementRef.current = htmlEl;
              htmlEl.addEventListener('scroll', handleUserScroll);
            }
            htmlEl.scrollTo({
              top: htmlEl.scrollHeight,
              behavior: 'smooth'
            });
          }
        });
      }
    };

    // Watch for DOM changes
    const scrollObserver = new MutationObserver((mutations) => {
      const hasNewContent = mutations.some(m =>
        m.addedNodes.length > 0 || m.type === 'characterData'
      );
      if (hasNewContent && !userScrolledUpRef.current) {
        requestAnimationFrame(autoScrollToBottom);
        setTimeout(autoScrollToBottom, 100);
      }
    });

    const startObserver = () => {
      const container = document.querySelector(containerSelector);
      if (container) {
        scrollObserver.observe(container, {
          childList: true,
          subtree: true,
          characterData: true,
          characterDataOldValue: true
        });
        autoScrollToBottom();
      }
    };

    const timer1 = setTimeout(startObserver, 500);
    const timer2 = setTimeout(startObserver, 1000);
    const timer3 = setTimeout(startObserver, 2000);

    const scrollInterval = setInterval(() => {
      if (!userScrolledUpRef.current) {
        autoScrollToBottom();
      }
    }, 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(scrollInterval);
      scrollObserver.disconnect();
      if (scrollableElementRef.current) {
        scrollableElementRef.current.removeEventListener('scroll', handleUserScroll);
      }
    };
  }, [containerSelector]);
}
