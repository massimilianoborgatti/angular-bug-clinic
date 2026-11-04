'use client';
import { useState, type ReactNode } from 'react';
import type { Note } from './notes';
type Props = {
  variant: string;
  notes: Note[];
  selected: Note | null;
  query: string;
  setQuery: (text: string) => void;
  title: string;
  setTitle: (text: string) => void;
  body: string;
  setBody: (text: string) => void;
  snapshot: string;
  openNote: (id: string) => void;
  create: () => void;
  renderBody: (body: string) => ReactNode;
  loading?: boolean;
  error?: string;
  retry?: () => void;
  message: string;
  marker?: string;
};
export function NotesFrame(p: Props) {
  const [noteId, setNoteId] = useState('red-note');
  return (
    <main>
      <p className="sample-notice">
        Fictional app, sample report. Not a security certification or penetration test
      </p>
      <header>
        <p className="eyebrow">LOCAL SAMPLE / {p.variant.toUpperCase()}</p>
        <h1>Northwind Notes</h1>
        <p>Demo identity: a member of Blue team only. Data lasts for this local process.</p>
        <nav aria-label="Sample variants">
          <a href="/broken/">Broken</a>
          <a href="/fixed/">Fixed</a>
        </nav>
      </header>
      {p.marker && <p className="marker">Demo connection marker: {p.marker}</p>}
      <div className="workspace">
        <section aria-label="Find notes">
          <h2>Team notes</h2>
          <label>
            Search notes
            <input type="search" value={p.query} onChange={(e) => p.setQuery(e.target.value)} />
          </label>
          {p.loading && <p role="status">Loading notes…</p>}
          {p.error && (
            <div role="alert">
              <p>{p.error}</p>
              <button onClick={p.retry}>Try again</button>
            </div>
          )}
          {!p.loading && !p.error && (
            <ul data-testid="note-list">
              {p.notes.map((note) => (
                <li key={note.id}>
                  <button onClick={() => p.openNote(note.id)}>{note.title}</button>
                </li>
              ))}
            </ul>
          )}
          {!p.loading && !p.error && !p.notes.length && <p>No notes found.</p>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              p.openNote(noteId);
            }}
          >
            <label>
              Open note by ID
              <input value={noteId} onChange={(e) => setNoteId(e.target.value)} />
            </label>
            <button type="submit">Open note</button>
          </form>
        </section>
        <section aria-label="Selected note">
          <h2>Read and share</h2>
          {p.selected ? (
            <article>
              <h3>{p.selected.title}</h3>
              <p className="team">Team: {p.selected.teamId}</p>
              {p.renderBody(p.selected.body)}
              <a href={'/' + p.variant + '/?note=' + encodeURIComponent(p.selected.id)}>
                Team-only share link
              </a>
            </article>
          ) : (
            <p>Select a note. A shared link keeps the same access rules.</p>
          )}
        </section>
        <section aria-label="New note">
          <h2>Write a note</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              p.create();
            }}
          >
            <label>
              Title
              <input value={p.title} onChange={(e) => p.setTitle(e.target.value)} />
            </label>
            <label>
              Body
              <textarea rows={4} value={p.body} onChange={(e) => p.setBody(e.target.value)} />
            </label>
            <button type="submit">Save note</button>
          </form>
          <p role="status">{p.message}</p>
          <p>
            In-memory draft snapshot: <span data-testid="draft-snapshot">{p.snapshot}</span>
          </p>
        </section>
      </div>
    </main>
  );
}
