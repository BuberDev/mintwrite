import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  jsonb,
  unique,
  primaryKey,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// --- USERS ---
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk or MW ID
  email: text("email").notNull().unique(),
  emailNormalized: text("email_normalized").notNull().unique(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  tier: text("tier").notNull().default("free"),
  generationsUsedThisMonth: integer("generations_used_this_month").notNull().default(0),
  lastResetDate: timestamp("last_reset_date", { withTimezone: true }).notNull().defaultNow(),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  disabledAt: timestamp("disabled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  tierCheck: check("users_tier_check", sql`${table.tier} IN ('free', 'pro', 'agency')`),
}));

// --- AUTH: Password Credentials ---
export const passwordCredentials = pgTable("password_credentials", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  passwordHash: text("password_hash").notNull(),
  passwordUpdatedAt: timestamp("password_updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- AUTH: OAuth Accounts ---
export const oauthAccounts = pgTable("oauth_accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  providerEmail: text("provider_email"),
  providerEmailNormalized: text("provider_email_normalized"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  providerUnique: unique().on(table.provider, table.providerAccountId),
  userProviderUnique: unique().on(table.userId, table.provider),
}));

// --- AUTH: Sessions ---
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- BILLING ---
export const billing = pgTable("billing", {
  ownerId: text("owner_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  plan: text("plan").notNull().default("free"),
  cycle: text("cycle"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeSessionId: text("stripe_session_id"),
  stripeInvoiceId: text("stripe_invoice_id"),
  stripeInvoiceUrl: text("stripe_invoice_url"),
  stripeStatus: text("stripe_status"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  planCheck: check("billing_plan_check", sql`${table.plan} IN ('free', 'pro', 'agency')`),
  cycleCheck: check("billing_cycle_check", sql`${table.cycle} IN ('monthly', 'annual')`),
}));

// --- AGENCY: Workspaces ---
export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- AGENCY: Workspace Members ---
export const workspaceMembers = pgTable("workspace_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"), // admin | member | viewer
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  roleCheck: check("workspace_members_role_check", sql`${table.role} IN ('admin', 'member', 'viewer')`),
  memberUnique: unique().on(table.workspaceId, table.userId),
}));

// --- AGENCY: Workspace Invites ---
export const workspaceInvites = pgTable("workspace_invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  invitedByUserId: text("invited_by_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role").notNull().default("member"),
  token: text("token").notNull().unique(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- AGENCY: Brand Voices ---
export const brandVoices = pgTable("brand_voices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  samples: text("samples").array().notNull().default(sql`ARRAY[]::text[]`),
  analysis: jsonb("analysis"), // { tone: string[], style: string[], keywords: string[], examples: string[] }
  isAnalyzed: boolean("is_analyzed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- APP: Projects ---
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  ticker: text("ticker").notNull(),
  category: text("category").notNull(),
  tagline: text("tagline").notNull(),
  website: text("website"),
  twitter: text("twitter"),
  discord: text("discord"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- APP: Generations ---
export const generations = pgTable("generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  projectName: text("project_name").notNull(),
  contentTypeId: text("content_type_id").notNull(),
  contentTypeLabel: text("content_type_label").notNull(),
  context: jsonb("context").notNull(),
  output: text("output").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- RELATIONS ---

export const usersRelations = relations(users, ({ many, one }) => ({
  projects: many(projects),
  generations: many(generations),
  billing: one(billing, {
    fields: [users.id],
    references: [billing.ownerId],
  }),
  oauthAccounts: many(oauthAccounts),
  sessions: many(sessions),
  workspaceMemberships: many(workspaceMembers),
  brandVoices: many(brandVoices),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  members: many(workspaceMembers),
  invites: many(workspaceInvites),
  projects: many(projects),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceMembers.userId],
    references: [users.id],
  }),
}));

export const workspaceInvitesRelations = relations(workspaceInvites, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceInvites.workspaceId],
    references: [workspaces.id],
  }),
  invitedBy: one(users, {
    fields: [workspaceInvites.invitedByUserId],
    references: [users.id],
  }),
}));

export const brandVoicesRelations = relations(brandVoices, ({ one }) => ({
  user: one(users, {
    fields: [brandVoices.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [brandVoices.projectId],
    references: [projects.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  generations: many(generations),
  brandVoices: many(brandVoices),
}));

export const generationsRelations = relations(generations, ({ one }) => ({
  user: one(users, {
    fields: [generations.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [generations.projectId],
    references: [projects.id],
  }),
}));

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, {
    fields: [oauthAccounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
