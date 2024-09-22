import GameLogic from "../game/GameLogic";
import TreeNode from "./TreeNode";

export class MCTS {
    private rootNode: TreeNode | null;
    private learningRate: number;
    private learningAmount: number;
    private speed: number;

    private loopAmount: number;
    private timerObject: number;

    private callback_result?: (loopNumber: number, result: SearchResult) => void;
    private callback_completed?: () => void;

    constructor() {
        this.rootNode = null;
        this.loopAmount = 0;
        this.learningRate = 0;
        this.learningAmount = 0;
        this.speed = 1;
        this.timerObject = -1;
    }

    public setVariables(
        learningRate: number, 
        learningAmount: number,
        speed: number) {
        this.learningRate = learningRate;
        this.learningAmount = learningAmount;
        this.speed = speed;
    }

    public onResult(callback: (loopNumber: number, searchResult: SearchResult) => void) {
        this.callback_result = callback;
    }
    public onCompleted(callback: () => void) {
        this.callback_completed = callback;
    }

    public search(gameLogic: GameLogic) {
        if (this.rootNode === null) {
            this.rootNode = new TreeNode(0);
        }
        this.loopAmount = 0;
        this.timerObject = setInterval(() => {
            if (this.loopAmount >= this.learningAmount) {
                this.rootNode = null;
                this.callback_completed?.();
                clearInterval(this.timerObject);
                return;
            }
            const result = this.rootNode!.do(gameLogic, this.rootNode!.action, this.learningRate, 0, []);
            this.loopAmount++;
            this.callback_result?.(this.loopAmount, result);
        }, 1000 / this.speed);
    }

    public stop() {
        this.rootNode = null;
        clearInterval(this.timerObject);
    }
}

export class SearchResult {
    public status: number = 0;
    public totalStep: number = 0;
    public steps: SearchStep[] = [];
}

export class SearchStep {
    public tag: string = '';
    public action: number = 0;
    public sum: number = 0;
}