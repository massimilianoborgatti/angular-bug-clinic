import type { Metadata } from 'next';
import { createHash } from 'node:crypto';
import { ReportMarkdown } from '../../../../src/review/markdown';
import { readReport } from '../../../../src/review/report';
import '../../../../src/review/report.css';
export const metadata: Metadata = { title: 'Full sample code review | Bug Clinic' };
export default async function Page() {
  const text = await readReport();
  return (
    <>
      <header className="site-header report-chrome">
        <a className="brand" href="/angular-bug-clinic/#/">
          + Angular <strong>Bug Clinic</strong>
        </a>
        <nav aria-label="Report navigation">
          <a href="/angular-bug-clinic/react/cases/14-code-review-sample/">Case 14 summary</a>
          <a href="/angular-bug-clinic/#/">Case library</a>
        </nav>
      </header>
      <main className="report-document">
        <div className="report-actions">
          <a href="/angular-bug-clinic/react/cases/14-code-review-sample/">← Back to the case</a>
          <a href="/angular-bug-clinic/react/case-14/code-review-sample.pdf">Download the PDF ↓</a>
          <a href="https://github.com/massimilianoborgatti/angular-bug-clinic/blob/main/docs/samples/code-review-sample.md">
            Markdown source ↗
          </a>
        </div>
        <article
          className="report-content"
          data-source-sha256={createHash('sha256').update(text).digest('hex')}
        >
          {text.split(/(?=^### F\d\d)|(?=^## Positive notes)/m).map((part, index) => (
            <section
              key={index}
              className={
                part.startsWith('### F')
                  ? 'report-finding'
                  : part.startsWith('## Positive notes')
                    ? 'report-conclusion'
                    : undefined
              }
            >
              <ReportMarkdown text={part} />
            </section>
          ))}
        </article>
        <p className="print-note">
          Web and PDF use the same Markdown report. PDF page numbers are added during printing.
        </p>
      </main>
    </>
  );
}
