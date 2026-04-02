import { PersonalTask } from "../entities/PersonalTask";

export interface IPersonalTaskRepository {
    create(task: PersonalTask): Promise<PersonalTask>;
    findByUserId(userId: string): Promise<PersonalTask[]>;
    findById(id: string): Promise<PersonalTask | null>;
    update(id: string, updates: Partial<PersonalTask>): Promise<PersonalTask | null>;
    delete(id: string): Promise<boolean>;
    updateTimer(id: string , timeSpent: number, isTimerRunning: boolean): Promise<PersonalTask | null>
}