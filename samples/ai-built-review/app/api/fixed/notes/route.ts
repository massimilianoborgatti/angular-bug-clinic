import { api } from '../../../../fixed/notes';
import { handlers } from '../../../../shared/http';
export const dynamic = 'force-dynamic';
export const { GET, POST } = handlers(api);
