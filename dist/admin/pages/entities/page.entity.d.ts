import { PageType } from '../../../common/enums/page-type.enum';
export declare class Page {
    id: string;
    slug: string;
    title: string;
    type: PageType;
    content: Record<string, any>;
    heroImageUrl: string;
    lastPublishedAt: Date;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
