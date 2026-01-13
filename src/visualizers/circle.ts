import {Visualizer} from "./visualizer";
import {CELL_SIZE} from "../constants";

export class CircleVisualizer extends Visualizer {
    protected drawCell(x: number, y: number, status: boolean): void {
        if (status) {
            this.context.beginPath();
            this.context.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2, 0, 2 * Math.PI);
            this.context.fill();
        } else {
            this.context.clearRect(x, y, CELL_SIZE, CELL_SIZE);
        }
    }
}