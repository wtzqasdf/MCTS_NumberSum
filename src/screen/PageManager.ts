import { SearchResult } from "../algorithm/MCTS";

export default class PageManager {
    private el_learningRate: HTMLInputElement;
    private el_learning_amount: HTMLInputElement;
    private el_show_speed: HTMLInputElement;
    private el_actions: HTMLInputElement;
    private el_answer: HTMLInputElement;
    private el_start: HTMLButtonElement;
    private el_stop: HTMLButtonElement;
    private el_section_result: HTMLDivElement;

    private callback_start?: () => void;
    private callback_stop?: () => void;

    constructor() {
        this.el_learningRate = document.getElementById('input_learning_rate') as HTMLInputElement;
        this.el_learning_amount = document.getElementById('input_learning_amount') as HTMLInputElement;
        this.el_show_speed = document.getElementById('input_show_speed') as HTMLInputElement;
        this.el_actions = document.getElementById('input_actions') as HTMLInputElement;
        this.el_answer = document.getElementById('input_answer') as HTMLInputElement;
        this.el_start = document.getElementById('btn_start') as HTMLButtonElement;
        this.el_stop = document.getElementById('btn_stop') as HTMLButtonElement;
        this.el_section_result = document.getElementById('section_result') as HTMLDivElement;
        this.el_start.onclick = () => { this.btnStart() };
        this.el_stop.onclick = () => { this.btnStop() };
    }

    public getLearningRate(): number {
        return parseFloat(this.el_learningRate.value);
    }
    public getLearningAmount(): number {
        return parseInt(this.el_learning_amount.value);
    }
    public getShowSpeed(): number {
        return parseInt(this.el_show_speed.value);
    }
    public getActions(): number[] {
        const actions = this.el_actions.value;
        return actions.split(',').map(v => parseInt(v));
    }
    public getAnswer(): number {
        return parseInt(this.el_answer.value);
    }

    public onStart(callback: () => void) {
        this.callback_start = callback;
    }
    public onStop(callback: () => void) {
        this.callback_stop = callback;
    }

    public addResult(loopNumber: number, result: SearchResult) {
        //Section
        const el_result = document.createElement('div');
        el_result.className = 'result';
        //Header
        const el_header = document.createElement('h6');
        el_header.innerHTML = `Nu.${loopNumber}&nbsp;&nbsp;Answer:${result.status === 1 ? 'Correct&nbsp;&nbsp;' : 'Incorrect'}&nbsp;&nbsp;Step:${result.totalStep}`;
        //Step Details
        const el_step = document.createElement('div');
        el_step.className = 'step';
        el_step.innerHTML = result.steps.map(m => 
            `<b class="${m.tag === 'expansion' ? 'expansion' : 'known'}">${m.action}</b>
             <b class="sum">${m.sum}</b>`).join('&nbsp;=>&nbsp;');
        //Append Elements
        el_result.appendChild(el_header);
        el_result.appendChild(el_step);
        if (this.el_section_result.children.length === 0) {
            this.el_section_result.appendChild(el_result);
        } else {
            this.el_section_result.insertBefore(el_result, this.el_section_result.children[0]);
        }
    }
    public clearResult() {
        this.el_section_result.innerHTML = '';
    }
    public btnReset() {
        this.el_start.disabled = false;
        this.el_stop.disabled = true;
    }

    private btnStart() {
        this.el_start.disabled = true;
        this.el_stop.disabled = false;
        this.callback_start?.();
    }
    private btnStop() {
        this.el_start.disabled = false;
        this.el_stop.disabled = true;
        this.callback_stop?.();
    }
}