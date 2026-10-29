import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { newsletterWelcomeEmail, newsletterWelcomeText, genesisConfirmationEmail, genesisWelcomeEmail } from '../lib/futurecraft/emails';

test('newsletter retries preserve welcome state and opt-outs, and the list stays private',async()=>{
 const db=new PGlite();
 try{
  await db.exec('create role anon; create role authenticated;');
  await db.exec(readFileSync('supabase/migrations/20261028_futurecraft_newsletter.sql','utf8'));
  const migration=readFileSync('supabase/migrations/20261029162108_futurecraft_newsletter_delivery.sql','utf8');
  await db.exec(migration);await db.exec(migration);
  await db.exec("insert into futurecraft_newsletter_subscribers(email) values ('maker@example.invalid');");
  const before=await db.query("select unsubscribe_token from futurecraft_newsletter_subscribers");
  await db.exec("update futurecraft_newsletter_subscribers set welcome_sent_at=now(),unsubscribed_at=now();");
  await db.exec("insert into futurecraft_newsletter_subscribers(email,subscribed_at) values ('maker@example.invalid',now()) on conflict(email) do nothing;");
  const result=await db.query<{unsubscribe_token:string;sent:boolean;opted_out:boolean}>("select unsubscribe_token,welcome_sent_at is not null as sent,unsubscribed_at is not null as opted_out from futurecraft_newsletter_subscribers");
  assert.equal(result.rows.length,1);assert.equal(result.rows[0].sent,true);assert.equal(result.rows[0].opted_out,true);
  assert.equal(result.rows[0].unsubscribe_token,(before.rows[0] as any).unsubscribe_token);
  await db.exec('set role anon;');
  await assert.rejects(db.query('select * from futurecraft_newsletter_subscribers'),/permission denied/);
 }finally{await db.close();}
});

test('emails distinguish newsletter from registration, escape personalisation and avoid unconfirmed schedules',()=>{
 const url='https://www.silkstudios.com.ng/api/futurecraft/newsletter/unsubscribe?token=123&sample=true';
 const html=newsletterWelcomeEmail(url);
 assert.ok(html.includes('token=123&amp;sample=true'));
 assert.match(html,/does not register you for Genesis/);assert.match(newsletterWelcomeText(url),/Unsubscribe:/);
 for(const html of [genesisWelcomeEmail('<script>'),genesisConfirmationEmail('<script>')]){
  assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('unsplash'));assert.ok(!html.includes('two-hour'));
 }
});
