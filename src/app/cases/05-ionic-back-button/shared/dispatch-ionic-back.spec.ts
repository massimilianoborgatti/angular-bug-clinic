import { describe, expect, it } from 'vitest';
import { BackRegistrationEvent, dispatchIonicBack } from './dispatch-ionic-back';

describe('the browser hardware-back event bridge', () => {
  it('dispatches ionBackButton and runs only the highest-priority registered handler', async () => {
    const handled: string[] = [];
    const listener = (event: Event): void => {
      const detail = (event as CustomEvent<BackRegistrationEvent>).detail;
      detail.register(0, () => {
        handled.push('navigation');
      });
      detail.register(100, () => {
        handled.push('modal');
      });
    };
    document.addEventListener('ionBackButton', listener);
    try {
      await dispatchIonicBack(document);
      expect(handled).toEqual(['modal']);
    } finally {
      document.removeEventListener('ionBackButton', listener);
    }
  });

  it('uses latest registration for ties and propagates only when asked', async () => {
    const handled: string[] = [];
    const listener = (event: Event): void => {
      const detail = (event as CustomEvent<BackRegistrationEvent>).detail;
      detail.register(10, () => {
        handled.push('earlier');
      });
      detail.register(10, (next) => {
        handled.push('later');
        next();
      });
    };
    document.addEventListener('ionBackButton', listener);
    try {
      await dispatchIonicBack(document);
      expect(handled).toEqual(['later', 'earlier']);
    } finally {
      document.removeEventListener('ionBackButton', listener);
    }
  });
});
