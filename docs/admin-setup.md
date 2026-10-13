# Silk Studio administrator setup

Read [security rollout](security-rollout.md) before deploying schema or Edge Function changes.

New users always receive the customer role. Administrator access comes only from `public.profiles.role`; an email address or client-side flag is not authorization.

Provision an administrator from the trusted Supabase SQL Editor using the verified user's UUID:

```sql
UPDATE public.profiles SET role='admin' WHERE id='<verified-user-uuid>';
```

Confirm the affected row belongs to the intended user before promotion. Do not promote the first signup automatically. Refresh the user's session/profile after changing the role.

The former `full_schema_setup.sql` has been retired because it restored permissive policies. Use versioned migrations against a verified schema/migration history. The repository is not evidence that functions or secrets are deployed: check the actual Supabase project and logs.

Customer profiles may edit their personal fields; role changes are protected by both RLS and a trigger. The administrator UI submits status changes through `update-order-status`, which authenticates the caller and appends history atomically. Paid/production statuses require a recorded payment (or a pre-existing legacy paid state).
