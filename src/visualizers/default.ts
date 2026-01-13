import {Visualizer} from "./visualizer";
import {CELL_SIZE} from "../constants";

export class DefaultVisualizer extends Visualizer {
    protected drawCell(x: number, y: number, status: boolean): void {
        if (status) {
            this.context.beginPath();
            this.context.rect(x, y, CELL_SIZE, CELL_SIZE);
            this.context.fill();
        } else {
            this.context.clearRect(x, y, CELL_SIZE, CELL_SIZE);
        }
    }
}