/*
# Create telemetry table for historical air quality + weather data

1. New Tables
- `telemetry` — stores hourly snapshots of pollution + meteorological readings
  from Delhi NCR monitoring stations.
  - `id` (uuid, primary key)
  - `station_id` (text, station identifier)
  - `station_name` (text, human-readable station name)
  - `lat` (numeric, latitude)
  - `lng` (numeric, longitude)
  - `aqi` (int, Air Quality Index)
  - `category` (text, AQI category label)
  - `dominant` (text, dominant pollutant key)
  - `pm25`, `pm10`, `o3`, `nox`, `so2`, `co`, `nh3` (numeric, pollutant concentrations)
  - `temp`, `humidity`, `wind_speed`, `wind_dir`, `pressure`, `visibility`, `pbl_height` (numeric, weather data)
  - `recorded_at` (timestamptz, when the reading was taken)

2. Security
- Enable RLS on `telemetry`.
- This is a single-tenant public portal (no sign-in) — allow anon + authenticated
  to read and insert telemetry so the frontend can both display and persist data.
  Data is intentionally shared/public (it's a government-style public portal).

3. Notes
- Data is appended over time to build historical trends.
- The frontend falls back to mock data if Supabase is unavailable, so this table
  enhances the experience but is not a hard dependency.
*/

CREATE TABLE IF NOT EXISTS telemetry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id text NOT NULL,
  station_name text NOT NULL,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  aqi integer NOT NULL,
  category text NOT NULL,
  dominant text NOT NULL,
  pm25 numeric NOT NULL DEFAULT 0,
  pm10 numeric NOT NULL DEFAULT 0,
  o3 numeric NOT NULL DEFAULT 0,
  nox numeric NOT NULL DEFAULT 0,
  so2 numeric NOT NULL DEFAULT 0,
  co numeric NOT NULL DEFAULT 0,
  nh3 numeric NOT NULL DEFAULT 0,
  temp numeric NOT NULL DEFAULT 0,
  humidity numeric NOT NULL DEFAULT 0,
  wind_speed numeric NOT NULL DEFAULT 0,
  wind_dir numeric NOT NULL DEFAULT 0,
  pressure numeric NOT NULL DEFAULT 0,
  visibility numeric NOT NULL DEFAULT 0,
  pbl_height numeric NOT NULL DEFAULT 0,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

-- Index for time-range queries (historical trends)
CREATE INDEX IF NOT EXISTS idx_telemetry_recorded_at ON telemetry (recorded_at);
CREATE INDEX IF NOT EXISTS idx_telemetry_station_id ON telemetry (station_id);

ALTER TABLE telemetry ENABLE ROW LEVEL SECURITY;

-- Single-tenant public portal: data is intentionally shared
DROP POLICY IF EXISTS "anon_select_telemetry" ON telemetry;
CREATE POLICY "anon_select_telemetry" ON telemetry FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_telemetry" ON telemetry;
CREATE POLICY "anon_insert_telemetry" ON telemetry FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_telemetry" ON telemetry;
CREATE POLICY "anon_update_telemetry" ON telemetry FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_telemetry" ON telemetry;
CREATE POLICY "anon_delete_telemetry" ON telemetry FOR DELETE
TO anon, authenticated USING (true);
