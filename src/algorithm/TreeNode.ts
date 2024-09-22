import GameLogic from "../game/GameLogic";
import { randNumber, randFloat } from '../helpers/MathHelper';
import { SearchResult, SearchStep } from './MCTS';

export default class TreeNode {
    private nodes: TreeNode[];
    public action: number;

    private isEnd: boolean;

    constructor(action: number) {
        this.nodes = [];
        this.action = action;
        this.isEnd = false;
    }

    public do(gameLogic: GameLogic, sum: number, learningRate: number, totalStep: number, steps: SearchStep[]): 
              SearchResult {
        const targetStatus = gameLogic.getTargetStatus(sum);
        //Status is zero, It means not achieved
        if (targetStatus === 0) {
            let node: TreeNode | null = null;
            //Get default actions
            const actions = gameLogic.getActions();
            //Create first node if length is zero
            if (this.nodes.length === 0) {
                const rand_action = randNumber(actions);
                sum += rand_action;
                node = new TreeNode(rand_action);
                this.nodes.push(node);
                steps.push({ tag: 'expansion', action: rand_action, sum: sum});
            } else {
                //Get random learning rate from currently nodes
                const rand_learning_rate = randFloat(1, this.nodes.length) / actions.length;
                if (rand_learning_rate > learningRate || this.nodes.length == actions.length) {
                    //Use known node and get valuable action (max action value)
                    node = this.getMaxActionNode();
                    sum += node.action;
                    steps.push({ tag: 'known', action: node.action, sum: sum });
                } else {
                    //Create new node
                    const unknownActions = this.excludeKnownActions(actions);
                    const rand_action = randNumber(unknownActions);
                    sum += rand_action;
                    node = new TreeNode(rand_action);
                    this.nodes.push(node);
                    steps.push({ tag: 'expansion', action: rand_action, sum: sum });
                }
            }
            //Recursion and return result
            totalStep++;
            return node!.do(gameLogic, sum, learningRate, totalStep, steps);
        }
        //Status is one, It means ended and correct
        else if (targetStatus === 1) {
            this.isEnd = true;
            return { status: targetStatus, totalStep: totalStep, steps: steps };
        } else {
            //Ended and incorrect
            this.isEnd = true;
            return { status: targetStatus, totalStep: totalStep, steps: steps };
        }
    }

    private excludeKnownActions(origin: number[]) {
        const knownSet = new Set(this.nodes.map(m => m.action));
        return [...origin.filter(f => knownSet.has(f) === false)];
    }

    private getMaxActionNode() {
        let maxAction = this.nodes[0].action;
        let index = 0;
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].isEnd)
                continue;
            if (this.nodes[i].action > maxAction) {
                maxAction = this.nodes[i].action;
                index = i;
            }
        }
        return this.nodes[index];
    }
}