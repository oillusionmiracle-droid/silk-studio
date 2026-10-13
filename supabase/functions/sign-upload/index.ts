import { json, methodCheck } from '../_shared/http.ts';
Deno.serve((req: Request) => methodCheck(req) || json({ error: 'Direct upload signing has been retired. Use the authenticated website upload.' }, 410));
