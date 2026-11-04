export default function Page() {
  return (
    <main>
      <p className="sample-notice">
        Fictional app, sample report. Not a security certification or penetration test
      </p>
      <h1>Northwind Notes</h1>
      <p>
        Local-only code sample with in-memory notes and a fixed demo identity. Nothing here is a
        production sign-in system.
      </p>
      <nav aria-label="Sample variants">
        <a href="/broken/">Open Broken</a>
        <a href="/fixed/">Open Fixed</a>
      </nav>
    </main>
  );
}
