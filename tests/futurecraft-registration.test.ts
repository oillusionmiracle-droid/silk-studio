import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

test('device migration supports short signup and legacy registrations without exposing learner data',async()=>{
 const db=new PGlite();
 try{
  await db.exec('create role anon; create role authenticated;');
  await db.exec(readFileSync('supabase/migrations/20261028_futurecraft_genesis.sql','utf8'));
  await db.exec("insert into futurecraft_genesis_registrations(name,email,experience,interest,consent_at) values ('Earlier Maker','earlier@example.invalid','exploring','design',now());");
  const migration=readFileSync('supabase/migrations/20261029110028_futurecraft_device_availability.sql','utf8');
  await db.exec(migration);await db.exec(migration);
  await db.exec("insert into futurecraft_genesis_registrations(name,email,interest,device_availability,consent_at) values ('Phone Maker','phone@example.invalid','automation','phone',now());");
  const {rows}=await db.query<{experience:string|null;device_availability:string|null}>("select experience,device_availability from futurecraft_genesis_registrations where email='phone@example.invalid'");
  assert.deepEqual(rows,[{experience:null,device_availability:'phone'}]);
  await assert.rejects(db.exec("insert into futurecraft_genesis_registrations(name,email,interest,device_availability,consent_at) values ('Other Maker','bad@example.invalid','design','invalid',now());"),/check constraint/);
  await db.exec('set role anon;');
  await assert.rejects(db.query('select * from futurecraft_genesis_registrations'),/permission denied/);
 }finally{await db.close();}
});
