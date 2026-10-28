import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, tap, timer } from 'rxjs';
import { UsernameDemo, UsernameDirectory, USERNAME_DEMO_TEMPLATE } from '../shared/username-demo';

@Component({
  selector: 'clinic-fixed-username',
  imports: [ReactiveFormsModule],
  providers: [UsernameDirectory],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: USERNAME_DEMO_TEMPLATE,
})
export class FixedUsername extends UsernameDemo implements OnInit {
  ngOnInit(): void {
    this.username.valueChanges
      .pipe(
        tap(() => this.pending.set(true)),
        // Cancel immediately when the value changes, including the debounce window.
        switchMap((value) => timer(80).pipe(switchMap(() => this.directory.check(value)))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => this.apply(result));
  }
}
