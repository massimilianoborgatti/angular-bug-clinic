import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { BrokenDialog } from './broken-dialog';
import { FixedDialog } from './fixed-dialog';
// jsdom has no browser top layer. Only stub its native primitives; browser tests exercise real modality.
const originalShow = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close');
beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    },
  });
});
afterEach(() => {
  TestBed.resetTestingModule();
  if (originalShow) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShow);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
  vi.restoreAllMocks();
});
const variants: { name: string; component: Type<BrokenDialog | FixedDialog>; broken: boolean }[] = [
  { name: 'Broken', component: BrokenDialog, broken: true },
  { name: 'Fixed', component: FixedDialog, broken: false },
];
async function setup(component: Type<BrokenDialog | FixedDialog>) {
  TestBed.configureTestingModule({ imports: [component] });
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  const root = fixture.nativeElement as HTMLElement;
  const trigger = root.querySelector<HTMLButtonElement>('button')!;
  trigger.focus();
  trigger.click();
  await fixture.whenStable();
  expect(fixture.componentInstance.opened()).toBe(true);
  return {
    fixture,
    root,
    trigger,
    panel: root.querySelector<HTMLElement>('[data-testid="contact-dialog"]')!,
  };
}
for (const variant of variants)
  describe('08 ' + variant.name, () => {
    it('moves focus into the dialog', { fails: variant.broken }, async () => {
      const { panel } = await setup(variant.component);
      expect(panel.contains(document.activeElement)).toBe(true);
    });
    it('closes on Escape and restores trigger focus', { fails: variant.broken }, async () => {
      const { fixture, root, panel, trigger } = await setup(variant.component);
      panel.querySelector<HTMLInputElement>('input')!.focus();
      panel.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      );
      await fixture.whenStable();
      expect(fixture.componentInstance.opened()).toBe(false);
      expect(document.activeElement).toBe(trigger);
      expect(root.querySelector('dialog[open]')).toBeNull();
    });
    it('restores focus after Cancel', { fails: variant.broken }, async () => {
      const { fixture, panel, trigger } = await setup(variant.component);
      const cancel = [...panel.querySelectorAll('button')].find(
        (button) => button.textContent?.trim() === 'Cancel',
      )!;
      cancel.focus();
      cancel.click();
      await fixture.whenStable();
      expect(fixture.componentInstance.opened()).toBe(false);
      expect(document.activeElement).toBe(trigger);
    });
    it('provides a dialog role and accessible title', { fails: variant.broken }, async () => {
      const { root, panel } = await setup(variant.component);
      expect(panel.matches('dialog,[role="dialog"]')).toBe(true);
      expect(root.querySelector('#' + panel.getAttribute('aria-labelledby'))?.textContent).toBe(
        'Edit contact',
      );
    });
  });
it('Broken explicitly keeps focus behind the unnamed overlay and ignores Escape', async () => {
  const { fixture, panel, trigger } = await setup(BrokenDialog);
  expect(document.activeElement).toBe(trigger);
  expect(panel.getAttribute('aria-labelledby')).toBeNull();
  expect(panel.querySelector('[data-testid="close-contact"]')?.tagName).toBe('DIV');
  panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await fixture.whenStable();
  expect(fixture.componentInstance.opened()).toBe(true);
});
it('Fixed cycles boundary focus and supports the named close button', async () => {
  const { fixture, panel, trigger } = await setup(FixedDialog);
  const focusable = [...panel.querySelectorAll<HTMLElement>('button,input')];
  focusable.at(-1)!.focus();
  panel.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
  );
  expect(document.activeElement).toBe(focusable[0]);
  panel.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }),
  );
  expect(document.activeElement).toBe(focusable.at(-1));
  (panel.querySelector('[aria-label="Close edit contact"]') as HTMLButtonElement).click();
  await fixture.whenStable();
  expect(document.activeElement).toBe(trigger);
});
