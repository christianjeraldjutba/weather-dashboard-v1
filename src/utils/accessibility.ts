/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Set focus to element with proper error handling
   */
  setFocus: (element: HTMLElement | null, options?: FocusOptions): boolean => {
    if (!element) return false;
    
    try {
      element.focus(options);
      return document.activeElement === element;
    } catch (error) {
      console.warn('Failed to set focus:', error);
      return false;
    }
  },

  /**
   * Focus first focusable element in container
   */
  focusFirst: (container: HTMLElement): boolean => {
    const focusableElements = focusManagement.getFocusableElements(container);
    if (focusableElements.length > 0) {
      return focusManagement.setFocus(focusableElements[0]);
    }
    return false;
  },

  /**
   * Focus last focusable element in container
   */
  focusLast: (container: HTMLElement): boolean => {
    const focusableElements = focusManagement.getFocusableElements(container);
    if (focusableElements.length > 0) {
      return focusManagement.setFocus(focusableElements[focusableElements.length - 1]);
    }
    return false;
  },

  /**
   * Get all focusable elements in container
   */
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    const elements = Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
    
    return elements.filter(element => {
      return element.offsetWidth > 0 && 
             element.offsetHeight > 0 && 
             !element.hasAttribute('hidden') &&
             window.getComputedStyle(element).visibility !== 'hidden';
    });
  },

  /**
   * Trap focus within container (for modals, dropdowns)
   */
  trapFocus: (container: HTMLElement, event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;

    const focusableElements = focusManagement.getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        focusManagement.setFocus(lastElement);
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        focusManagement.setFocus(firstElement);
      }
    }
  },
};

/**
 * ARIA utilities
 */
export const ariaUtils = {
  /**
   * Set ARIA attributes safely
   */
  setAttributes: (element: HTMLElement, attributes: Record<string, string | boolean | null>): void => {
    Object.entries(attributes).forEach(([key, value]) => {
      if (value === null) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, String(value));
      }
    });
  },

  /**
   * Announce message to screen readers
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  },

  /**
   * Generate unique ID for ARIA relationships
   */
  generateId: (prefix: string = 'aria'): string => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Set up ARIA describedby relationship
   */
  setDescribedBy: (element: HTMLElement, descriptionId: string): void => {
    const existingIds = element.getAttribute('aria-describedby') || '';
    const ids = existingIds.split(' ').filter(id => id.length > 0);
    
    if (!ids.includes(descriptionId)) {
      ids.push(descriptionId);
      element.setAttribute('aria-describedby', ids.join(' '));
    }
  },

  /**
   * Remove ARIA describedby relationship
   */
  removeDescribedBy: (element: HTMLElement, descriptionId: string): void => {
    const existingIds = element.getAttribute('aria-describedby') || '';
    const ids = existingIds.split(' ').filter(id => id !== descriptionId && id.length > 0);
    
    if (ids.length > 0) {
      element.setAttribute('aria-describedby', ids.join(' '));
    } else {
      element.removeAttribute('aria-describedby');
    }
  },
};

/**
 * Keyboard navigation utilities
 */
export const keyboardNavigation = {
  /**
   * Handle arrow key navigation in lists
   */
  handleArrowKeys: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (newIndex: number) => void
  ): void => {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    onIndexChange(newIndex);
    focusManagement.setFocus(items[newIndex]);
  },

  /**
   * Handle escape key to close modals/dropdowns
   */
  handleEscape: (event: KeyboardEvent, onEscape: () => void): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onEscape();
    }
  },

  /**
   * Handle enter/space activation
   */
  handleActivation: (event: KeyboardEvent, onActivate: () => void): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate();
    }
  },
};

/**
 * Color contrast utilities
 */
export const colorContrast = {
  /**
   * Calculate relative luminance
   */
  getLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio: (color1: [number, number, number], color2: [number, number, number]): number => {
    const lum1 = colorContrast.getLuminance(...color1);
    const lum2 = colorContrast.getLuminance(...color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Check if contrast ratio meets WCAG AA standards
   */
  meetsWCAGAA: (contrastRatio: number, isLargeText: boolean = false): boolean => {
    return contrastRatio >= (isLargeText ? 3 : 4.5);
  },

  /**
   * Check if contrast ratio meets WCAG AAA standards
   */
  meetsWCAGAAA: (contrastRatio: number, isLargeText: boolean = false): boolean => {
    return contrastRatio >= (isLargeText ? 4.5 : 7);
  },
};

/**
 * Screen reader utilities
 */
export const screenReader = {
  /**
   * Check if screen reader is likely active
   */
  isActive: (): boolean => {
    // This is a heuristic - not 100% reliable
    return window.navigator.userAgent.includes('NVDA') ||
           window.navigator.userAgent.includes('JAWS') ||
           window.speechSynthesis?.speaking === true ||
           document.body.classList.contains('screen-reader-active');
  },

  /**
   * Create visually hidden text for screen readers
   */
  createHiddenText: (text: string): HTMLSpanElement => {
    const span = document.createElement('span');
    span.className = 'sr-only';
    span.textContent = text;
    return span;
  },

  /**
   * Add screen reader only description
   */
  addDescription: (element: HTMLElement, description: string): string => {
    const descriptionId = ariaUtils.generateId('description');
    const descriptionElement = screenReader.createHiddenText(description);
    descriptionElement.id = descriptionId;
    
    element.appendChild(descriptionElement);
    ariaUtils.setDescribedBy(element, descriptionId);
    
    return descriptionId;
  },
};

/**
 * Reduced motion utilities
 */
export const reducedMotion = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReduced: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Apply animation only if motion is not reduced
   */
  conditionalAnimate: (element: HTMLElement, animation: () => void): void => {
    if (!reducedMotion.prefersReduced()) {
      animation();
    }
  },
};

/**
 * Initialize accessibility features
 */
export const initializeAccessibility = (): void => {
  // Add screen reader CSS
  if (!document.getElementById('accessibility-styles')) {
    const style = document.createElement('style');
    style.id = 'accessibility-styles';
    style.textContent = `
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
      
      .focus-visible {
        outline: 2px solid #0066cc !important;
        outline-offset: 2px !important;
      }
      
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Set up focus-visible polyfill behavior
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
};
