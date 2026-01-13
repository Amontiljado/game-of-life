import {CellType} from "../models/cell-type";
import {DefaultVisualizer} from "./default";
import {CircleVisualizer} from "./circle";
import {CatVisualizer} from "./cat";

export const getVisualizer = (type: CellType) => {
    switch (type) {
        case CellType.CAT:
            return CatVisualizer;
        case CellType.CIRCLE:
            return CircleVisualizer;
        default:
            if (type !== CellType.DEFAULT) {
                console.warn(`Cannot find visualizer for type ${type}, default visualizer will be used`);
            }
            return DefaultVisualizer;
    }
}