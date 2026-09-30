-- Radix Auto-Patch: Fast Concurrent Indexing
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_lookup ON users(email);
