import { json, methodCheck } from '../_shared/http.ts';
Deno.serve((req: Request) => methodCheck(req) || json({ error: 'Use the protected newsletter form on the website.' }, 410));
