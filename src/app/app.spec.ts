import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { caseLibrary } from './case-library';
import { Home } from './home';
describe('case library', () => {
  it('makes every planned case discoverable', async () => {
    TestBed.configureTestingModule({ imports: [Home], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('.case-card')).toHaveLength(caseLibrary.length);
    expect(element.querySelector('a[href="react/"]')?.textContent).toContain('React · Next.js');
    expect(element.textContent).toContain('Understand the');
  });
  it('shows the registered case count in the hero and library heading', async () => {
    TestBed.configureTestingModule({ imports: [Home], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.hero-copy')?.textContent).toContain(
      `${caseLibrary.length} small debugging case studies.`,
    );
    expect(element.querySelector('.case-total')?.textContent).toBe(
      `${caseLibrary.length} cases / one clear approach`,
    );
  });
  it('renders the application navigation', async () => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('nav').textContent).toContain('Case library');
  });
});
