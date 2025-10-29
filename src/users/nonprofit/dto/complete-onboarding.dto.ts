import { IsString, IsOptional, IsDateString, IsEmail, IsUrl, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for complete NGO onboarding - collects ALL data from all 7 steps
 */
export class CompleteOnboardingDto {
  // ============================================
  // STEP 1: Account Info
  // ============================================
  @ApiProperty({ example: 'Save the Children Foundation', description: 'Organization name' })
  @IsString()
  orgName: string;

  @ApiProperty({ example: 'NG', description: 'Country code (ISO 3166-1 alpha-2)' })
  @IsString()
  country: string;

  @ApiPropertyOptional({ description: 'Organization logo URL (after upload)' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  // ============================================
  // STEP 2: Company Information
  // ============================================
  @ApiPropertyOptional({ example: 'contact@organization.org', description: 'Contact email' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiProperty({ example: '+234 800 000 0000', description: 'Phone number' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: '2010-01-15', description: 'Date organization was founded' })
  @IsOptional()
  @IsDateString()
  foundedOn?: string;

  @ApiProperty({ example: 'NGO', description: 'Organization type' })
  @IsString()
  orgType: string;

  @ApiProperty({ example: 'Social Services', description: 'Industry/sector' })
  @IsString()
  industry: string;

  @ApiProperty({ example: '51-200', description: 'Organization size' })
  @IsString()
  sizeLabel: string;

  @ApiPropertyOptional({ example: 'https://www.organization.org', description: 'Website URL' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ example: 'REG-123456', description: 'Registration number' })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  // ============================================
  // STEP 3: Address
  // ============================================
  @ApiProperty({ example: 'Nigeria', description: 'Country name' })
  @IsString()
  addressCountry: string;

  @ApiProperty({ example: 'Lagos', description: 'State/Province' })
  @IsString()
  state: string;

  @ApiProperty({ example: 'Ikeja', description: 'City' })
  @IsString()
  city: string;

  @ApiProperty({ example: '123 Main Street', description: 'Street address line 1' })
  @IsString()
  addressLine1: string;

  @ApiPropertyOptional({ example: 'Suite 456', description: 'Street address line 2' })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiPropertyOptional({ example: '100001', description: 'Postal/ZIP code' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  // ============================================
  // STEP 4: Bio
  // ============================================
  @ApiProperty({ 
    example: 'We are a leading organization dedicated to improving lives...', 
    description: 'Organization bio (max 150 words)' 
  })
  @IsString()
  bio: string;

  // ============================================
  // STEP 5: Mission Statement
  // ============================================
  @ApiProperty({ 
    example: 'Our mission is to empower communities through education and healthcare...', 
    description: 'Mission statement (max 150 words)' 
  })
  @IsString()
  missionStatement: string;

  // ============================================
  // STEP 6: Our Values
  // ============================================
  @ApiProperty({ 
    example: 'Integrity, Compassion, Excellence, Accountability...', 
    description: 'Organizational values (max 150 words)' 
  })
  @IsString()
  values: string;

  // ============================================
  // STEP 7: Skills (Required Skills for volunteers/job seekers)
  // ============================================
  @ApiProperty({ 
    example: ['Project Management', 'Community Outreach', 'Fundraising'], 
    description: 'Skills required for volunteers/positions' 
  })
  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  // ============================================
  // OPTIONAL: Additional Fields
  // ============================================
  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Contact person first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Smith', description: 'Contact person last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'Executive Director', description: 'Contact person position' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ 
    example: { twitter: 'https://twitter.com/org', facebook: 'https://facebook.com/org' }, 
    description: 'Social media links' 
  })
  @IsOptional()
  socialMediaLinks?: Record<string, string>;
}

