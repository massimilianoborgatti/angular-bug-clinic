import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { Home } from './home';
describe('case library', () => {
  it('makes every planned case discoverable', async () => {
    TestBed.configureTestingModule({ imports: [Home], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('.case-card')).toHaveLength(6);
    expect(element.querySelector('a[href="react/"]')?.textContent).toContain('React · Next.js');
    expect(element.textContent).toContain('Understand the');
  });
  it('renders the application navigation', async () => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('nav').textContent).toContain('Case library');
  });
});
