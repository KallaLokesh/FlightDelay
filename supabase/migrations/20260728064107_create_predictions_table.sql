/*
# Create flight_predictions table (single-tenant, no auth)

1. New Tables
- `flight_predictions`
  - `id` (uuid, primary key)
  - `airline` (text, IATA carrier code, e.g. "AA")
  - `origin` (text, IATA airport code, e.g. "JFK")
  - `destination` (text, IATA airport code)
  - `flight_date` (date, scheduled departure date)
  - `scheduled_departure` (text, HH:MM 24h)
  - `day_of_week` (integer 0-6, 0 = Sunday)
  - `delay_minutes` (numeric, predicted delay in minutes)
  - `delay_probability` (numeric 0-1, probability of delay > 15 min)
  - `delay_category` (text: on-time | slight | moderate | severe)
  - `top_factors` (jsonb, array of {label, contribution, direction})
  - `created_at` (timestamptz)
2. Security
- Enable RLS on flight_predictions.
- Single-tenant, no sign-in: anon + authenticated full CRUD (shared/public demo data).
*/

CREATE TABLE IF NOT EXISTS flight_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  airline text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  flight_date date NOT NULL,
  scheduled_departure text NOT NULL,
  day_of_week integer NOT NULL,
  delay_minutes numeric NOT NULL DEFAULT 0,
  delay_probability numeric NOT NULL DEFAULT 0,
  delay_category text NOT NULL DEFAULT 'on-time',
  top_factors jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE flight_predictions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_predictions" ON flight_predictions;
CREATE POLICY "anon_select_predictions" ON flight_predictions
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_predictions" ON flight_predictions;
CREATE POLICY "anon_insert_predictions" ON flight_predictions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_predictions" ON flight_predictions;
CREATE POLICY "anon_update_predictions" ON flight_predictions
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_predictions" ON flight_predictions;
CREATE POLICY "anon_delete_predictions" ON flight_predictions
  FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_flight_predictions_created_at
  ON flight_predictions (created_at DESC);
