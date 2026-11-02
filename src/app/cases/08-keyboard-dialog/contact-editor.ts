import { signal } from '@angular/core';
export abstract class ContactEditor {
  readonly opened = signal(false);
  readonly name = signal('Contact 01');
  readonly email = signal('contact@example.test');
  readonly help = signal(false);
  readonly draftName = signal('');
  readonly draftEmail = signal('');
  begin() {
    this.draftName.set(this.name());
    this.draftEmail.set(this.email());
  }
  abstract close(event?: Event): void;
  save(event: Event) {
    event.preventDefault();
    this.name.set(this.draftName());
    this.email.set(this.draftEmail());
    this.close();
  }
}
