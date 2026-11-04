export type Consent = 'pending' | 'granted' | 'denied';
type Settings = Record<string, unknown>;
export type Command = [string, string, Settings];
declare global {
  interface Window {
    dataLayer: Command[];
    gtag: (command: string, name: string, parameters: Settings) => void;
  }
}
const denied = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};
export class DemoAnalytics {
  private entries: Command[] = [];
  private listeners = new Set<() => void>();
  private initialized = false;
  private configured = false;
  consent: Consent = 'pending';
  constructor(readonly fixed: boolean) {}
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  snapshot = () => this.entries;
  private push(command: string, name: string, parameters: Settings) {
    this.entries = [...this.entries, [command, name, parameters]];
    window.dataLayer = this.entries;
    this.listeners.forEach((listener) => listener());
  }
  // Local gtag stub: config mimics the automatic first page view. No requests.
  gtag = (command: string, name: string, parameters: Settings) => {
    this.push(command, name, parameters);
    if (command === 'config' && parameters.send_page_view !== false)
      this.push('event', 'page_view', {
        page_location: window.location.href,
        page_title: document.title,
      });
  };
  initialize() {
    if (this.initialized) return;
    this.initialized = true;
    window.dataLayer = this.entries;
    window.gtag = this.gtag;
    if (this.fixed) this.gtag('consent', 'default', { ...denied });
    else {
      this.gtag('config', 'G-DEMO000000', {});
      this.event('page_view', { page_location: window.location.href, page_title: document.title });
    }
  }
  answer(consent: Exclude<Consent, 'pending'>) {
    this.consent = consent;
    this.gtag('consent', 'update', {
      ...denied,
      analytics_storage: consent,
      ad_storage: consent,
      ad_user_data: consent,
      ad_personalization: consent,
    });
    if (this.fixed && consent === 'granted' && !this.configured) {
      this.configured = true;
      this.gtag('config', 'G-DEMO000000', { send_page_view: false });
    }
  }
  event(name: string, parameters: Settings) {
    if (this.fixed && this.consent !== 'granted') return;
    this.gtag('event', name, parameters);
  }
}
