import { DOCUMENT } from '@angular/common';
import { Directive, inject, OnDestroy, signal } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { dispatchIonicBack } from './dispatch-ionic-back';

@Directive()
export abstract class BackButtonDemo implements OnDestroy {
  private readonly platform = inject(Platform);
  private readonly document = inject(DOCUMENT);
  private readonly navigation: Subscription;

  readonly page = signal('Task details');
  readonly navigations = signal(0);
  readonly modalOpen = signal(false);
  readonly dispatching = signal(false);
  readonly outcome = signal('Open the task notes, then press back.');

  readonly navigationPriority: number;

  protected constructor(navigationPriority: number) {
    this.navigationPriority = navigationPriority;
    this.navigation = this.platform.backButton.subscribeWithPriority(navigationPriority, () => {
      this.page.set('Task list');
      this.navigations.update((count) => count + 1);
      this.outcome.set('The page underneath handled the back press.');
    });
  }

  openModal(): void {
    this.page.set('Task details');
    this.navigations.set(0);
    this.outcome.set('Task notes are open. The underlying page is Task details.');
    this.modalOpen.set(true);
  }

  modalDismissed(): void {
    this.modalOpen.set(false);
    this.outcome.set('Task notes closed. Underlying page: ' + this.page() + '.');
  }

  async pressBack(): Promise<void> {
    this.dispatching.set(true);
    try {
      await dispatchIonicBack(this.document);
    } finally {
      this.dispatching.set(false);
    }
  }

  ngOnDestroy(): void {
    this.navigation.unsubscribe();
  }
}
