import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BrokenBackButton } from './broken/broken-back-button';
import { FixedBackButton } from './fixed/fixed-back-button';
import { BackButtonDemo } from './shared/back-button-demo';

type BackHandler = (next: () => void) => void | Promise<unknown>;

class MockBackButton {
  private sequence = 0;
  private readonly handlers = new Map<number, { priority: number; run: BackHandler }>();

  subscribeWithPriority(priority: number, run: BackHandler): Subscription {
    const key = this.sequence++;
    this.handlers.set(key, { priority, run });
    return new Subscription(() => this.handlers.delete(key));
  }

  get size(): number {
    return this.handlers.size;
  }

  async press(): Promise<void> {
    const handlers = [...this.handlers.entries()].sort(
      ([leftKey, left], [rightKey, right]) => right.priority - left.priority || rightKey - leftKey,
    );
    const processNext = async (): Promise<void> => {
      const current = handlers.shift();
      if (!current) return;
      let continuation: Promise<void> | undefined;
      await current[1].run(() => {
        continuation = processNext();
      });
      await continuation;
    };
    await processNext();
  }
}

const implementations: { name: string; component: Type<BackButtonDemo>; broken: boolean }[] = [
  { name: 'Broken', component: BrokenBackButton, broken: true },
  { name: 'Fixed', component: FixedBackButton, broken: false },
];

for (const implementation of implementations) {
  describe('case 05: ' + implementation.name, () => {
    let backButton: MockBackButton;
    let fixture: ComponentFixture<BackButtonDemo>;

    beforeEach(() => {
      backButton = new MockBackButton();
      TestBed.configureTestingModule({
        imports: [implementation.component],
        providers: [{ provide: Platform, useValue: { backButton } }],
      });
      TestBed.overrideComponent(implementation.component, {
        set: { imports: [], template: '', styles: [], styleUrls: [], styleUrl: undefined },
      });
      fixture = TestBed.createComponent(implementation.component);
    });

    afterEach(() => {
      fixture.destroy();
      TestBed.resetTestingModule();
    });

    const prove = implementation.broken ? it.fails : it;

    prove('first back closes the overlay and leaves the underlying page unchanged', async () => {
      const component = fixture.componentInstance;
      component.openModal();
      const overlay = backButton.subscribeWithPriority(100, () => {
        component.modalDismissed();
        overlay.unsubscribe();
      });

      await backButton.press();

      expect(component.page()).toBe('Task details');
      expect(component.navigations()).toBe(0);
      expect(component.modalOpen()).toBe(false);
    });

    if (implementation.broken) {
      it('reproduces a navigation underneath an open modal', async () => {
        const component = fixture.componentInstance;
        component.openModal();
        backButton.subscribeWithPriority(100, () => component.modalDismissed());

        await backButton.press();

        expect(component.page()).toBe('Task list');
        expect(component.navigations()).toBe(1);
        expect(component.modalOpen()).toBe(true);
      });
    } else {
      it('navigates only on the second press after the modal has closed', async () => {
        const component = fixture.componentInstance;
        component.openModal();
        const overlay = backButton.subscribeWithPriority(100, () => {
          component.modalDismissed();
          overlay.unsubscribe();
        });

        await backButton.press();
        await backButton.press();

        expect(component.modalOpen()).toBe(false);
        expect(component.page()).toBe('Task list');
        expect(component.navigations()).toBe(1);
      });

      it('releases its navigation handler when the component is destroyed', () => {
        expect(backButton.size).toBe(1);
        fixture.destroy();
        expect(backButton.size).toBe(0);
      });
    }
  });
}
