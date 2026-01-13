export interface Cell {
    row: number;
    column: number;

    status: boolean;
    changed: boolean;
    next?: boolean;
}