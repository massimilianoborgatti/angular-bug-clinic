import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { api as broken } from '../../broken/notes';
import { api as fixed } from '../notes';
import { NoteBody as BrokenBody } from '../../broken/note-body';
import { NoteBody as FixedBody } from '../note-body';
import { createStore, demoViewer, NoteError } from '../../shared/notes';
import { handlers } from '../../shared/http';
for (const [name, api, Body] of [
  ['Broken', broken, BrokenBody],
  ['Fixed', fixed, FixedBody],
] as const) {
  describe(name, () => {
    const contract = name === 'Broken' ? it.fails : it;
    contract('rejects another team’s note and excludes it from search', () => {
      const store = createStore();
      expect(() => api.read(store, 'red-note', demoViewer)).toThrow(NoteError);
      expect(api.list(store, '', demoViewer).map((n) => n.id)).not.toContain('red-note');
    });
    contract('renders markup as text rather than active elements', () => {
      const markup = renderToStaticMarkup(<Body body={'<svg onload="void(0)"></svg>'} />);
      expect(markup).not.toContain('<svg');
      expect(markup).toContain('&lt;svg');
    });
    contract('rejects invalid fields without mutating the store', () => {
      const store = createStore();
      expect(() =>
        api.create(store, { title: '', body: '', teamId: 'team-red' }, demoViewer),
      ).toThrow(NoteError);
      expect(store.notes.size).toBe(2);
    });
  });
}
it('Broken explicitly returns cross-team data, renders an SVG and accepts overridden ownership', () => {
  const store = createStore();
  expect(broken.read(store, 'red-note', demoViewer).body).toBe('Red team planning notes.');
  expect(renderToStaticMarkup(<BrokenBody body="<svg></svg>" />)).toContain('<svg>');
  expect(broken.create(store, { title: '', body: '', teamId: 'team-red' }, demoViewer).teamId).toBe(
    'team-red',
  );
});
it.each([
  null,
  [],
  {},
  { title: 4, body: 'x' },
  { title: 'x', body: 4 },
  { title: ' '.repeat(2), body: 'x' },
  { title: 'x'.repeat(81), body: 'x' },
  { title: 'x', body: 'x'.repeat(2001) },
  { title: 'x', body: 'x', id: 'red-note' },
])('Fixed rejects invalid note input %#', (payload) => {
  const store = createStore();
  expect(() => fixed.create(store, payload, demoViewer)).toThrow(NoteError);
  expect(store.notes.size).toBe(2);
});
it('Fixed derives ownership from the trusted viewer, trims input and supports owned team links', () => {
  const store = createStore();
  const note = fixed.create(store, { title: ' Plan ', body: ' Plain text ' }, demoViewer);
  expect(note).toMatchObject({ teamId: 'team-blue', title: 'Plan', body: 'Plain text' });
  expect(fixed.read(store, note.id, demoViewer)).toEqual(note);
  expect(() =>
    fixed.create(store, { title: 'x', body: 'y' }, { id: 'guest', teamIds: [] }),
  ).toThrow(NoteError);
});
it('Fixed HTTP boundary rejects malformed JSON and caller-supplied team claims', async () => {
  const api = handlers(fixed);
  expect(
    (await api.POST(new Request('http://localhost/api', { method: 'POST', body: '{' }))).status,
  ).toBe(400);
  expect(
    (await api.GET(new Request('http://localhost/api?id=red-note&teamId=team-red'))).status,
  ).toBe(403);
  expect((await api.GET(new Request('http://localhost/api?id=missing'))).status).toBe(404);
});
