import {CELL_SIZE, DEFAULT_LIFE_PROBABILITY, DELAY, HEIGHT, WIDTH} from "./constants";
import {CellType} from "./models/cell-type";
import {Visualizer} from "./visualizers/visualizer";
import {getVisualizer} from "./visualizers/get-visualizer";
import {GameOfLife} from "./game-of-life";
import {GameType} from "./models/game-type";
import {State} from "./models/state";

export class Main {
    private readonly canvas: HTMLCanvasElement;

    private readonly lifeProbabilityInput: HTMLInputElement;
    private readonly lifeProbabilityLabel: HTMLLabelElement;

    private readonly playButton: HTMLButtonElement;
    private readonly drawButton: HTMLButtonElement;
    private readonly resetButton: HTMLButtonElement;
    private readonly invertButton: HTMLButtonElement;
    private readonly nextStepButton: HTMLButtonElement;

    private readonly styleSelector: HTMLSelectElement;
    private readonly gameTypeSelector: HTMLSelectElement;

    private lifeProbability: number;
    private playback: boolean = false;

    // todo draw mode
    // private draw: boolean = false;
    private nodeStyle: CellType = CellType.DEFAULT;
    private gameType: GameType = GameType.DEFAULT;

    private visualizer: Visualizer;
    private gameOfLife: GameOfLife;

    private state: State;

    private invertOnNextStep = false;

    constructor() {
        this.canvas = document.createElement("canvas");
        this.visualizer = new (getVisualizer(this.nodeStyle))(this.canvas);

        this.playButton = document.getElementById('play') as HTMLButtonElement
        this.drawButton = document.getElementById('draw') as HTMLButtonElement;
        this.resetButton = document.getElementById('reset') as HTMLButtonElement;
        this.invertButton = document.getElementById('invert') as HTMLButtonElement;
        this.nextStepButton = document.getElementById('step') as HTMLButtonElement;

        this.lifeProbabilityInput = document.getElementById('lifeProbability') as HTMLInputElement;
        this.lifeProbabilityLabel = document.getElementById('lifeProbabilityLabel') as HTMLLabelElement;

        this.lifeProbability = DEFAULT_LIFE_PROBABILITY;

        this.styleSelector = document.getElementById('style') as HTMLSelectElement;

        this.gameTypeSelector = document.getElementById('game') as HTMLSelectElement;

        setTimeout(() => this.init(), 200);
    }

    init() {
        this.configureCanvas();
        this.configureProbability();
        this.configurePlayback();
        this.configureReset();
        this.configureInvert();
        this.configureNextStep();
        this.configureStyleSelector();
        this.configureGameTypeSelector();

        this.configureGame();
    }

    configureCanvas() {
        this.canvas.width = WIDTH * CELL_SIZE;
        this.canvas.height = HEIGHT * CELL_SIZE;
        this.canvas.getContext('2d').strokeStyle = 'transparent';
        document.body.appendChild(this.canvas);
    }

    configureProbability() {
        this.lifeProbabilityInput.value = this.lifeProbability * 100 + '';
        this.lifeProbabilityLabel.innerText = `Life probability: ${this.lifeProbabilityInput.value}%`;

        this.lifeProbabilityInput.addEventListener('input', () => {
            this.lifeProbability = parseInt(this.lifeProbabilityInput.value) / 100;
            this.lifeProbabilityLabel.innerText = `Life probability: ${this.lifeProbabilityInput.value}%`;

            this.resetButton.click();
        });
    }

    configureStyleSelector() {
        this.styleSelector.addEventListener('change', () => {
            this.nodeStyle = this.styleSelector.value as CellType;
            this.visualizer = new (getVisualizer(this.nodeStyle))(this.canvas);
            this.visualizer.drawState(this.state, true);
        });
    }

    configureGameTypeSelector() {
        this.gameTypeSelector.addEventListener('change', () => {
            this.gameType = this.gameTypeSelector.value as GameType;

            this.gameOfLife.updatePattern(this.gameType);
        });
    }

    configureReset() {
        this.resetButton.addEventListener('click', () => {
            if (this.playback) this.playButton.click();

            this.state = this.gameOfLife.initialize(this.lifeProbability, this.gameType);
            this.visualizer.drawState(this.state);
        });
    }

    configureNextStep() {
        this.nextStepButton.addEventListener('click', () => {
            this.gameOfLife.getNextState();
            this.state = this.gameOfLife.getCurrentState();
            this.visualizer.drawState(this.state);
        });
    }

    configureInvert() {
        this.invertButton.addEventListener('click', () => {
            if (this.playback) {
                this.invertOnNextStep = true;
            } else {
                this.state = this.gameOfLife.invertState();
                this.visualizer.drawState(this.state, true);
            }
        });
    }

    configureGame() {
        this.gameOfLife = new GameOfLife();
        this.state = this.gameOfLife.initialize(this.lifeProbability, this.gameType);
        this.visualizer.drawState(this.state, true);
    }

    configurePlayback() {
        this.playButton.addEventListener('click', () => this.setPlayback(!this.playback));
        this.playback = false;
    }

    private setPlayback(newPlaybackState: boolean) {
        this.drawButton.disabled = newPlaybackState;
        this.nextStepButton.disabled = newPlaybackState;
        this.lifeProbabilityInput.disabled = newPlaybackState;
        this.styleSelector.disabled = newPlaybackState;
        this.gameTypeSelector.disabled = newPlaybackState;

        if (newPlaybackState) {
            this.playButton.innerText = 'Pause';
            this.playback = newPlaybackState;
            this.playGame();
        } else {
            this.playButton.innerText = 'Play';
            this.playback = newPlaybackState;
        }
    };

    private playGame () {
        const changedCells = this.gameOfLife.getNextState();
        if (this.playback && !!changedCells) {
            this.state = this.gameOfLife.getCurrentState();
            if (this.invertOnNextStep) {
                this.state = this.gameOfLife.invertState();
                this.invertOnNextStep = false;
            }
            this.visualizer.drawState(this.state);
            setTimeout(() => this.playGame(), DELAY);
        } else {
            this.setPlayback(false);
        }
    };
}


new Main();


