-- Fix/Update Cloudinary Storage Provider
-- This script ensures the Cloudinary provider is properly configured

-- First, delete any existing Cloudinary providers to start fresh
DELETE FROM storage_providers WHERE type = 'cloudinary';

-- Insert the Cloudinary provider with correct configuration
INSERT INTO storage_providers (
  name,
  type,
  "isActive",
  priority,
  configuration,
  description,
  "isHealthy",
  metadata
) VALUES (
  'Default Cloudinary',
  'cloudinary',
  true,  -- ACTIVE
  1,     -- HIGHEST PRIORITY
  '{
    "cloudName": "dj9bj1msx",
    "apiKey": "124424559743858",
    "apiSecret": "W1sd37LG2zXhuFzP5EIWhrgPMX4",
    "defaultFolder": "pairova"
  }'::jsonb,
  'Default Cloudinary storage provider for Pairova',
  true,  -- HEALTHY
  '{
    "createdBy": "manual-fix",
    "isDefault": true
  }'::jsonb
);

-- Verify the provider was created
SELECT 
  id,
  name,
  type,
  "isActive",
  priority,
  "isHealthy",
  configuration
FROM storage_providers
WHERE type = 'cloudinary';












