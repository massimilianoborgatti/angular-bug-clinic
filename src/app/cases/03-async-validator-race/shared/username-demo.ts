import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Observable, timer } from 'rxjs';

export interface Availability {
  username: string;
  taken: boolean;
}

@Injectable()
export class UsernameDirectory {
  private readonly plannedDelays = new Map<string, number>();

  planRace(): void {
    this.plannedDelays.set('taken', 900);
    this.plannedDelays.set('freshname', 120);
  }

  check(username: string): Observable<Availability> {
    const wait = this.plannedDelays.get(username) ?? 120 + Math.floor(Math.random() * 900);
    this.plannedDelays.delete(username);
    return timer(wait).pipe(map(() => ({ username, taken: username === 'taken' })));
  }
}

export abstract class UsernameDemo {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly directory = inject(UsernameDirectory);
  readonly username = new FormControl('', { nonNullable: true });
  readonly pending = signal(false);
  readonly checkedName = signal('');
  readonly responses = signal<string[]>([]);
  readonly raceRunning = signal(false);

  protected apply(result: Availability): void {
    this.username.setErrors(result.taken ? { taken: true } : null);
    this.checkedName.set(result.username);
    this.pending.set(false);
    this.responses.update((entries) => [
      ...entries,
      `${result.username}: ${result.taken ? 'unavailable' : 'available'}`,
    ]);
  }

  reproduceRace(): void {
    if (this.raceRunning()) return;
    this.raceRunning.set(true);
    this.directory.planRace();
    this.responses.set([]);
    this.checkedName.set('');
    this.username.setValue('taken');
    timer(120)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.username.setValue('freshname'));
    timer(1200)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.raceRunning.set(false));
  }
}

export const USERNAME_DEMO_TEMPLATE = `
  <section class="demo-card stack" aria-label="Username availability demo">
    <div class="row"><span class="status">MOCK SIGN-UP FORM</span><span class="muted">Artificial response delays</span></div>
    <label for="username">Choose a username</label>
    <input id="username" type="text" [formControl]="username" autocomplete="off" spellcheck="false" />
    <p class="muted">Try “taken” followed quickly by “freshname”, or use the repeatable race below.</p>
    <button type="button" (click)="reproduceRace()" [disabled]="raceRunning()">Reproduce race</button>
    <div class="comparison">
      <div><span class="metric-label">Current value</span><strong class="metric" data-testid="current-username">{{ username.value || '—' }}</strong></div>
      <div><span class="metric-label">Response applied for</span><strong class="metric" data-testid="checked-username">{{ checkedName() || '—' }}</strong></div>
    </div>
    <p role="status" data-testid="validation-status" [class.danger]="!pending() && username.hasError('taken')" [class.success]="!pending() && checkedName() && !username.hasError('taken')">
      @if (pending()) { Checking availability… }
      @else if (username.hasError('taken')) { Username unavailable }
      @else if (checkedName()) { Username available }
      @else { Enter a username to check availability }
    </p>
    <div class="event-log" aria-label="Applied responses">
      @for (response of responses(); track $index) { <p>{{ response }}</p> }
      @empty { <p class="muted">Responses will appear here.</p> }
    </div>
  </section>
`;
