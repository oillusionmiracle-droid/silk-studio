-- Retired: this historical script recreated permissive order policies.
-- Apply versioned migrations instead. See docs/security-rollout.md.
DO $$ BEGIN RAISE EXCEPTION 'Legacy setup retired. Use versioned migrations; see docs/security-rollout.md'; END $$;
