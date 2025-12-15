export interface TaskInput {
    title: string;
    description?: string;
    labels: string[];
    done?: boolean; 
}

export interface TaskOutput {
    id: number;
    title: string;
    description: string | null;
    labels: string[]; 
    done: boolean;
    createdAt: Date;
    updatedAt: Date;
}