import {State} from "../models/state";
import {CELL_SIZE, HEIGHT, WIDTH} from "../constants";

export abstract class Visualizer {
    protected readonly context: CanvasRenderingContext2D;

    protected readonly statusToImage: Map<boolean, HTMLImageElement>;

    // todo Map -> array
    constructor(private canvas: HTMLCanvasElement, imgIds?: Map<boolean, string>) {
        this.context = this.canvas.getContext('2d');

        if (imgIds) {
            this.statusToImage = new Map<boolean, HTMLImageElement>();

            [...imgIds.entries()].forEach(([status, imgId]) => {
                const image = document.getElementById(imgId) as HTMLImageElement;
                if (!image) throw new Error(`Cannot find image for status ${status} and id ${imgId}!`);

                this.statusToImage.set(status, image);
            });
        }

        window.requestAnimationFrame(
            () => this.context.clearRect(0, 0, WIDTH * CELL_SIZE, HEIGHT * CELL_SIZE)
        );
    }

    public drawState(state: State, forced?: boolean): void {
        const cellsToRedraw = forced
            ? state.flat()
            : state.flat().filter(({changed}) => changed);

        const timestamp = window.requestAnimationFrame(
            () => cellsToRedraw.forEach(cell => {
                const {row, column, next, status} = cell;
                const statusToDraw = forced ? status : next;
                const {x, y} = this.cellToCoordinates(row, column);

                this.drawCell(x, y, statusToDraw);

                if (!forced) {
                    cell.status = next;
                    cell.next = undefined;
                    cell.changed = false;
                }
            })
        );
    };

    protected abstract drawCell(x: number, y: number, newStatus: boolean): void;

    protected cellToCoordinates(row: number, column: number): { x: number, y: number } {
        return {
            x: column * CELL_SIZE,
            y: row * CELL_SIZE,
        };
    }
}