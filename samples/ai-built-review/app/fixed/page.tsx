import { Suspense } from 'react';
import { NotesClient } from '../../fixed/notes-client';
export default function Page() {
  return (
    <Suspense fallback={<p>Opening notes…</p>}>
      <NotesClient />
    </Suspense>
  );
}
