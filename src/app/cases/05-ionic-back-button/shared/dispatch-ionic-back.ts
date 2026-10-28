type BackHandler = (processNextHandler: () => void) => void | Promise<unknown>;

interface Registration {
  priority: number;
  order: number;
  handle: BackHandler;
}

export interface BackRegistrationEvent {
  register(priority: number, handle: BackHandler): void;
}

/**
 * Browser-only event bridge. The real Ionic modal and Platform listeners
 * register their own handlers; this helper only chooses which one runs.
 */
export async function dispatchIonicBack(document: Document): Promise<void> {
  const registrations: Registration[] = [];
  document.dispatchEvent(
    new CustomEvent<BackRegistrationEvent>('ionBackButton', {
      detail: {
        register: (priority, handle) => {
          registrations.push({ priority, handle, order: registrations.length });
        },
      },
    }),
  );

  registrations.sort((left, right) => right.priority - left.priority || right.order - left.order);

  const runNext = async (): Promise<void> => {
    const registration = registrations.shift();
    if (!registration) return;
    let continuation: Promise<void> | undefined;
    await registration.handle(() => {
      continuation = runNext();
    });
    await continuation;
  };

  await runNext();
}
