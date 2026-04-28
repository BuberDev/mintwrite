/**
 * Global Test Setup
 *
 * Sets baseline environment variables so that modules requiring
 * process.env don't throw during import-time checks.
 * These are intentionally fake values – tests never hit real services.
 */

process.env.POSTGRES_URL = "postgresql://test:test@localhost:5432/mintwrite_test";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/mintwrite_test";
process.env.AUTH_SESSION_SECRET = "test-session-secret-that-is-long-enough-for-crypto";
process.env.STRIPE_SECRET_KEY = "sk_test_fake_key_for_testing";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_fake_secret";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.OPENROUTER_API_KEY = "sk-or-test-fake-key-for-testing";
process.env.STRIPE_PRO_MONTHLY_PRICE_ID = "price_pro_monthly_test";
process.env.STRIPE_PRO_ANNUAL_PRICE_ID = "price_pro_annual_test";
process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID = "price_agency_monthly_test";
process.env.STRIPE_AGENCY_ANNUAL_PRICE_ID = "price_agency_annual_test";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-google-client-secret";
