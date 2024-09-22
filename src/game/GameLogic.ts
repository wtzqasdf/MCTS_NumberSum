export default class GameLogic {
    private answer: number;
    private actions: number[];

    constructor() {
        this.answer = 0;
        this.actions = [];
    }

    public setAnswer(num: number) {
        this.answer = num;
    }
    public setActions(actions: number[]) {
        this.actions = actions;
    }

    public getActions() {
        return this.actions;
    }

    public getTargetStatus(input: number): number {
        if (input < this.answer) {
            return 0;
        } else if (input === this.answer) {
            return 1;
        } else {
            return -1;
        }
    }
}