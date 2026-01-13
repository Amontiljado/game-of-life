import {State} from "./models/state";
import {HEIGHT, WIDTH} from "./constants";
import {Cell} from "./models/cell";

export class GameOfLife {
    protected state: State;
    protected generation: number;
    protected deadToAliveNeighbors: number[];
    protected aliveToAliveNeighbors: number[];

    public initialize(lifeProbability: number, pattern: string): State {
        this.generation = 0;
        this.state = [];

        this.updatePattern(pattern);

        for (let i = 0; i < HEIGHT; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < WIDTH; j++) {
                const status = this.getStatusWithProbability(lifeProbability);
                const cell = {
                    row: i, column: j,
                    status,
                    next: status,
                    changed: true
                };
                row.push(cell);
            }
            this.state.push(row);
        }

        return this.state;
    }

    public updatePattern(pattern: string) {
        // todo verify by regex
        const [deadToAlive, aliveToAlive] = pattern.split('/');
        this.deadToAliveNeighbors = deadToAlive
            .split('')                          // string -> char[]
            .splice(1, deadToAlive.length)         // omit first symbol
            .map(digit => parseInt(digit));       // char[] -> number[]

        this.aliveToAliveNeighbors = aliveToAlive
            .split('')
            .splice(1, aliveToAlive.length)
            .map(digit => parseInt(digit));
    }

    // todo return state, check same-state problem in a better way
    public getNextState(): number {
        let changedCount = 0;
        this.generation++;
        console.log(`Calculating new state #${this.generation}`);
        for (let i = 0; i < HEIGHT; i++) {
            for (let j = 0; j < WIDTH; j++) {
                const cell = this.state[i][j];
                const aliveNeighbours = this.countAliveNeighbours(i, j);
                cell.next = this.getCellNextStatus(cell.status, aliveNeighbours);
                cell.changed = cell.status !== cell.next;

                if (cell.changed) changedCount++;
            }
        }

        console.log(`State #${this.generation} calculated, ${changedCount} cells changed their state`);
        return changedCount;
    };

    public invertState(): State {
        for (let i = 0; i < HEIGHT; i++) {
            for (let j = 0; j < WIDTH; j++) {
                const cell = this.state[i][j];
                cell.status = !cell.status;
                if (cell.next !== undefined) {
                    cell.next = !cell.next;
                }
                cell.changed = true;
            }
        }
        return this.state;
    }

    public getCurrentState(): State {
        return this.state;
    }

    protected getCellNextStatus(currentStatus: boolean, aliveNeighbours: number): boolean {
        if (currentStatus) {
            return this.aliveToAliveNeighbors.includes(aliveNeighbours);
        }
        return this.deadToAliveNeighbors.includes(aliveNeighbours);
    };

    protected countAliveNeighbours(row: number, column: number): number {
        const topRow = row !== 0 ? row - 1 : HEIGHT - 1;
        const bottomRow = row !== HEIGHT - 1 ? row + 1 : 0;
        const leftColumn = column !== 0 ? column - 1 : WIDTH - 1;
        const rightColumn = column !== WIDTH - 1 ? column + 1 : 0;

        // todo support different search patterns
        // clockwise
        return [
            this.state[topRow][column].status,
            this.state[topRow][rightColumn].status,
            this.state[row][rightColumn].status,
            this.state[bottomRow][rightColumn].status,
            this.state[bottomRow][column].status,
            this.state[bottomRow][leftColumn].status,
            this.state[row][leftColumn].status,
            this.state[topRow][leftColumn].status,
        ].filter(Boolean).length;
    }

    private getStatusWithProbability(probability: number): boolean {
        return Math.random() < probability;
    }
}