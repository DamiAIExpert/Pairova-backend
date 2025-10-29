export declare class UpdateNonprofitProfileDto {
    orgName?: string;
    firstName?: string;
    lastName?: string;
    logoUrl?: string;
    website?: string;
    mission?: string;
    values?: string;
    sizeLabel?: string;
    orgType?: string;
    industry?: string;
    foundedOn?: Date;
    taxId?: string;
    country?: string;
    state?: string;
    city?: string;
    addressLine1?: string;
    addressLine2?: string;
    bio?: string;
    position?: string;
    registrationNumber?: string;
    requiredSkills?: string[] | {
        softSkills?: string[];
        hardSkills?: string[];
    };
    socialMediaLinks?: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
    };
    certificateUrl?: string;
}
