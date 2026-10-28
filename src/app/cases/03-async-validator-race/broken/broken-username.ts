import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UsernameDemo, UsernameDirectory, USERNAME_DEMO_TEMPLATE } from '../shared/username-demo';

@Component({
  selector: 'clinic-broken-username',
  imports: [ReactiveFormsModule],
  providers: [UsernameDirectory],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: USERNAME_DEMO_TEMPLATE,
})
export class BrokenUsername extends UsernameDemo implements OnInit {
  ngOnInit(): void {
    this.username.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.pending.set(true);
      // Each value creates an independent request; an older response can still win.
      this.directory
        .check(value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((result) => this.apply(result));
    });
  }
}
