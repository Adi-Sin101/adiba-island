import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "radio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"title" varchar DEFAULT 'Dard-e-Disco · Om Shanti Om',
  	"youtube_url" varchar DEFAULT 'https://www.youtube.com/watch?v=cKs83ZQxYKA',
  	"audio_id" integer,
  	"volume" numeric DEFAULT 15,
  	"waves" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "radio" ADD CONSTRAINT "radio_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "radio_audio_idx" ON "radio" USING btree ("audio_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "radio" CASCADE;`)
}
