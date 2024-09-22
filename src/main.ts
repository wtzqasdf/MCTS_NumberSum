import GameLogic from "./game/GameLogic";
import { MCTS } from "./algorithm/MCTS";
import PageManager from "./screen/PageManager";

const gameLogic = new GameLogic();
const mcts = new MCTS();
const pageManager = new PageManager();
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