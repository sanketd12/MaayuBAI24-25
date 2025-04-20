import { boolean, pgTable, pgTableCreator, serial, text, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "./auth"
import { relations, sql } from "drizzle-orm";

export const createTable = pgTableCreator((name) => name);

export const buckets = createTable(
    "bucket",
    (d) => ({
      id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
      name: d.varchar({ length: 256 }).notNull(),
      createdAt: d
        .timestamp({ withTimezone: true })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
      updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()).notNull(),
      userId: d.text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    }),
    (t) => [index("bucket_name_idx").on(t.name)],
  );
  
  export const bucketRelations = relations(buckets, ({ many }) => ({
    candidates: many(candidates),
  }));
  
  export const candidates = createTable(
    "candidates",
    (d) => ({
      id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
      name: d.varchar({ length: 256 }).notNull(),
      email: d.varchar({ length: 256 }).notNull(),
      bucketId: d.integer().references(() => buckets.id, { onDelete: 'cascade' }).notNull(),
      resume_file_name: d.varchar({ length: 256 }).notNull(),
      // resume_aws_key: d.varchar({ length: 256 }).notNull(),
      createdAt: d
        .timestamp({ withTimezone: true })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
      updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()).notNull(),
      userId: d.text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    }),
  );
  
  export const candidateRelations = relations(candidates, ({ one }) => ({
    bucket: one(buckets),
  }));
  
  export const jobs = createTable(
    "jobs",
    (d) => ({
      id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
      name: d.varchar({ length: 256 }).notNull(),
      description: d.text().notNull(),
      salary: d.integer().notNull(),
      type: d.text("type", { enum: ["full-time", "part-time", "internship"] }).notNull(),
      work_mode: d.text("work_mode", { enum: ["remote", "hybrid", "office"] }).notNull(),
      location: d.varchar({ length: 256 }).notNull(),
      createdAt: d
        .timestamp({ withTimezone: true })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
      updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()).notNull(),
      status: d.text("status", { enum: ["open", "closed"] }).notNull(),
      selectedCandidateId: d.integer().references(() => candidates.id, { onDelete: 'cascade' }),
      userId: d.text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    }),
    (t) => [index("job_name_idx").on(t.name)],
  );
  
  export const jobRelations = relations(jobs, ({ one }) => ({
    selectedCandidate: one(candidates, {
      // Explicitly define the relationship fields
      fields: [jobs.selectedCandidateId],
      references: [candidates.id]
    }),
  }));
  
  export type Job = typeof jobs.$inferSelect;
  export type Candidate = typeof candidates.$inferSelect;
  export type Bucket = typeof buckets.$inferSelect;