export declare class ExperienceEntryDto {
    company: string;
    position: string;
    employmentType: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
    location?: string;
    state?: string;
    postalCode?: string;
    description?: string;
}
export declare class EducationEntryDto {
    school: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
    description?: string;
}
export declare class CertificationEntryDto {
    name: string;
    issuingOrganization?: string;
    issueDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    fileUploadId?: string;
}
export declare class CreateComprehensiveApplicationDto {
    jobId: string;
    coverLetter?: string;
    resumeUploadId?: string;
    fullName: string;
    email: string;
    phone?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    yearsOfExperience?: string;
    currentEmployer?: string;
    expectedSalary?: string;
    availabilityDate?: string;
    willingToRelocate?: boolean;
    referenceContact?: string;
    experiences?: ExperienceEntryDto[];
    education?: EducationEntryDto[];
    certifications?: CertificationEntryDto[];
    hardSkills?: string[];
    techSkills?: string[];
}
