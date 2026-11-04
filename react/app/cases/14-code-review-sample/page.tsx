import { ReviewClinic } from '../../../src/review/clinic';
import { ReportMarkdown } from '../../../src/review/markdown';
import { ownerSummary, readReport } from '../../../src/review/report';
export default async function Page() {
  const text = await readReport();
  return <ReviewClinic summary={<ReportMarkdown text={ownerSummary(text)} />} />;
}
