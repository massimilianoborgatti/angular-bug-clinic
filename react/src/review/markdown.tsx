import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
export function ReportMarkdown({ text }: { text: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        h3: ({ children }) => (
          <h3
            id={String(children)
              .match(/^F\d\d/)?.[0]
              .toLowerCase()}
          >
            {children}
          </h3>
        ),
        table: ({ children }) => (
          <div className="report-table" role="region" aria-label="Findings table" tabIndex={0}>
            <table>{children}</table>
          </div>
        ),
      }}
    >
      {text}
    </Markdown>
  );
}
