export interface ClinicCase {
  id: string;
  slug: string;
  title: string;
  symptom: string;
  category: string;
  hint: string;
  cause: string;
  fix: string;
  takeaway: string;
  ready: boolean;
}
export const cases: ClinicCase[] = [
  {
    id: '01',
    slug: '01-subscription-leak',
    title: 'The subscription that stayed',
    symptom: 'A quiet notification widget starts doing the same work three times.',
    category: 'Lifecycle & RxJS',
    hint: 'Unmount the widget three times, then emit one notification. Watch how many handlers still run.',
    cause:
      'A subscription outlives the component that created it. Each visit leaves another listener behind.',
    fix: 'Tie the subscription to the component lifecycle with takeUntilDestroyed.',
    takeaway: 'Every subscription needs an owner and an end.',
    ready: true,
  },
  {
    id: '02',
    slug: '02-onpush-stale-view',
    title: 'The list that would not refresh',
    symptom: 'The data changes. The number on screen does not.',
    category: 'Change detection',
    hint: 'Add a task from the parent. Compare the source count with the child count.',
    cause: 'An OnPush child receives the same array reference after an in-place mutation.',
    fix: 'Create a new array so the child receives a changed input.',
    takeaway: 'A new reference makes a changed input visible.',
    ready: true,
  },
  {
    id: '03',
    slug: '03-async-validator-race',
    title: 'The answer that arrived too late',
    symptom: 'A free username gets an error from an older request.',
    category: 'Forms & async state',
    hint: 'Reproduce the race or type quickly. The slow answer for an old value must never win.',
    cause: 'Independent subscriptions let stale responses overwrite the current validation state.',
    fix: 'Cancel obsolete work with switchMap and show a pending state.',
    takeaway: 'Only the latest request may update the current field.',
    ready: true,
  },
  {
    id: '04',
    slug: '04-guard-redirect-loop',
    title: 'The redirect with no way out',
    symptom: 'A sign-in route redirects straight back to itself.',
    category: 'Router & guards',
    hint: 'Open the protected task list. Follow the redirect trace, then try the fixed sign-in flow.',
    cause: 'The same authentication guard protects both the destination and the login route.',
    fix: 'Leave login unguarded, return a UrlTree, and validate the return target.',
    takeaway: 'Every redirect needs a reachable destination.',
    ready: true,
  },
  {
    id: '05',
    slug: '05-ionic-back-button',
    title: 'The back button that went too far',
    symptom: 'Back navigates behind a modal instead of closing it.',
    category: 'Ionic & navigation',
    hint: 'Open the modal, then simulate hardware Back. The first press should close the overlay.',
    cause: 'A custom back handler runs before Ionic can dismiss the overlay.',
    fix: 'Respect overlay priorities and unsubscribe the navigation handler on destroy.',
    takeaway: 'Close the top layer before moving the page underneath.',
    ready: false,
  },
];
