import {Visualizer} from "./visualizer";
import {CELL_SIZE} from "../constants";

export class CatVisualizer extends Visualizer {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, new Map([
            [true, 'cat_open'],
            [false, 'cat_closed'],
        ]));
    }

    protected drawCell(x: number, y: number, status: boolean): void {
        this.context.clearRect(x, y, CELL_SIZE, CELL_SIZE);
        this.context.drawImage(this.statusToImage.get(status), x, y, CELL_SIZE, CELL_SIZE);
    }
}