ALTER TABLE "bucket" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "bucket" ADD CONSTRAINT "bucket_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;