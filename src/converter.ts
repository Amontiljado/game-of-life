import {CELL_SIZE} from "./constants";

export class Converter {
    static cellToCoordinates(row: number, column: number): { x: number, y: number } {
        return {
            x: column * CELL_SIZE,
            y: row * CELL_SIZE,
        };
    }

    static coordinatesToCell(x: number, y: number): {row: number, column: number} {
        return {
            row: Math.round(y / CELL_SIZE - 1),
            column: Math.round(x / CELL_SIZE - 1),
        };
    }
}