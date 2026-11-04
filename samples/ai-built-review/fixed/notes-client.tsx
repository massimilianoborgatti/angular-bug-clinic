'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Note } from '../shared/notes';
import { NotesFrame } from '../shared/notes-frame';
import { NoteBody } from './note-body';
export function NotesClient() {
  const [notes, setNotes] = useState<Note[]>([]),
    [selected, setSelected] = useState<Note | null>(null);
  const [query, setQuery] = useState(''),
    [title, setTitle] = useState('New note'),
    [body, setBody] = useState('First draft');
  const [snapshot, setSnapshot] = useState(''),
    [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [retry, setRetry] = useState(0);
  const [opened, setOpened] = useState<{ id: string | null; version: number }>({
    id: null,
    version: 0,
  });
  const fromLink = useSearchParams().get('note');
  const requested = opened.id ?? fromLink;
  useEffect(() => {
    const controller = new AbortController();
    let current = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/fixed/notes?q=' + encodeURIComponent(query), {
          signal: controller.signal,
        });
        if (!response.ok) throw Error('Could not load notes. Try again.');
        const data = await response.json();
        if (current) setNotes(data.notes);
      } catch (error) {
        if (current)
          setError(error instanceof Error ? error.message : 'Could not load notes. Try again.');
      } finally {
        if (current) setLoading(false);
      }
    }, 250);
    return () => {
      current = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, retry]);
  useEffect(() => {
    if (!requested) return;
    const controller = new AbortController();
    fetch('/api/fixed/notes?id=' + encodeURIComponent(requested), { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw Error(data.error);
        if (!controller.signal.aborted) {
          setSelected(data.note);
          setError('');
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setSelected(null);
          setError(error instanceof Error ? error.message : 'Could not open the note.');
        }
      });
    return () => controller.abort();
  }, [requested, opened.version]);
  function openNote(id: string) {
    setSelected(null);
    setError('');
    setOpened((previous) => ({ id, version: previous.version + 1 }));
  }
  useEffect(() => {
    const timer = setTimeout(() => setSnapshot(body), 1000);
    return () => clearTimeout(timer);
  }, [body]);
  async function create() {
    setMessage('Saving…');
    try {
      const response = await fetch('/api/fixed/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      setSelected(data.note);
      setMessage('Saved.');
      setRetry((value) => value + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save the note.');
    }
  }
  return (
    <NotesFrame
      variant="fixed"
      notes={notes}
      selected={selected}
      query={query}
      setQuery={(text) => {
        setQuery(text);
        setLoading(true);
      }}
      title={title}
      setTitle={setTitle}
      body={body}
      setBody={setBody}
      snapshot={snapshot}
      openNote={openNote}
      create={create}
      renderBody={(text) => <NoteBody body={text} />}
      message={message}
      loading={loading}
      error={error}
      retry={() => setRetry((value) => value + 1)}
    />
  );
}
