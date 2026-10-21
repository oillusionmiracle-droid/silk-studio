import test from 'node:test';
import assert from 'node:assert/strict';
import { searchSite } from '../lib/service-search';
test('print search opens the configured order, without a client price', () => {
 const result = searchSite('business cards')[0];
 assert.equal(result.title,'Business Cards');
 const url = new URL(result.href,'https://example.com');
 assert.equal(url.pathname,'/order'); assert.equal(url.searchParams.get('category'),'Print'); assert.equal(url.searchParams.get('service'),'Business Cards'); assert.equal(url.searchParams.has('price'),false);
});
test('search includes Moremi, applications, creative briefs and studio', () => {
 assert.ok(searchSite('moremi').some(r=>r.href==='/moremi'));
 assert.ok(searchSite('splithouse').some(r=>r.href.includes('project=splithouse')));
 assert.ok(searchSite('ugc ads').some(r=>r.href.includes('brief=')));
 assert.ok(searchSite('studio').some(r=>r.href==='/studio'));
 assert.equal(searchSite('zzzzzzunknown').length,0);
});

test('website services open the website brief while projects remain searchable', () => {
 for (const term of ['Landing Page', 'Business Website', 'E-commerce', 'Event Page']) {
  const result = searchSite(term).find(r => r.title === term)!;
  const url = new URL(result.href, 'https://example.com');
  assert.equal(url.pathname, '/');
  assert.equal(url.searchParams.get('brief'), 'Website or app');
 }
 assert.ok(searchSite('party crashers').some(r => r.href === '/portfolio?project=party-crashers'));
 assert.ok(searchSite('rabbithole').some(r => r.href === '/portfolio?project=rabbithole'));
});
