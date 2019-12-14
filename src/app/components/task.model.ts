export interface Task {
    task_id?: string;
    title: string;
    description? : string;
    status?: string;
    assigned_to: string;
    due_date?: Date;
    checklist:  ChecklistItem[];
    board_id?: number;
    board_name?: string;
    team_id?: number;
}

export interface ChecklistItem {
    item_id?: number;
    completed: boolean;
    list_item: string;
}

export interface TaskBoard {
    board_id: number;
    board_name?: string;
    tasks: Task[];
}