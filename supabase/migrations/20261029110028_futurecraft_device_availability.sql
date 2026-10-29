-- Backward compatible: old registrations and older clients may omit device information.
alter table public.futurecraft_genesis_registrations add column if not exists device_availability text check (device_availability in ('phone','computer','both','shared'));
alter table public.futurecraft_genesis_registrations alter column experience drop not null;
