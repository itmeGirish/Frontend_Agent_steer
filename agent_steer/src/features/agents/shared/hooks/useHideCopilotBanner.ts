import { useEffect } from 'react';

/**
 * Hook to hide CopilotKit dev banners and inspector
 */
export function useHideCopilotBanner() {
  useEffect(() => {
    const styleId = 'hide-copilotkit-banner';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Hide CopilotKit dev inspector */
        [data-copilotkit-dev-console],
        [data-copilotkit-inspector],
        [class*="copilotKitDevConsole"],
        [class*="copilotKitInspector"],
        [class*="CopilotKitDevConsole"],
        /* Hide version announcement banner */
        [class*="copilotKitBanner"],
        [data-copilotkit-banner],
        a[href*="copilotkit.ai"][target="_blank"] {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    const hideBanner = () => {
      document.querySelectorAll('div').forEach((el) => {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed') {
          const text = el.textContent || '';
          if (
            (text.includes('CopilotKit v') && text.includes('now live')) ||
            (text.includes('AG-UI Events') && text.includes('sample_agent')) ||
            (text.includes('Inspector') && text.includes('Frontend Tools'))
          ) {
            (el as HTMLElement).style.display = 'none';
          }
        }
      });
    };

    hideBanner();
    const timer1 = setTimeout(hideBanner, 100);
    const timer2 = setTimeout(hideBanner, 500);
    const timer3 = setTimeout(hideBanner, 1000);

    const observer = new MutationObserver(hideBanner);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      observer.disconnect();
    };
  }, []);
}
