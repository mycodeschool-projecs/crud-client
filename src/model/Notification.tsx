export interface Notification {
    id: number;
    operation: string;
    entityType: string;
    entityId: string;
    details: string;
    sourceService: string;
    timestamp: Date;
    read: boolean;
}