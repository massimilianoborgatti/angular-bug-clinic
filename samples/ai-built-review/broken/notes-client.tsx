'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Note } from '../shared/notes';
import { NotesFrame } from '../shared/notes-frame';
import { NoteBody } from './note-body';
const apiKey = 'DEMO_KEY_NOT_A_REAL_SECRET';
export function NotesClient() {
  const [notes, setNotes] = useState<Note[]>([]),
    [selected, setSelected] = useState<Note | null>(null);
  const [query, setQuery] = useState(''),
    [title, setTitle] = useState('New note'),
    [body, setBody] = useState('First draft');
  const [snapshot, setSnapshot] = useState(''),
    [message, setMessage] = useState('');
  const requested = useSearchParams().get('note');
  useEffect(() => {
    fetch('/api/broken/notes?q=' + encodeURIComponent(query))
      .then((r) => r.json())
      .then((data) => setNotes(data.notes ?? []));
  }, [query]);
  useEffect(() => {
    if (requested)
      fetch('/api/broken/notes?id=' + encodeURIComponent(requested))
        .then((r) => r.json())
        .then((data) => setSelected(data.note ?? null));
  }, [requested]);
  useEffect(() => {
    const timer = setInterval(() => setSnapshot(body), 1000);
    return () => clearInterval(timer);
  }, []);
  function openNote(id: string) {
    fetch('/api/broken/notes?id=' + encodeURIComponent(id))
      .then((r) => r.json())
      .then((data) => setSelected(data.note ?? null));
  }
  function create() {
    fetch('/api/broken/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    })
      .then((r) => r.json())
      .then((data) => {
        setSelected(data.note);
        setMessage('Saved.');
      });
  }
  const visibleNotes = notes.filter((note) => note.title.includes(query));
  return (
    <NotesFrame
      variant="broken"
      notes={visibleNotes}
      selected={selected}
      query={query}
      setQuery={setQuery}
      title={title}
      setTitle={setTitle}
      body={body}
      setBody={setBody}
      snapshot={snapshot}
      openNote={openNote}
      create={create}
      renderBody={(text) => <NoteBody body={text} />}
      message={message}
      marker={apiKey}
    />
  );
}
