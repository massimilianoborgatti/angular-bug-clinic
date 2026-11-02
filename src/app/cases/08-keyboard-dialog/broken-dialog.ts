import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ContactEditor } from './contact-editor';
@Component({
  selector: 'clinic-broken-dialog',
  templateUrl: './broken-dialog.html',
  styleUrl: './dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrokenDialog extends ContactEditor {
  open(trigger: HTMLButtonElement) {
    void trigger;
    this.begin();
    this.opened.set(true);
  }
  close() {
    (document.activeElement as HTMLElement | null)?.blur();
    this.opened.set(false);
  }
}
