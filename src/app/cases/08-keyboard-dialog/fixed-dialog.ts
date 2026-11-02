import {
  Component,
  HostListener,
  ChangeDetectionStrategy,
  ElementRef,
  viewChild,
  OnDestroy,
} from '@angular/core';
import { ContactEditor } from './contact-editor';
@Component({
  selector: 'clinic-fixed-dialog',
  templateUrl: './fixed-dialog.html',
  styleUrl: './dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FixedDialog extends ContactEditor implements OnDestroy {
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly firstField = viewChild.required<ElementRef<HTMLInputElement>>('firstField');
  private opener?: HTMLButtonElement;
  open(trigger: HTMLButtonElement) {
    this.opener = trigger;
    this.begin();
    this.opened.set(true);
    this.dialog().nativeElement.showModal();
    this.firstField().nativeElement.focus();
  }
  close(event?: Event) {
    event?.preventDefault();
    this.dialog().nativeElement.close();
    this.opened.set(false);
    this.opener?.focus();
  }
  @HostListener('keydown', ['$event'])
  onKey(event: KeyboardEvent) {
    if (!this.opened()) return;
    if (event.key === 'Escape') {
      this.close(event);
      return;
    }
    if (event.key !== 'Tab') return;
    const fields = [
      ...this.dialog().nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]),input:not([disabled])',
      ),
    ];
    const first = fields[0],
      last = fields[fields.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  ngOnDestroy() {
    if (this.dialog().nativeElement.open) this.dialog().nativeElement.close();
  }
}
