-- Add latitude and longitude columns to nonprofit_orgs table
ALTER TABLE nonprofit_orgs 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8);

