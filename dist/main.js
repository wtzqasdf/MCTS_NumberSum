var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("game/GameLogic", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GameLogic {
        constructor() {
            this.answer = 0;
            this.actions = [];
        }
        setAnswer(num) {
            this.answer = num;
        }
        setActions(actions) {
            this.actions = actions;
        }
        getActions() {
            return this.actions;
        }
        getTargetStatus(input) {
            if (input < this.answer) {
                return 0;
            }
            else if (input === this.answer) {
                return 1;
            }
            else {
                return -1;
            }
        }
    }
    exports.default = GameLogic;
});
define("helpers/MathHelper", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.randNumber = randNumber;
    exports.randFloat = randFloat;
    exports.randInt = randInt;
    function randNumber(numbers) {
        const idx = Math.round(Math.random() * (numbers.length - 1));
        return numbers[idx];
    }
    function randFloat(min, max) {
        return (Math.random() * (max - min)) + min;
    }
    function randInt(min, max) {
        return Math.round((Math.random() * (max - min)) + min);
    }
});
define("algorithm/TreeNode", ["require", "exports", "helpers/MathHelper"], function (require, exports, MathHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TreeNode {
        constructor(action) {
            this.nodes = [];
            this.action = action;
            this.isEnd = false;
        }
        do(gameLogic, sum, learningRate, totalStep, steps) {
            const targetStatus = gameLogic.getTargetStatus(sum);
            //Status is zero, It means not achieved
            if (targetStatus === 0) {
                let node = null;
                //Get default actions
                const actions = gameLogic.getActions();
                //Create first node if length is zero
                if (this.nodes.length === 0) {
                    const rand_action = (0, MathHelper_1.randNumber)(actions);
                    sum += rand_action;
                    node = new TreeNode(rand_action);
                    this.nodes.push(node);
                    steps.push({ tag: 'expansion', action: rand_action, sum: sum });
                }
                else {
                    //Get random learning rate from currently nodes
                    const rand_learning_rate = (0, MathHelper_1.randFloat)(1, this.nodes.length) / actions.length;
                    if (rand_learning_rate > learningRate || this.nodes.length == actions.length) {
                        //Use known node and get valuable action (max action value)
                        node = this.getMaxActionNode();
                        sum += node.action;
                        steps.push({ tag: 'known', action: node.action, sum: sum });
                    }
                    else {
                        //Create new node
                        const unknownActions = this.excludeKnownActions(actions);
                        const rand_action = (0, MathHelper_1.randNumber)(unknownActions);
                        sum += rand_action;
                        node = new TreeNode(rand_action);
                        this.nodes.push(node);
                        steps.push({ tag: 'expansion', action: rand_action, sum: sum });
                    }
                }
                //Recursion and return result
                totalStep++;
                return node.do(gameLogic, sum, learningRate, totalStep, steps);
            }
            //Status is one, It means ended and correct
            else if (targetStatus === 1) {
                this.isEnd = true;
                return { status: targetStatus, totalStep: totalStep, steps: steps };
            }
            else {
                //Ended and incorrect
                this.isEnd = true;
                return { status: targetStatus, totalStep: totalStep, steps: steps };
            }
        }
        excludeKnownActions(origin) {
            const knownSet = new Set(this.nodes.map(m => m.action));
            return [...origin.filter(f => knownSet.has(f) === false)];
        }
        getMaxActionNode() {
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
    exports.default = TreeNode;
});
define("algorithm/MCTS", ["require", "exports", "algorithm/TreeNode"], function (require, exports, TreeNode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchStep = exports.SearchResult = exports.MCTS = void 0;
    TreeNode_1 = __importDefault(TreeNode_1);
    class MCTS {
        constructor() {
            this.rootNode = null;
            this.loopAmount = 0;
            this.learningRate = 0;
            this.learningAmount = 0;
            this.speed = 1;
            this.timerObject = -1;
        }
        setVariables(learningRate, learningAmount, speed) {
            this.learningRate = learningRate;
            this.learningAmount = learningAmount;
            this.speed = speed;
        }
        onResult(callback) {
            this.callback_result = callback;
        }
        onCompleted(callback) {
            this.callback_completed = callback;
        }
        search(gameLogic) {
            if (this.rootNode === null) {
                this.rootNode = new TreeNode_1.default(0);
            }
            this.loopAmount = 0;
            this.timerObject = setInterval(() => {
                var _a, _b;
                if (this.loopAmount >= this.learningAmount) {
                    this.rootNode = null;
                    (_a = this.callback_completed) === null || _a === void 0 ? void 0 : _a.call(this);
                    clearInterval(this.timerObject);
                    return;
                }
                const result = this.rootNode.do(gameLogic, this.rootNode.action, this.learningRate, 0, []);
                this.loopAmount++;
                (_b = this.callback_result) === null || _b === void 0 ? void 0 : _b.call(this, this.loopAmount, result);
            }, 1000 / this.speed);
        }
        stop() {
            this.rootNode = null;
            clearInterval(this.timerObject);
        }
    }
    exports.MCTS = MCTS;
    class SearchResult {
        constructor() {
            this.status = 0;
            this.totalStep = 0;
            this.steps = [];
        }
    }
    exports.SearchResult = SearchResult;
    class SearchStep {
        constructor() {
            this.tag = '';
            this.action = 0;
            this.sum = 0;
        }
    }
    exports.SearchStep = SearchStep;
});
define("screen/PageManager", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PageManager {
        constructor() {
            this.el_learningRate = document.getElementById('input_learning_rate');
            this.el_learning_amount = document.getElementById('input_learning_amount');
            this.el_show_speed = document.getElementById('input_show_speed');
            this.el_actions = document.getElementById('input_actions');
            this.el_answer = document.getElementById('input_answer');
            this.el_start = document.getElementById('btn_start');
            this.el_stop = document.getElementById('btn_stop');
            this.el_section_result = document.getElementById('section_result');
            this.el_start.onclick = () => { this.btnStart(); };
            this.el_stop.onclick = () => { this.btnStop(); };
        }
        getLearningRate() {
            return parseFloat(this.el_learningRate.value);
        }
        getLearningAmount() {
            return parseInt(this.el_learning_amount.value);
        }
        getShowSpeed() {
            return parseInt(this.el_show_speed.value);
        }
        getActions() {
            const actions = this.el_actions.value;
            return actions.split(',').map(v => parseInt(v));
        }
        getAnswer() {
            return parseInt(this.el_answer.value);
        }
        onStart(callback) {
            this.callback_start = callback;
        }
        onStop(callback) {
            this.callback_stop = callback;
        }
        addResult(loopNumber, result) {
            //Section
            const el_result = document.createElement('div');
            el_result.className = 'result';
            //Header
            const el_header = document.createElement('h6');
            el_header.innerHTML = `Nu.${loopNumber}&nbsp;&nbsp;Answer:${result.status === 1 ? 'Correct&nbsp;&nbsp;' : 'Incorrect'}&nbsp;&nbsp;Step:${result.totalStep}`;
            //Step Details
            const el_step = document.createElement('div');
            el_step.className = 'step';
            el_step.innerHTML = result.steps.map(m => `<b class="${m.tag === 'expansion' ? 'expansion' : 'known'}">${m.action}</b>
             <b class="sum">${m.sum}</b>`).join('&nbsp;=>&nbsp;');
            //Append Elements
            el_result.appendChild(el_header);
            el_result.appendChild(el_step);
            if (this.el_section_result.children.length === 0) {
                this.el_section_result.appendChild(el_result);
            }
            else {
                this.el_section_result.insertBefore(el_result, this.el_section_result.children[0]);
            }
        }
        clearResult() {
            this.el_section_result.innerHTML = '';
        }
        btnReset() {
            this.el_start.disabled = false;
            this.el_stop.disabled = true;
        }
        btnStart() {
            var _a;
            this.el_start.disabled = true;
            this.el_stop.disabled = false;
            (_a = this.callback_start) === null || _a === void 0 ? void 0 : _a.call(this);
        }
        btnStop() {
            var _a;
            this.el_start.disabled = false;
            this.el_stop.disabled = true;
            (_a = this.callback_stop) === null || _a === void 0 ? void 0 : _a.call(this);
        }
    }
    exports.default = PageManager;
});
define("main", ["require", "exports", "game/GameLogic", "algorithm/MCTS", "screen/PageManager"], function (require, exports, GameLogic_1, MCTS_1, PageManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    GameLogic_1 = __importDefault(GameLogic_1);
    PageManager_1 = __importDefault(PageManager_1);
    const gameLogic = new GameLogic_1.default();
    const mcts = new MCTS_1.MCTS();
    const pageManager = new PageManager_1.default();
    pageManager.onStart(() => {
        const learningRate = pageManager.getLearningRate();
        const learningAmount = pageManager.getLearningAmount();
        const actions = pageManager.getActions();
        const answer = pageManager.getAnswer();
        const showSpeed = pageManager.getShowSpeed();
        pageManager.clearResult();
        gameLogic.setAnswer(answer);
        gameLogic.setActions(actions);
        mcts.setVariables(learningRate, learningAmount, showSpeed);
        mcts.search(gameLogic);
    });
    pageManager.onStop(() => {
        mcts.stop();
    });
    mcts.onResult((loopNumber, result) => {
        pageManager.addResult(loopNumber, result);
    });
    mcts.onCompleted(() => {
        pageManager.btnReset();
    });
});
