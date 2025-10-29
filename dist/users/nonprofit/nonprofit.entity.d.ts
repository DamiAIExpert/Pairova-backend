import { User } from '../shared/user.entity';
export declare class NonprofitOrg {
    userId: string;
    user: User;
    orgName: string;
    firstName: string;
    lastName: string;
    logoUrl: string;
    website: string;
    mission: string;
    missionStatement: string;
    values: string;
    phone: string;
    postalCode: string;
    sizeLabel: string;
    orgType: string;
    industry: string;
    foundedOn: Date;
    taxId: string;
    country: string;
    state: string;
    city: string;
    addressLine1: string;
    addressLine2: string;
    latitude: number;
    longitude: number;
    bio: string;
    position: string;
    registrationNumber: string;
    requiredSkills: string[] | {
        softSkills?: string[];
        hardSkills?: string[];
    };
    socialMediaLinks: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
    };
    certificateUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
